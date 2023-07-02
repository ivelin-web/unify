import { Conversation, Message, User } from "@prisma/client";
import { IconType } from "react-icons";

type RouteItem = {
    label?: string;
    href?: string;
    icon: IconType;
    active?: boolean;
    onClick?: () => void;
};

type FullMessageType = Message & {
    sender: User;
    seen: User[];
};

type FullConversationType = Conversation & {
    users: User[];
    messages: FullMessageType[];
};
