import { Prisma } from "@prisma/client";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
    const conversationSelect = {
        id: true,
        name: true,
        isGroup: true,
        users: {
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
            },
        },
        messages: {
            select: {
                id: true,
                body: true,
                image: true,
                createdAt: true,
                seen: {
                    select: {
                        email: true,
                    },
                },
            },
        },
    } satisfies Prisma.ConversationSelect;

    const userSelect = {
        id: true,
        name: true,
    } satisfies Prisma.UserSelect;

    const conversations = await getConversations({ select: conversationSelect });

    const users = await getUsers({ select: userSelect });

    return (
        // @ts-expect-error Server Component
        <Sidebar>
            <div className="h-full">
                <ConversationList users={users} initialConversations={conversations} />
                {children}
            </div>
        </Sidebar>
    );
}
