import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";

type Params = {
    params: { conversationId?: string };
};

export async function POST(req: Request, { params: { conversationId } }: Params) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return NextResponse.json({ message: "Invalid ID!" }, { status: 400 });
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json({ message: "No messages to seen" });
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
        });

        await pusherServer.trigger(currentUser.email!, "conversation:update", {
            id: conversationId,
            messages: [updatedMessage],
        });

        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json({ message: "Message has been seen successfully" });
        }

        await pusherServer.trigger(conversationId!, "message:update", updatedMessage);

        return NextResponse.json({ message: "Message has been seen successfully" });
    } catch (error) {
        console.log(error, "ERROR_MESSAGES_SEEN");

        return NextResponse.json({ message: "Internal Error!" }, { status: 500 });
    }
}
