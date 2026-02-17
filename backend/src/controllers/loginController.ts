import type { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import userModel from '../models/user.js'
import jwt from 'jsonwebtoken';

interface LoginBody {
    username: string;
    password: string;
}

interface UserResponse {
    id: number;
    username: string;
}

interface User {
    id: number;
    username: string;
    password: string;
}

export class LoginController {
    static login = async (req: Request, res: Response) => {
        try {
            let body: LoginBody;
            if (typeof req.body === 'string') {
                try {
                    body = JSON.parse(req.body) as LoginBody;
                } catch (parseError) {
                    return res.status(400).json({ message: 'Invalid JSON format'});
                }
            } else {
                body = req.body as LoginBody;
            }

            const { username, password } = body;

            if (!username || !password) {
                return res.status(401).json({ message: 'Username or password is incorrect' });
            }

            const user: User | null = await userModel.findByUsername(username);

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ message: 'Username or password is incorrect'});
            }

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT secret is not defined");
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "1h"}
            );
            const userData: UserResponse = {
                id: user.id,
                username: user.username,
            };

            res.json({ token, user: userData });
        } catch (err: any) {
            res.status(500).json({ message: 'Server error' });
        }
    };
}