"use client";

import { RouteItem } from "@/typings";
import clsx from "clsx";
import Link from "next/link";

const DesktopItem: React.FC<RouteItem> = ({ href, icon: Icon, label, active, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };

    const linkStyles = clsx("group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100", active && "bg-gray-100 text-black");

    return (
        <li onClick={onClick}>
            <Link href={href} className={linkStyles}>
                <Icon className="h-6 w-6 shrink-0" />
                <span className="sr-only">{label}</span>
            </Link>
        </li>
    );
};

export default DesktopItem;
