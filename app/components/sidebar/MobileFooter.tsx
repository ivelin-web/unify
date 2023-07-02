"use client";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import SettingsModal from "./SettingsModal";
import { User } from "@prisma/client";
import { useState } from "react";
import { SlSettings } from "react-icons/sl";
import useConversation from "@/app/hooks/useConversation";

type Props = {
    currentUser: User;
};

const MobileFooter: React.FC<Props> = ({ currentUser }) => {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    if (isOpen) {
        return null;
    }

    return (
        <>
            <SettingsModal currentUser={currentUser} isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
            <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
                {routes.map((route) => (
                    <MobileItem key={route.label} href={route.href} active={route.active} icon={route.icon} onClick={route.onClick} />
                ))}
                <MobileItem icon={SlSettings} onClick={() => setIsSettingsModalOpen(true)} />
            </div>
        </>
    );
};

export default MobileFooter;
