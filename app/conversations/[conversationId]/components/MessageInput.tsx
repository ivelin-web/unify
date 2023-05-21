"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
};

const MessageInput: React.FC<Props> = ({ placeholder, id, type, required, register, errors }) => {
    const inputStyles = "text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none";

    return (
        <div className="relative w-full">
            <input id={id} type={type} autoComplete={id} {...register(id, { required })} placeholder={placeholder} className={inputStyles} />
        </div>
    );
};

export default MessageInput;
