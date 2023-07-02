"use client";

import { RouteItem } from "@/typings";
import clsx from "clsx";
import Link from "next/link";

const MobileItem: React.FC<RouteItem> = ({ href, icon: Icon, active, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };

    const linkStyles = clsx("group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100", active && "bg-gray-100 text-black");

    return href ? (
        <Link href={href} className={linkStyles}>
            <Icon className="h-6 w-6" />
        </Link>
    ) : (
        <button onClick={handleClick} className={linkStyles}>
            <Icon className="h-6 w-6" />
        </button>
    );
};

export default MobileItem;
