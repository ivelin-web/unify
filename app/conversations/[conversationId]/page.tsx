import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

type Params = {
    params: { conversationId: string };
};

const Conversation = async ({ params: { conversationId } }: Params) => {
    const conversation = await getConversationById(conversationId);

    const select = {
        id: true,
        image: true,
        createdAt: true,
        body: true,
        sender: {
            select: {
                email: true,
                name: true,
                image: true
            }
        },
        seen: {
            select: {
                email: true,
                name: true
            }
        }
    } satisfies Prisma.MessageSelect;

    const messages = await getMessages({ conversationId, select });

    if (!conversation) {
        return notFound();
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    );
};

export default Conversation;
