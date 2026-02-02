import bcrypt from 'bcryptjs';
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userModel = {
    createUser: async (username: string, password: string) => {
        // zahashovat heslo 

        const user = await prisma.users.create({
            data: {
                username,
                password
            },
        });

        return user.id;
    },
}

export default userModel;