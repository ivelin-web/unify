"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import schema from "@/app/validations/validateCreateGroupChat";
import { joiResolver } from "@hookform/resolvers/joi";
import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type Props = {
    users: User[];
    isOpen?: boolean;
    onClose: () => void;
};

const GroupChatModal: React.FC<Props> = ({ users, isOpen, onClose }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            members: [],
        },
        mode: "all",
        resolver: joiResolver(schema),
    });

    const members = watch("members");

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios
            .post("/api/conversations", {
                ...data,
                isGroup: true,
            })
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch((error: AxiosError<{ message: string }>) => {
                toast.error(error.response?.data.message || "Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Create a group chat</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Create a chat with more than 2 people.</p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input register={register} label="Name" id="name" disabled={isLoading} errors={errors} />
                            <Select
                                disabled={isLoading}
                                label="Members"
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name,
                                }))}
                                onChange={(value: any) => setValue("members", value, { shouldValidate: true })}
                                value={members}
                            />
                            <p className="text-sm font-light leading-6 text-red-500">{errors.members?.message?.toString()}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button disabled={isLoading} onClick={onClose} type="button" secondary>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default GroupChatModal;
