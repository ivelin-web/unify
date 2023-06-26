import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";

type Params = {
    params: { conversationId?: string };
};

export async function DELETE(req: Request, { params: { conversationId } }: Params) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });

        if (!existingConversation) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id],
                },
            },
        });

        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:remove", existingConversation);
            }
        });

        return NextResponse.json({ message: "Conversation has been deleted successfully" });
    } catch (error) {
        console.log(error, "ERROR_CONVERSATION_DELETE");

        return NextResponse.json({ message: "Internal Error!" }, { status: 500 });
    }
}
