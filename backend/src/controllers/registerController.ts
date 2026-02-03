import type { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import userModel from '../models/user.js'

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

        // existing user tbd

        const userId = await userModel.createUser(username, password);

        // JWT 

        const userResponse: UserResponse = {
            id: userId,
            username,
        }

        // tu este budem vypisavat JWT

        return res.status(201).json({ user: userResponse });

        // a tu errory, ale nemozem zatial lebo if je na JWT 

        // ten endpoint na register funguje a ako tak chapem kodu, potom pokracujem v programovani 
        // registracie a login-u

    };
}