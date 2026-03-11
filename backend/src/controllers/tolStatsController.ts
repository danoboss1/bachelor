import type { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Helper: produce YYYY-MM-DD key in local server time.
 * (Good enough for monthly aggregations. If you want strict UTC day keys,
 * we can switch to UTC getters.)
 */
// Pozriet v akom casovom pasme ukladam data do databazy a mozno zmenit!
function toDateKey(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

/** Helper: days in a given month (month is 1..12) */
function daysInMonth(year: number, month1to12: number): number {
    return new Date(year, month1to12, 0).getDate();
}

/**
 * Define what “best score” means for WCST chart.
 * Default: categories_completed (0..6).
 *
 * If you later want something else (e.g. 100 - errorpercent),
 * change only this function.
 */
function computeScore(stat: any): number {
    return Number(stat.totalscore ?? 0);
}

/** priemer */
function mean(nums: number[]): number {
    if (!nums.length) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// tuto ked vrati 0 tak urobit nieco ine
/** percent difference (napr +7 znamená +7%) */
function percentDiff(current: number, baseline: number): number {
    if (baseline === 0) return 0;
    return ((current - baseline) / baseline) * 100;
}

/**
 * Optional: Your category bar index logic (0..4) from the frontend.
 * Useful to include in responses for UI.
 */
// Mozem to nechat tu na backende, ale potom to musim odstranit z frontendu
function getTolCategoryIndex(totalScore: number) {
    if (totalScore <= 3) return 0;
    if (totalScore <= 5) return 1;
    if (totalScore <= 8) return 2;
    if (totalScore <= 11) return 3;
    return 4; // 12+
}

// toto robi co, skor ako to robi
function safeTimeMs(t: Date | null): number {
    return t ? t.getTime() : 0;
}

/**
 * Vytiahne "best stat per day" pre usera (len dni, kde existuje výsledok),
 * zoradené podľa dňa ASC.
 */
async function getBestPerDay(userId: number) {
    const stats = await prisma.stats_tol.findMany({
        where: { user_id: userId },
        orderBy: { time: "asc" },
    });

    const bestByDay = new Map<string, { bestScore: number; bestStat: any }>();

    for (const s of stats) {
        if (!s.time) continue;

        const dayKey = toDateKey(s.time);
        const score = computeScore(s);

        const current = bestByDay.get(dayKey);
        if (!current) {
            bestByDay.set(dayKey, { bestScore: score, bestStat: s });
            continue;
        }

        if (score > current.bestScore) {
            bestByDay.set(dayKey, { bestScore: score, bestStat: s });
            continue;
        }

        // tuto tu druhu metriku dat mensi pocet trials_administered
        if (score === current.bestScore) {
            const tNew = safeTimeMs(s.time);
            const tOld = safeTimeMs(current.bestStat.time);
            if (tNew > tOld) {
                bestByDay.set(dayKey, { bestScore: score, bestStat: s });
            }
        }
    }

    const days = Array.from(bestByDay.entries())
        .map(([date, obj]) => ({ date, score: Number(obj.bestScore), bestStat: obj.bestStat }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return days;
}

export class TolStatsController {
    static getStat = async (req: Request, res: Response) => {
        try {
            const { statId } = req.params;

            if (statId == null) {
                return res.status(400).json({ error: "statId is required" });
            }

            const stat = await prisma.stats_tol.findUnique({
                where: { id: parseInt(statId) }
            });

            res.json(stat);
        } catch (error) {
            console.error("Error fetching statistics", error);
            res.status(500).json({ error: "Server error" });
        }
    };

    static saveStat = async (req: Request, res: Response) => {
        try {
            const {
                time,
                fourMovesSequencesCorrect,
                fiveMovesSequencesCorrect,
                sixMovesSequencesCorrect,
                totalCorrect,
                totalScore,
                user_id,
            } = req.body;

            if (time == null) return res.status(400).json({ error: "time is required" })
            if (fourMovesSequencesCorrect == null) return res.status(400).json({ error: "fourMovesSequencesCorrect is required" });
            if (fiveMovesSequencesCorrect == null) return res.status(400).json({ error: "fiveMovesSequencesCorrect is required" });
            if (sixMovesSequencesCorrect == null) return res.status(400).json({ error: "sixMovesSequencesCorrect is required" });
            if (totalCorrect == null) return res.status(400).json({ error: "totalCorrect is required" });
            if (totalScore == null) return res.status(400).json({ error: "totalScore is required" });
            if (user_id == null) return res.status(400).json({ error: "user_id is required" });

            const stat = await prisma.stats_tol.create({
                data: {
                    time: time,
                    fourmovessequencescorrect: fourMovesSequencesCorrect,
                    fivemovessequencescorrect: fiveMovesSequencesCorrect,
                    sixmovessequencescorrect: sixMovesSequencesCorrect,
                    totalcorrect: totalCorrect,
                    totalscore: totalScore,
                    user_id: user_id,
                },
                select: {
                    id: true,
                    time: true,
                    fourmovessequencescorrect: true,
                    fivemovessequencescorrect: true,
                    sixmovessequencescorrect: true,
                    totalcorrect: true,
                    totalscore: true,
                    user_id: true
                }
            });

            // nema tu byt status 200?
            res.status(201).json(stat);
        } catch (error) {
            console.error("Error saving tol statistics", error);
            res.status(500).json({ error: "Server error" });
        }
    };

    static getMonthlyBestPerDay = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const year = Number(req.query.year);
            const month = Number(req.query.month);

            if (!year || !month || month < 1 || month > 12) {
                return res.status(400).json({ error: "Year and month are required (month 1-12)" });
            }

            const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
            const end = new Date(year, month, 1, 0, 0, 0, 0);

            const stats = await prisma.stats_tol.findMany({
                where: {
                    user_id: userId,
                    time: { gte: start, lt: end },
                },
                orderBy: { time: "asc" },
            });

            // pick best per day
            const bestByDay = new Map<
                string,
                { bestScore: number; bestStat: any }
            >();

            for (const s of stats) {
                if (!s.time) continue; // alebo: throw new Error("DB contains stats with null time");

                const dayKey = toDateKey(s.time);
                const score = computeScore(s);

                const current = bestByDay.get(dayKey);
                if (!current) {
                    bestByDay.set(dayKey, { bestScore: score, bestStat: s });
                    continue;
                }

                const currentScore = Number(current.bestScore);

                if (score > currentScore) {
                    bestByDay.set(dayKey, { bestScore: score, bestStat: s });
                    continue;
                }

                // Toto neplati pre ToL
                // Tento tie-breaker upravit
                // malo by to brat nizsi pocet trials_administered
                // a cas potom alebo mozno je aj jendo
                // tie-breaker: newest time wins
                if (score === currentScore) {
                    const tNew = safeTimeMs(s.time);
                    const tOld = safeTimeMs(current.bestStat.time);
                    if (tNew > tOld) {
                        bestByDay.set(dayKey, { bestScore: score, bestStat: s });
                    }
                }
            }

            const dim = daysInMonth(year, month);

            const days = Array.from({ length: dim }, (_, i) =>{
                const date = new Date(year, month - 1, i + 1, 0, 0, 0, 0);
                const key = toDateKey(date);

                const found = bestByDay.get(key);

                if (!found) {
                    return {
                        date: key,            // "2026-03-01"
                        label: String(i + 1), // "1"
                        value: 0,
                        bestStat: null,
                        categoryIndex: null,
                    };
                }

                const totalscore = Number(found.bestStat.totalscore ?? 0);

                return {
                    date: key,
                    label: String(i + 1),
                    value: Number(found.bestScore),
                    bestStat: found.bestStat,
                    categoryIndex: getTolCategoryIndex(totalscore),
                };
            });

            return res.json({
                userId,
                range: { year, month },
                scoreDefinition: "totalScore (your TOL scoring)",
                days,
            });
        } catch (error) {
            console.error("Error fetching ToL monthly best per day:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };

    static getTrendMessage = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: "Unauthorized" });

            const allDays = await getBestPerDay(userId);

            if (allDays.length < 20) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    message: null,
                    reason: "Need at least 20 result-days (10 recent + 10 older).",
                });
            }

            const recent10 = allDays.slice(-10);
            const baselineDays = allDays.slice(0, -10);

            if (baselineDays.length < 10) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    message: null,
                    reason: "Need at least 10 result-days before the last 10."
                });
            }

            const baselineAvg = mean(baselineDays.map((d) => d.score));
            const recentAvg = mean(recent10.map((d) => d.score));

            // toto este treba vyriesit lebo moze nastat
            // if (baselineAvg === 0) {

            // }

            const avgDeltaPct = percentDiff(recentAvg, baselineAvg);

            const perDayDeltaPct = recent10.map((d) => ({
                date: d.date,
                score: d.score,
                deltaPct: percentDiff(d.score, baselineAvg),
            }));

            const better3Percent = perDayDeltaPct.filter((x) => x.deltaPct >= 3).length;
            const worse3Percent = perDayDeltaPct.filter((x) => x.deltaPct <= -3).length;

            const improving = avgDeltaPct >= 7 && better3Percent >= 7;
            const declining = avgDeltaPct <= -7 && worse3Percent >= 7;

            let trend: "improving" | "declining" | "stable" = "stable";
            let message = "Planning and decision-making performance is stable.";

            if (improving) {
                trend = "improving";
                message = "Planning and decision-making performance is improving.";
            } else if (declining) {
                trend = "declining";
                message =
                    "Planning and decision-making performance shows a sustained decline. If this continues, consider consulting a healthcare professional.";
            }

            return res.json({
                userId,
                hasEnoughData: true,
                trend,
                message,
                baselineAvg,
                recentAvg,
                avgDeltaPct: Number(avgDeltaPct.toFixed(2)),
                counts: { better3Percent, worse3Percent },
                recent10: perDayDeltaPct,
            });
        } catch (error) {
            console.error("Error computing ToL trend:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };

    static getRecentAverageSummary = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const allDays = await getBestPerDay(userId);

            if (!allDays.length) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    windowStart: null,
                    windowEnd: null,
                    daysWithResult: 0,
                    averageTotalScore: null,
                });
            }

            const lastDay = allDays.at(-1);

            if (!lastDay) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    windowStart: null,
                    windowEnd: null,
                    daysWithResult: 0,
                    averageTotalScore: null,
                });
            }

            const windowEnd = new Date(lastDay.date);
            windowEnd.setHours(0, 0, 0, 0);

            const windowStart = new Date(windowEnd);
            windowStart.setDate(windowEnd.getDate() - 9);

            const recentDays = allDays.filter((d) => {
                const date = new Date(d.date);
                date.setHours(0, 0, 0, 0);
                return date >= windowStart && date <= windowEnd;
            });

            if (!recentDays.length) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    windowStart: toDateKey(windowStart),
                    windowEnd: toDateKey(windowEnd),
                    daysWithResults: 0,
                    averageTotalScore: null,
                });
            }

            const averageTotalScore = Math.round(
                mean (
                    recentDays.map((d) =>
                        Number(d.bestStat?.totalscore ?? 0)
                    )
                )
            );

            return res.json({
                userId,
                hasEnoughData: true,
                windowStart: toDateKey(windowStart),
                windowEnd: toDateKey(windowEnd),
                daysWithResults: recentDays.length,
                averageTotalScore,
            });
        } catch (error) {
            console.error("Error computing ToL recent average summary:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };
}