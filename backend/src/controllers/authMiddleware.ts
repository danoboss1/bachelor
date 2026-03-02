import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// neviem co je payload
interface JwtPayload {
    id: number;
    username: string;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length != 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ error: "Invalid authorization format. Use 'Bearer <token'"});
    }

    const token = tokenParts[1];
    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable not defined');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        req.user = {
            id: decoded.id,
            username: decoded.username,
        };
        
        next();
    } catch (error: any) {
        console.error("Authentication error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired"});
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ error: "Invalid token" });
        }

        res.status(500).json({ error: "Authentication failed" });
    }
}

export default authMiddleware;