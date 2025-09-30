import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserController {
    static getUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const user = await prisma.users.findUnique({
                where: { id: parseInt(userId) }
            });

            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };
}