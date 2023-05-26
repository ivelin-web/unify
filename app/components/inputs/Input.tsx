"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
    label: string;
    id: string;
    type?: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    disabled?: boolean;
};

const Input: React.FC<Props> = ({ label, id, type, register, errors, disabled }) => {
    const inputStyles = clsx("form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6", errors[id] && "ring-rose-500", errors[id] ? "focus:ring-rose-500" : "focus:ring-sky-600", disabled && "opacity-50 cursor-default");

    return (
        <div>
            <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor={id}>
                {label}
            </label>
            <div className="mt-2">
                <input id={id} type={type} autoComplete={id} disabled={disabled} className={inputStyles} {...register(id)} />
            </div>
            <p className="text-sm font-light leading-6 text-red-500">{errors[id]?.message?.toString()}</p>
        </div>
    );
};

export default Input;
