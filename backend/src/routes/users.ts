// this is old code

import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

// GET /users - nacita vsetkych pouzivatelov
router.get('/', async (req:Request, res:Response) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;