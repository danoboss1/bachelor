import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LeaderboardController {
    static getLeaderboard = async (req: Request, res: Response) => {
        try {
            const leaderboard = await prisma.leaderboard.findMany({
                include: {
                    users: {select: { id: true, username: true } },
                    stats: {select: { correct_trials: true, errors_trials: true, time: true} }
                },
                orderBy: {
                    stats: { correct_trials: 'desc' }
                }
            })

            res.json(leaderboard);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
            res.status(500).json({ error: "Server error"});
        }
    };
}