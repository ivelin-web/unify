import prisma from "@/app/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import { Prisma } from "@prisma/client";
import { FullConversationType } from "@/typings";

type Props = {
    select: Prisma.ConversationSelect;
};

const getConversations = async ({ select }: Props) => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc",
            },
            where: {
                userIds: {
                    has: currentUser.id,
                },
            },
            select,
        });

        return conversations as FullConversationType[];
    } catch (error) {
        return [];
    }
};

export default getConversations;
