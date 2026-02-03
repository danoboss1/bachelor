import bcrypt from 'bcryptjs';
import { Prisma, PrismaClient} from "@prisma/client";
// toto keby nefunguje skontrolovat
import type {users as PrismaUser} from "@prisma/client";

const prisma = new PrismaClient();

interface User extends PrismaUser {}

const SALT_ROUNDS = 10;

const userModel = {
    createUser: async (username: string, password: string) => {
        // zahashovat heslo 
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        return user.id;
    },

    findByUsername: async (username: string): Promise<User | null> => {
        if (!username) throw new Error('Username is required');

        return prisma.users.findFirst({
            where: { username },
        });
    },
}

export default userModel;