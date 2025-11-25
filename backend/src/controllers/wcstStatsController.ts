import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    }
}