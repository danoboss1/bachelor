import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
    return Number(stat.categories_completed ?? 0);
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
function getCategoryIndex(categoriesCompleted: number, trials: number): number {
    if (categoriesCompleted <= 2) return 0;
    if (categoriesCompleted <= 4) return 1;
    if (categoriesCompleted === 5) return 2;
    if (categoriesCompleted === 6 && trials > 85) return 3;
    if (categoriesCompleted === 6 && trials <= 85) return 4;
    return 0;
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
    const stats = await prisma.stats_wcst.findMany({
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

export class StatsController {
    static getStat = async (req: Request, res: Response) => {
        try {
            const { statId } = req.params;

            if (statId == null) {
                return res.status(400).json({ error: "statId is required" });
            }

            const stat = await prisma.stats_wcst.findUnique({
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
            const {
                time,
                categories_completed,
                trials_administered,
                total_correct,
                total_error,
                perseverative_responses,
                perseverative_errors,
                non_perseverative_errors,
                failure_to_maintain_set,
                trials_to_first_category,
                perseverativepercent,
                perseverativeerrorpercent,
                nonperseverativeerrorpercent,
                errorpercent,
                user_id
            } = req.body;

            if (time == null) return res.status(400).json({ error: "time is required" });

            if (categories_completed == null) return res.status(400).json({ error: "categories_completed is required" });

            if (trials_administered == null) return res.status(400).json({ error: "trials_administered is required" });

            if (total_correct == null) return res.status(400).json({ error: "total_correct is required" });

            if (total_error == null) return res.status(400).json({ error: "total_error is required" });

            if (perseverative_responses == null) return res.status(400).json({ error: "perseverative_responses is required" });
            if (perseverative_errors == null) return res.status(400).json({ error: "perseverative_errors is required" });
            if (non_perseverative_errors == null) return res.status(400).json({ error: "non_perseverative_errors is required" });
            if (failure_to_maintain_set == null) return res.status(400).json({ error: "failure_to_maintain_set is required" });
            if (trials_to_first_category == null) return res.status(400).json({ error: "trials_to_first_category is required" });
            if (perseverativepercent == null) return res.status(400).json({ error: "perseverativepercent is required" });
            if (perseverativeerrorpercent == null) return res.status(400).json({ error: "perseverativeerrorpercent is required" });
            if (nonperseverativeerrorpercent == null) return res.status(400).json({ error: "nonperseverativeerrorpercent is required" });
            if (errorpercent == null) return res.status(400).json({ error: "errorpercent is required" });

            if (user_id == null) return res.status(400).json({ error: "user_id is required" });

            const stat = await prisma.stats_wcst.create({
                data: {
                    time,
                    categories_completed,
                    trials_administered,
                    total_correct,
                    total_error,
                    perseverative_responses,
                    perseverative_errors,
                    non_perseverative_errors,
                    failure_to_maintain_set,
                    trials_to_first_category,
                    perseverativepercent,
                    perseverativeerrorpercent,
                    nonperseverativeerrorpercent,
                    errorpercent,
                    user_id
                },
                select: {
                    id: true,
                    time: true,
                    categories_completed: true,
                    trials_administered: true,
                    total_correct: true,
                    total_error: true,
                    perseverative_responses: true,
                    perseverative_errors: true,
                    non_perseverative_errors: true,
                    failure_to_maintain_set: true,
                    trials_to_first_category: true,
                    perseverativepercent: true,
                    perseverativeerrorpercent: true,
                    nonperseverativeerrorpercent: true,
                    errorpercent: true,
                    user_id: true
                }
            });

            res.status(201).json(stat);
        } catch (error) {
            console.error("Error saving statistics", error);
            res.status(500).json({ error: "Server error"});
        }
    };

    static getPercentile = async (req: Request, res: Response) => {
        try {
            const { metric, value } = req.query;

            if (!metric || value === undefined) {
                return res.status(400).json({ error: "metric and value are required" });
            }

            const validMetrics = [
                "trials_administered",
                "perseverative_responses",
                "perseverative_errors",
                "non_perseverative_errors"
            ];

            const metricKey = String(metric);

            if (!validMetrics.includes(metricKey)) {
                return res.status(400).json({ error: "Invalid metric" });
            }

            const numericValue = Number(value);
            if (isNaN(numericValue)) {
                return res.status(400).json({ error: "value must be a number" });
            }

            const total = await prisma.stats_wcst.count();
            if (total === 0) {
                return res.json({ metric: metricKey, value: numericValue, percentile: 0 });
            }

            const lessOrEqual = await prisma.stats_wcst.count({
                where: { [metricKey]: { lte: numericValue } }
            });

            const percentile = Number(((lessOrEqual / total) * 100).toFixed(2));

            return res.json({ metric: metricKey, value: numericValue, percentile });
        } catch (error) {
            console.error("Error calculating percentile:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };

    /**
   * GET /stats/wcst/history/month?year=2026&month=3
   *
   * IMPORTANT: user_id is HARD-CODED to 1 (as requested).
   *
   * Returns:
   * - one entry per day in the month (even if no DB records -> value 0)
   * - "value" = best score for that day (currently categories_completed)
   * - "bestStat" = the full DB row used as the best for that day (or null)
   * - includes computed categoryIndex for UI convenience
   */

    static getMonthlyBestPerDay = async (req: Request, res: Response) => {
        try {
            // const userId = 1;
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

            const stats = await prisma.stats_wcst.findMany({
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

            // tu som zatial skoncil s kodom
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

                const cc = Number(found.bestStat.categories_completed ?? 0);
                const trials = Number(found.bestStat.trials_administered ?? 0);

                return {
                    date: key,
                    label: String(i + 1),
                    value: Number(found.bestScore),
                    bestStat: found.bestStat,
                    categoryIndex: getCategoryIndex(cc, trials),
                };
            });

            return res.json({
                userId,
                range: { year, month },
                scoreDefinition: "categories_completed (0..6)",
                days,
            });
        } catch (error) {
            console.error("Error fetching WCST monthly best per day:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };

    /**
   * GET /wcstStats/trend
   *
   * Pravidlá:
   * - zober posledných 10 dní, kde bol výsledok (best per day)
   * - musí existovať aj "pred nimi" aspoň 10 ďalších dní s výsledkom
   * - baseline = priemer zo všetkých dní pred poslednými 10 (t.j. historický priemer)
   * - improving:
   *   - priemer posledných 10 je aspoň o +7% lepší než baseline
   *   - a aspoň 7/10 dní je aspoň o +3% lepších než baseline
   * - declining analogicky -7% a 7/10 horších o -3%
   * - inak stable
   */

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
                "This long-term indicator needs at least 3 WCST result-days within the last 10 calendar days and at least 3 older result-days for comparison.";

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

            // toto este treba vyriesit lebo moze nastat
            // if (baselineAvg === 0) {
            // if (baselineAvg === 0) {
            //     return res.json({
            //         userId,
            //         hasEnoughData: false,
            //         message: null,
            //         reason: "Baseline average is 0, trend cannot be computed reliably.",
            //     });
            // }
            // }

            const avgDeltaPct = percentDiff(recentAvg, baselineAvg);

            // const perDayDeltaPct = recentDays.map((d) => ({
            //     date: d.date,
            //     score: d.score,
            //     deltaPct: percentDiff(d.score, baselineAvg),
            // }));

            // const better3Percent = perDayDeltaPct.filter((x) => x.deltaPct >= 3).length;
            // const worse3Percent = perDayDeltaPct.filter((x) => x.deltaPct <= -3).length;

            // const improving = avgDeltaPct >= 7 && better3Percent >= 7;
            // const declining = avgDeltaPct <= -7 && worse3Percent >= 7;

            const improving = avgDeltaPct >= 7;
            const declining = avgDeltaPct <= -7;

            let trend: "improving" | "declining" | "stable" = "stable";
            let message =
                "Your long-term WCST trend suggests stable cognitive flexibility and responding to feedback.";

            if (improving) {
                trend = "improving";
                message =
                    "Your long-term WCST trend suggests improving cognitive flexibility and responding to feedback.";
            } else if (declining) {
                trend = "declining";
                message =
                    "Your long-term WCST trend suggests a decline in cognitive flexibility and responding to feedback. If this pattern continues, consider discussing it with a healthcare professional.";
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
                // counts: { better3Percent, worse3Percent },
                // recentDays: perDayDeltaPct,
            });
        } catch (error) {
            console.error("Error computing WCST trend:", error);
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
                    averageCategoriesCompleted: null,
                    averageTrialsAdministered: null,
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
                    averageCategoriesCompleted: null,
                    averageTrialsAdministered: null,
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
                    averageCategoriesCompleted: null,
                    averageTrialsAdministered: null,
                });
            }

            const averageCategoriesCompleted = Math.round(
                mean(
                    recentDays.map((d) =>
                        Number(d.bestStat?.categories_completed ?? 0)
                    )
                )
            );

            const averageTrialsAdministered = Math.round(
                mean(
                    recentDays.map((d) => 
                        Number(d.bestStat?.trials_administered ?? 0)
                    )
                )
            );

            return res.json({
                userId,
                hasEnoughData: true,
                windowStart: toDateKey(windowStart),
                windowEnd: toDateKey(windowEnd),
                daysWithResults: recentDays.length,
                averageCategoriesCompleted,
                averageTrialsAdministered,
            });
        } catch (error) {
            console.error("Error computing WCST recent average summary:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };
}