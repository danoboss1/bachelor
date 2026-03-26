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
function getKnoxCategoryIndex(totalScore: number) {
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

async function getBestPerDay(userId: number) {
    const stats = await prisma.stats_knox.findMany({
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

export class KnoxStatsController {
    static getStat = async (req: Request, res: Response) => {
        try {
            const { statId } = req.params;

            if (statId == null) {
                return res.status(400).json({ error: "statId is required" });
            }

            const stat = await prisma.stats_knox.findUnique({
                where: { id: parseInt(statId) }
            });

            res.json(stat);
        } catch (error) {
            console.error("Error fetching statistics", error);
            res.status(500).json({ error: "Server error"});
        }
    };

    static saveStat = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const {
                time,
                threeStepSequencesCorrect,
                fourStepSequencesCorrect,
                fiveStepSequencesCorrect,
                sixStepSequencesCorrect,
                sevenStepSequencesCorrect,
                eightStepSequencesCorrect,
                totalCorrect,
                totalScore,
            } = req.body;

            if (time == null) return res.status(400).json({ error: "time is required" })
            if (threeStepSequencesCorrect == null) return res.status(400).json({ error: "threeStepSequencesCorrect is required" });
            if (fourStepSequencesCorrect == null) return res.status(400).json({ error: "fourStepSequencesCorrect is required" });
            if (fiveStepSequencesCorrect == null) return res.status(400).json({ error: "fiveStepSequencesCorrect is required" });
            if (sixStepSequencesCorrect == null) return res.status(400).json({ error: "sixStepSequencesCorrect is required" });
            if (sevenStepSequencesCorrect == null) return res.status(400).json({ error: "sevenStepSequencesCorrect is required" });
            if (eightStepSequencesCorrect == null) return res.status(400).json({ error: "eightStepSequencesCorrect is required" });
            if (totalCorrect == null) return res.status(400).json({ error: "totalCorrect is required" });
            if (totalScore == null) return res.status(400).json({ error: "totalScore is required" });

            const stat = await prisma.stats_knox.create({
                data: {
                    time: time,
                    threestepsequencescorrect: threeStepSequencesCorrect,
                    fourstepsequencescorrect: fourStepSequencesCorrect,
                    fivestepsequencescorrect: fiveStepSequencesCorrect,
                    sixstepsequencescorrect: sixStepSequencesCorrect,
                    sevenstepsequencescorrect: sevenStepSequencesCorrect,
                    eightstepsequencescorrect: eightStepSequencesCorrect,
                    totalcorrect: totalCorrect,
                    totalscore: totalScore, 
                    user_id: userId,
                },
                select: {
                    id: true,
                    time: true,
                    threestepsequencescorrect: true,
                    fourstepsequencescorrect: true,
                    fivestepsequencescorrect: true,
                    sixstepsequencescorrect: true,
                    sevenstepsequencescorrect: true,
                    eightstepsequencescorrect: true,
                    totalcorrect: true,
                    totalscore: true,
                    user_id: true
                }
            });

            res.status(201).json(stat);
        } catch (error) {
            console.error("Error saving knox statistics", error);
            res.status(500).json({ error: "Server error"});
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

            const stats = await prisma.stats_knox.findMany({
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
                    categoryIndex: getKnoxCategoryIndex(totalscore),
                };
            });

            return res.json({
                userId,
                range: { year, month },
                scoreDefinition: "totalScore (your KNOX scoring)",
                days,
            });
        } catch (error) {
            console.error("Error fetching KNOX monthly best per day:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };

    static getTrendMessage = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: "Unauthorized" });

            const allDays = await getBestPerDay(userId);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const recentStart = new Date(today);
            recentStart.setDate(today.getDate() - 9);

            const recentDays = allDays.filter((d) => {
                const date = new Date(d.date);
                date.setHours(0, 0, 0, 0);
                return date >= recentStart && date <= today;
            });

            const baselineDays = allDays.filter((d) => {
                const date = new Date(d.date);
                date.setHours(0, 0, 0, 0);
                return date < recentStart;
            });

            const insufficientDataMessage =
                "This long-term indicator needs at least 3 Knox result-days within the last 10 calendar days and at least 3 older result-days for comparison.";

            if (recentDays.length < 3) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    trend: null,
                    message: insufficientDataMessage,
                    recentWindowStart: toDateKey(recentStart),
                    recentWindowEnd: toDateKey(today),
                    reason: "Need at least 3 result-days in the last 10 calendar days.",
                });
            }

            if (baselineDays.length < 3) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    trend: null,
                    message: insufficientDataMessage,
                    recentWindowStart: toDateKey(recentStart),
                    recentWindowEnd: toDateKey(today),
                    reason: "Need at least 3 result-days before the last 10 calendar days.",
                });
            }

            const baselineAvg = mean(baselineDays.map((d) => d.score));
            const recentAvg = mean(recentDays.map((d) => d.score));

            let trend: "improving" | "declining" | "stable" = "stable";
            let message =
                "Your long-term Knox trend suggests stable working memory and inhibitory control performance.";

            let avgDeltaPct = 0;

            if (baselineAvg === 0 && recentAvg === 0) {
                trend = "stable";
            } else if (baselineAvg === 0 && recentAvg > 0) {
                trend = "improving";
                message =
                    "Your long-term Knox trend suggests improving working memory and inhibitory control performance.";
            } else if (baselineAvg > 0 && recentAvg === 0) {
                avgDeltaPct = -100;
                trend = "declining";
                message =
                    "Your long-term Knox trend suggests a decline in working memory and inhibitory control performance. If this pattern continues, consider discussing it with a healthcare professional.";
            } else {
                avgDeltaPct = percentDiff(recentAvg, baselineAvg);

                const improving = avgDeltaPct >= 7;
                const declining = avgDeltaPct <= -7;

                if (improving) {
                    trend = "improving";
                    message =
                        "Your long-term Knox trend suggests improving working memory and inhibitory control performance.";
                } else if (declining) {
                    trend = "declining";
                    message =
                        "Your long-term Knox trend suggests a decline in working memory and inhibitory control performance. If this pattern continues, consider discussing it with a healthcare professional.";
                }
            }

            return res.json({
                userId,
                hasEnoughData: true,
                trend,
                message,
                recentWindowStart: toDateKey(recentStart),
                recentWindowEnd: toDateKey(today),
                baselineAvg,
                recentAvg,
                avgDeltaPct: Number(avgDeltaPct.toFixed(2)),
            });
        } catch (error) {
            console.error("Error computing KNOX trend:", error);
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
                    daysWithResults: 0,
                    bestStat: null,
                });
            }

            const lastDay = allDays.at(-1);

            if (!lastDay) {
                return res.json({
                    userId,
                    hasEnoughData: false,
                    windowStart: null,
                    windowEnd: null,
                    daysWithResults: 0,
                    bestStat: null,
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
                    bestStat: null,
                });
            }

            let bestDay = recentDays[0]!;

            for (const current of recentDays) {
                const isBetter = current.score > bestDay.score;

                const isSameButNewer =
                    current.score === bestDay.score &&
                    safeTimeMs(current.bestStat?.time ?? null) >
                        safeTimeMs(bestDay.bestStat?.time ?? null);

                if (isBetter || isSameButNewer) {
                    bestDay = current;
                }
            }

            return res.json({
                userId,
                hasEnoughData: true,
                windowStart: toDateKey(windowStart),
                windowEnd: toDateKey(windowEnd),
                daysWithResults: recentDays.length,
                bestStat: {
                    id: bestDay.bestStat.id,
                    totalscore: Number(bestDay.bestStat.totalscore ?? 0),
                },
            });
        } catch (error) {
            console.error("Error computing Knox recent best summary:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };
}