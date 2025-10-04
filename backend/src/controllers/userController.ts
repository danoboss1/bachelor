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
            res.status(500).json({ error: "Server error"});
        }
    };

    static updateUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const updateData = req.body;

            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            delete updateData.id;
            delete updateData.password;

            const user = await prisma.users.update({
                where: { id: parseInt(userId) },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                }
            });

            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: "Server error" });
        }
    };

    static createUser = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Username and password are required" });
            }

            const user = await prisma.users.create({
                data: {
                    username,
                    password,
                },
                select: {
                    id: true,
                    username: true,
                }
            })

            res.json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Server error" });
        }
    };

    static deleteUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const user = await prisma.users.delete({
                where: { id: parseInt(userId) }, 
            })

            res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user", error);
            res.status(500).json({ error: "Server error" });
        }
    };
}