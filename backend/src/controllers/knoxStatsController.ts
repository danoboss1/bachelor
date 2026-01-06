import type { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class KnoxStatsController {
    static saveStat = async (req: Request, res: Response) => {
        try {
            const {
                threeStepSequencesCorrect,
                fourStepSequencesCorrect,
                fiveStepSequencesCorrect,
                sixStepSequencesCorrect,
                sevenStepSequencesCorrect,
                eightStepSequencesCorrect,
                totalCorrect
            } = req.body;

            if (threeStepSequencesCorrect == null) return res.status(400).json({ error: "threeStepSequencesCorrect is required" });
            if (fourStepSequencesCorrect == null) return res.status(400).json({ error: "fourStepSequencesCorrect is required" });
            if (fiveStepSequencesCorrect == null) return res.status(400).json({ error: "fiveStepSequencesCorrect is required" });
            if (sixStepSequencesCorrect == null) return res.status(400).json({ error: "sixStepSequencesCorrect is required" });
            if (sevenStepSequencesCorrect == null) return res.status(400).json({ error: "sevenStepSequencesCorrect is required" });
            if (eightStepSequencesCorrect == null) return res.status(400).json({ error: "eightStepSequencesCorrect is required" });
            if (totalCorrect == null) return res.status(400).json({ error: "totalCorrect is required" });
            const stat = await prisma.stats_knox.create({
                data: {
                    threestepsequencescorrect: threeStepSequencesCorrect,
                    fourstepsequencescorrect: fourStepSequencesCorrect,
                    fivestepsequencescorrect: fiveStepSequencesCorrect,
                    sixstepsequencescorrect: sixStepSequencesCorrect,
                    sevenstepsequencescorrect: sevenStepSequencesCorrect,
                    eightstepsequencescorrect: eightStepSequencesCorrect,
                    totalcorrect: totalCorrect,
                },
                select: {
                    threestepsequencescorrect: true,
                    fourstepsequencescorrect: true,
                    fivestepsequencescorrect: true,
                    sixstepsequencescorrect: true,
                    sevenstepsequencescorrect: true,
                    eightstepsequencescorrect: true,
                    totalcorrect: true,
                }
            });

            res.status(201).json(stat);
        } catch (error) {
            console.error("Error saving knox statistics", error);
            res.status(500).json({ error: "Server error"});
        }
    };
}