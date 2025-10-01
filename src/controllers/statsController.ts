import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StatsController {
    static getStat = async (req: Request, res: Response) => {
        try {
            const { statId } = req.params;

            if (!statId) {
                return res.status(400).json({ error: "statId is required" });
            }

            const stat = await prisma.users.findUnique({
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
            const { time, number_of_categories_completed, total_number_of_trials_administrated, correct_trials, errors_trials, user_id } = req.body;

            if (!time || 
                !number_of_categories_completed || 
                !total_number_of_trials_administrated || 
                correct_trials || 
                errors_trials || 
                user_id
            ) {
                return res.status(400).json({ error: "All fields are required" })
            }

            const stat = await prisma.stats.create({
                data: {
                    time,
                    number_of_categories_completed,
                    total_number_of_trials_administrated,
                    correct_trials,
                    errors_trials,
                    user_id
                },
                select: {
                    id: true,
                    time: true,
                    number_of_categories_completed: true,
                    total_number_of_trials_administrated: true,
                    correct_trials: true,
                    errors_trials: true,
                    user_id: true,
                }
            });

            res.status(201).json(stat);
        } catch (error) {
            console.error("Error saving statistics", error);
            res.status(500).json({ error: "Server error"});
        }
    }
}