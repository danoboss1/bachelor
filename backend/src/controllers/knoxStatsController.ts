import type { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
            const {
                time,
                threeStepSequencesCorrect,
                fourStepSequencesCorrect,
                fiveStepSequencesCorrect,
                sixStepSequencesCorrect,
                sevenStepSequencesCorrect,
                eightStepSequencesCorrect,
                totalCorrect,
                user_id,
            } = req.body;

            if (time == null) return res.status(400).json({ error: "time is required" })
            if (threeStepSequencesCorrect == null) return res.status(400).json({ error: "threeStepSequencesCorrect is required" });
            if (fourStepSequencesCorrect == null) return res.status(400).json({ error: "fourStepSequencesCorrect is required" });
            if (fiveStepSequencesCorrect == null) return res.status(400).json({ error: "fiveStepSequencesCorrect is required" });
            if (sixStepSequencesCorrect == null) return res.status(400).json({ error: "sixStepSequencesCorrect is required" });
            if (sevenStepSequencesCorrect == null) return res.status(400).json({ error: "sevenStepSequencesCorrect is required" });
            if (eightStepSequencesCorrect == null) return res.status(400).json({ error: "eightStepSequencesCorrect is required" });
            if (totalCorrect == null) return res.status(400).json({ error: "totalCorrect is required" });
            if (user_id == null) return res.status(400).json({ error: "user_id is required" });

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
                    user_id: user_id,
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
                    user_id: true
                }
            });

            res.status(201).json(stat);
        } catch (error) {
            console.error("Error saving knox statistics", error);
            res.status(500).json({ error: "Server error"});
        }
    };
}