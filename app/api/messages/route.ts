import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";

type Body = {
    message?: string;
    image?: string;
    conversationId: string;
};

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { message, image, conversationId }: Body = await req.json();

        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image,
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                sender: {
                    connect: {
                        id: currentUser.id,
                    },
                },
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
            include: {
                seen: true,
                sender: true,
            },
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id,
                    },
                },
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                    },
                },
            },
        });

        await pusherServer.trigger(conversationId, "messages:new", newMessage);
        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, "conversation:update", {
                id: conversationId,
                messages: [lastMessage],
            });
        });

        return NextResponse.json({ message: "Message has been created successfully" }, { status: 201 });
    } catch (error) {
        console.log(error, "ERROR_MESSAGES");
        return NextResponse.json({ message: "Internal Error!" }, { status: 500 });
    }
}
