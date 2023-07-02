import prisma from "@/app/lib/prismadb";
import getSession from "./getSession";
import { Prisma, User } from "@prisma/client";

type Props = {
    select: Prisma.UserSelect;
};

const getUsers = async ({ select }: Props) => {
    const session = await getSession();

    if (!session?.user?.email) {
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                NOT: {
                    email: session.user.email,
                },
            },
            select,
        });

        return users as User[];
    } catch (error) {
        return [];
    }
};

export default getUsers;
