import type { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import userModel from '../models/user.js'
import jwt from 'jsonwebtoken';

interface RegisterBody {
    username: string;
    password: string;
}

interface UserResponse {
    id: number;
    username: string;
}

interface ValidationErrors {
    username?: string;
    password?: string;
}

export class RegisterController {
    static register = async (req: Request, res: Response) => {
        try{
            // toto preco tu hore hned
            const errors: ValidationErrors = {};

            let { username, password } = req.body as RegisterBody;
    
            if (typeof req.body === 'string') {
                try {
                    const parsedBody = JSON.parse(req.body) as RegisterBody;
                    username = parsedBody.username;
                    password = parsedBody.password;
                } catch (parseError) {

                    return res.status(400).json({
                        errors: {
                            username: "Invalid request format",
                            password: "Invalid request format"
                        }
                    });
                }
            }

            // s tymto trimom sa opytat ci je to dobre
            // preco az pod tu JSON kontrolu

            username = username?.trim();
            password = password?.trim();
    
            if (!username) {
                errors.username = "Username is required"
            } else if (username.length < 3 || username.length > 30) {
                errors.username = "Username length must be between 3 and 30 characters";
            }
    
            if (!password) {
                errors.password = "Password is required";
            } else if (typeof password !== "string") {
                errors.password = "Password must be a string";
            } else {
                if (password.length < 8) {
                    errors.password = "Password must be at least 8 characters long";
                } else if (password.length > 72) {
                    errors.password = "Password is too long";
                } else {
                    const hasLowercase = /[a-z]/.test(password);
                    const hasUppercase = /[A-Z]/.test(password);
                    const hasNumber = /[0-9]/.test(password);

                    if (!hasLowercase || !hasUppercase || !hasNumber) {
                        errors.password = "Password must contain lowercase, uppercase letter and number";
                    }
                }
            }

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({
                    errors
                });
            }
    
            const existingUser = await userModel.findByUsername(username);
    
            if (existingUser) {
                return res.status(409).json({ message: "Username already exists" });
            }
    
            const userId = await userModel.createUser(username, password);
    
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT secret is not defined');
            }
    
            const token = jwt.sign(
                { id: userId, username },
                process.env.JWT_SECRET,
                { expiresIn: "1h"}
            );
            const userResponse: UserResponse = {
                id: userId,
                username,
            };
    
            return res.status(201).json({ token, user: userResponse });
        } catch (err: any) {
            console.error('Registration error:', err.message);

            return res.status(500).json({
                errors: {
                    username: "Server error",
                    password: "Server error"
                }
            });

        }
    };
}