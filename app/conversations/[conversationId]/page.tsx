import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import { notFound } from "next/navigation";

type Params = {
    params: { conversationId: string };
};

const Conversation = async ({ params: { conversationId } }: Params) => {
    const conversation = await getConversationById(conversationId);
    const messages = await getMessages(conversationId);

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
