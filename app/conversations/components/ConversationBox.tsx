"use client";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/typings";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

type Props = {
    conversation: FullConversationType;
    selected?: boolean;
};

const ConversationBox: React.FC<Props> = ({ conversation, selected }) => {
    const otherUser = useOtherUser(conversation);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${conversation.id}`);
    }, [conversation?.id, router]);

    const lastMessage = useMemo(() => {
        const messages = conversation.messages || [];

        return messages[messages.length - 1];
    }, [conversation?.messages]);

    const userEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }

        const seenArray = lastMessage.seen || [];

        if (!userEmail) {
            return false;
        }

        return seenArray.filter((user) => user.email === userEmail).length !== 0;
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return "Sent an image";
        }

        if (lastMessage?.body) {
            return lastMessage.body;
        }

        return "Started a conversation";
    }, [lastMessage]);

    const mainDivStyles = clsx("w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3", selected ? "bg-neutral-100" : "bg-white");

    return (
        <div onClick={handleClick} className={mainDivStyles}>
            {conversation.isGroup ? <AvatarGroup users={conversation.users} /> : <Avatar user={otherUser} />}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-lg font-medium text-gray-900 truncate">{conversation.name || otherUser.name}</p>
                        {lastMessage?.createdAt && <p className="text-xs text-gray-400 font-light">{format(new Date(lastMessage.createdAt), "p")}</p>}
                    </div>
                    <p className={clsx("truncate text-sm", hasSeen ? "text-gray-500" : "text-black font-medium")}>{lastMessageText}</p>
                </div>
            </div>
        </div>
    );
};

export default ConversationBox;
