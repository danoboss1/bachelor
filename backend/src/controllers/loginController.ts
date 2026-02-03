import type { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import userModel from '../models/user.js'

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
                    console.log('Invalid JSON format');
                    return res.status(400).json({ message: 'Invalid JSON format'});
                }
            } else {
                body = req.body as LoginBody;
            }

            const { username, password } = body;

            if (!username) {
                console.log('Username is required');
                return res.status(400).json({ message: 'Username is required'});
            }

            if (!password) {
                console.log('Password is required');
                return res.status(400).json({ message: 'Password is required'});
            }

            const user: User | null = await userModel.findByUsername(username);

            if (!user) {
                console.log('Invalid username credentials');
                return res.status(401).json({ message: 'Invalid username credentials' });
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                console.log('Invalid password credentials');
                return res.status(401).json({ message: 'Invalid password credentials' });
            }

            // JWT

            const userData: UserResponse = {
                id: user.id,
                username: user.username,
            };

            // tu este vratit aj JWT token
            res.json({ user: userData });
        } catch (err: any) {
            console.error('Login error:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    };
}