import bcrypt from "bcrypt";
import prisma from "@/app/lib/prismadb";
import { NextResponse } from "next/server";

type Body = {
    name: string;
    email: string;
    password: string;
};

export async function POST(req: Request) {
    try {
        const { email, name, password }: Body = await req.json();

        // TODO: Add better validations with joi for example
        if (!email || !name || !password) {
            return NextResponse.json({ message: "Missing info" }, { status: 400 });
        }

        const salt = 12;
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        return NextResponse.json({ message: "You are registered successfully" }, { status: 201 });
    } catch (error: any) {
        console.log(error, "REGISTRATION_ERROR");

        // Email exists
        if (error?.code && error.code === "P2002") {
            return NextResponse.json({ message: "The email already exists!" }, { status: 409 });
        }

        return NextResponse.json("Internal Error!", { status: 500 });
    }
}
