import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LeaderboardController {
    static getLeaderboard = async (req: Request, res: Response) => {
        try {
            const leaderboard = await prisma.leaderboard_wcst.findMany({
                include: {
                    users: {select: { id: true, username: true } },
                    stats_wcst: {select: { total_correct: true, total_error: true, time: true} }
                },
                orderBy: {
                    stats_wcst: { total_correct: 'desc' }
                }
            })

            res.json(leaderboard);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
            res.status(500).json({ error: "Server error"});
        }
    };
}