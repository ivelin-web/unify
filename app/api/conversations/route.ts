import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";

type Body = {
    userId?: string;
    isGroup?: boolean;
    members?: any;
    name?: string;
};

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
        }

        const { userId, isGroup, members, name }: Body = await req.json();

        if (isGroup && (!members || members.length < 2 || !name)) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value,
                            })),
                            { id: currentUser.id },
                        ],
                    },
                },
                include: {
                    users: true,
                },
            });

            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, "conversation:new", newConversation);
                }
            });

            return NextResponse.json(newConversation);
        }

        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId!],
                        },
                    },
                    {
                        userIds: {
                            equals: [userId!, currentUser.id],
                        },
                    },
                ],
            },
        });

        const singleConversation = existingConversations[0];

        if (singleConversation) {
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id,
                        },
                        {
                            id: userId,
                        },
                    ],
                },
            },
            include: {
                users: true,
            },
        });

        newConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:new", newConversation);
            }
        });

        return NextResponse.json(newConversation, { status: 201 });
    } catch (error) {
        console.log(error, "CONVERSATIONS_ERROR");

        return NextResponse.json({ message: "Internal Error!" }, { status: 500 });
    }
}
