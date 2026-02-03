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

export class RegisterController {
    static register = async (req: Request, res: Response) => {
        try{
            let { username, password } = req.body as RegisterBody;
    
            if (typeof req.body === 'string') {
                try {
                    const parsedBody = JSON.parse(req.body) as RegisterBody;
                    username = parsedBody.username;
                    password = parsedBody.password;
                } catch (parseError) {
                    return res.status(400).json({ message: 'Invalid JSON format' });
                }
            }
    
            if (!username) {
                return res.status(400).json({ message: "Username is required" });
            }
    
            if (!password) {
                return res.status(400).json({ message: "Password is required" });
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

            res.status(500).json({ message: 'Server error' });
        }
    };
}