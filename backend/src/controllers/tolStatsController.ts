import type { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
            res.status(500).json({ error: "Server error"});
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
            res.status(500).json({ error: "Server error"});
        }
    };
}