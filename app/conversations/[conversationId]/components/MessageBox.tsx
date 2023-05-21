"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/typings";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

type Props = {
    isLast?: boolean;
    message: FullMessageType;
};

const MessageBox: React.FC<Props> = ({ isLast, message }) => {
    const session = useSession();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const isOwn = session.data?.user?.email === message.sender.email;
    const seenList = (message.seen || [])
        .filter((user) => user.email !== message.sender.email)
        .map((user) => user.name)
        .join(", ");

    const containerStyles = clsx("flex gap-3 p-4", isOwn && "justify-end");
    const avatarStyles = clsx(isOwn && "order-2");
    const bodyStyles = clsx("flex flex-col gap-2", isOwn && "items-end");
    const messageStyles = clsx("text-sm w-fit overflow-hidden", isOwn ? "bg-sky-500 text-white" : "bg-gray-100", message.image ? "rounded-md p-0" : "rounded-full py-2 px-3");

    return (
        <div className={containerStyles}>
            <div className={avatarStyles}>
                <Avatar user={message.sender} />
            </div>
            <div className={bodyStyles}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">{message.sender.name}</div>
                    <div className="text-xs text-gray-400">{format(new Date(message.createdAt), "p")}</div>
                </div>
                <div className={messageStyles}>
                    <ImageModal src={message.image} isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
                    {message.image ? <Image onClick={() => setIsImageModalOpen(true)} alt="Image" height={288} width={288} src={message.image} className="object-cover cursor-pointer hover:scale-110 transition translate" /> : <div>{message.body}</div>}
                </div>
                {isLast && isOwn && seenList.length > 0 && <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>}
            </div>
        </div>
    );
};

export default MessageBox;
