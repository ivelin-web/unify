import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

type Body = {
    name: string;
    image: string;
};

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { name, image }: Body = await req.json();

        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                image,
                name,
            },
        });

        return NextResponse.json({ message: "Profile is updated successfully" });
    } catch (error) {
        console.log(error, "ERROR_SETTINGS");

        return NextResponse.json({ message: "Internal Error!" }, { status: 500 });
    }
}
