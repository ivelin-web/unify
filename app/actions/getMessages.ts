import prisma from "@/app/lib/prismadb";
import { FullMessageType } from "@/typings";
import { Prisma } from "@prisma/client";

type Props = {
    conversationId: string;
    select: Prisma.MessageSelect;
};

const getMessages = async ({ conversationId, select }: Props) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId,
            },
            select,
            orderBy: {
                createdAt: "asc",
            },
        });

        return messages as FullMessageType[];
    } catch (error) {
        return [];
    }
};

export default getMessages;
