import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import userModel from "../models/user.js";

const prisma = new PrismaClient();

interface UpdateUserBody {
    username: string;
    currentPassword: string;
}

interface ValidationErrorsUsername {
    username?: string;
    currentPassword?: string;
}

interface UpdatePasswordBody {
    currentPassword: string;
    newPassword: string;
}

interface ValidationErrorsPassword {
    currentPassword?: string;
    newPassword?: string;
}

const SALT_ROUNDS = 10;

export class UserController {
    static getUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const parsedUserId = parseInt(userId);

            if (isNaN(parsedUserId)) {
                return res.status(400).json({ error: "Invalid userId" });
            }

            const user = await prisma.users.findUnique({
                where: { id: parsedUserId },
                select: {
                    id: true,
                    username: true,
                },
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ error: "Server error"});
        }
    };

    static updateUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { username, currentPassword } = req.body as UpdateUserBody;

            const errors: ValidationErrorsUsername = {};
            
            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const parsedUserId = parseInt(userId);

            if (isNaN(parsedUserId)) {
                return res.status(400).json({ error: "Invalid userId" });
            }

            const trimmedUsername = username?.trim();

            if (!trimmedUsername) {
                errors.username = "Username is required";
            } else if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
                errors.username = "Username length must be between 3 and 30 characters";
            }
            
            if (!currentPassword) {
                errors.currentPassword = "Current password is required";
            }

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors });
            }

            const existingUser = await prisma.users.findUnique({
                where: { id: parsedUserId },
            });

            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
            }

            const isPasswordValid = await bcrypt.compare(
                currentPassword,
                existingUser.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    errors: {
                        currentPassword: "Current password is incorrect",
                    }
                })
            }

            const usernameTaken = await prisma.users.findFirst({
                where: {
                    username: trimmedUsername,
                    NOT: {
                        id: parsedUserId,
                    },
                },
            });

            if (usernameTaken) {
                return res.status(409).json({
                    errors: {
                        username: "Username already exists",
                    },
                });
            }

            const updatedUser = await prisma.users.update({
                where: { id: parsedUserId },
                data: {
                    username: trimmedUsername,
                },
                select: {
                    id: true,
                    username: true,
                },
            });

            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: "Server error" });
        }
    };

    static updatePassword = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { currentPassword, newPassword} = req.body as UpdatePasswordBody;

            const errors: ValidationErrorsPassword = {};

            if (!userId) {
                return res.status(400).json({ error: "userId is required "});
            }

            const parsedUserId = parseInt(userId);

            if (isNaN(parsedUserId)) {
                return res.status(400).json({ error: "Invalid userId" });
            }

            if (req.user?.id !== parsedUserId) {
                return res.status(403).json({ error: "Forbidden" });
            }

            if (!currentPassword) {
                errors.currentPassword = "Current password is required";
            }

            if (!newPassword) {
                errors.newPassword = "New password is required";
            } else if (typeof newPassword !== "string") {
                errors.newPassword = "New password must be a string";
            } else {
                if (newPassword.length < 8) {
                    errors.newPassword = "New password must be at least 8 characters long";
                } else if (newPassword.length > 72) {
                    errors.newPassword = "New password is too long";
                } else {
                    const hasLowercase = /[a-z]/.test(newPassword);
                    const hasUppercase = /[A-Z]/.test(newPassword);
                    const hasNumber = /[0-9]/.test(newPassword);

                    if (!hasLowercase || !hasUppercase || !hasNumber) {
                        errors.newPassword =
                            "New password must contain lowercase, uppercase letter and number";
                    }
                }
            }

            if (
                currentPassword &&
                newPassword &&
                currentPassword === newPassword
            ) {
                errors.newPassword = 
                    "New password must be different from current password";
            }

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors });
            }

            const existingUser = await prisma.users.findUnique({
                where: { id: parsedUserId },
            });

            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
            }

            const isCurrentPasswordValid = await bcrypt.compare(
                currentPassword,
                existingUser.password
            );

            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    errors: {
                        currentPassword: "Current password is incorrect",
                    },
                });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

            await prisma.users.update({
                where: { id: parsedUserId },
                data: {
                    password: hashedNewPassword,
                },
            });

            return res.json({ message: "Password updated seccesfully" });
        } catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };

    static createUser = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Username and password are required" });
            }

            const userId = await userModel.createUser(username, password);

            const user = await prisma.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                },
            });

            return res.json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ error: "Server error" });
        }
    };

    static deleteUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const parsedUserId = parseInt(userId);

            if (isNaN(parsedUserId)) {
                return res.status(400).json({ error: "Invalid userId" });
            }

            await prisma.users.delete({
                where: { id: parsedUserId },
            });

            return res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user", error);
            return res.status(500).json({ error: "Server error" });
        }
    };
}