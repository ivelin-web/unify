"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { joiResolver } from "@hookform/resolvers/joi";
import registerSchema from "@/app/validations/validateRegister";
import loginSchema from "@/app/validations/validateLogin";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>("LOGIN");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        unregister,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "all",
        resolver: joiResolver(variant === "LOGIN" ? loginSchema : registerSchema),
    });

    const toggleVariant = useCallback(() => {
        reset();

        if (variant === "LOGIN") {
            register("name", { value: "" });
            register("confirmPassword", { value: "" });
            setVariant("REGISTER");

            return;
        }

        unregister("name");
        unregister("confirmPassword");
        setVariant("LOGIN");
    }, [variant]);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === "REGISTER") {
            axios
                .post("/api/register", data)
                .then(() => {
                    toast.success("You have been registered");
                    signIn("credentials", data);
                })
                .catch(({ response }: AxiosError<{ message: string }>) => {
                    toast.error(response?.data.message || "Something went wrong!");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }

        if (variant === "LOGIN") {
            signIn("credentials", {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error("Invalid credentials");
                    }

                    if (callback?.ok && !callback.error) {
                        toast.success("Logged in successfully");
                        router.push("/conversations");
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, {
            redirect: false,
        })
            .then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid credentials");
                }

                if (callback?.ok && !callback.error) {
                    toast.success("Logged in successfully");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-10 py-8 shadow sm:rounded-lg">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === "REGISTER" && <Input id="name" label="Name" type="text" register={register} errors={errors} disabled={isLoading} />}
                    <Input id="email" label="Email address" type="email" register={register} errors={errors} disabled={isLoading} />
                    <Input id="password" label="Password" type="password" register={register} errors={errors} disabled={isLoading} />
                    {variant === "REGISTER" && <Input id="confirmPassword" label="Confirm Password" type="password" register={register} errors={errors} disabled={isLoading} />}
                    <div>
                        <Button disabled={isLoading} fullWidth type="submit">
                            {variant === "LOGIN" ? "Sign in" : "Register"}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-2">
                        <AuthSocialButton icon={BsGithub} onClick={() => socialAction("github")} />
                        <AuthSocialButton icon={BsGoogle} onClick={() => socialAction("google")} />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>{variant === "LOGIN" ? "New to Unify?" : "Already have an account?"}</div>
                    <div onClick={toggleVariant} className="underline cursor-pointer">
                        {variant === "LOGIN" ? "Create an account" : "Sign in"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
