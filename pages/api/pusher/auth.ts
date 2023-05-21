import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/lib/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

type Body = {
    socket_id: string;
    channel_name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { socket_id: socketId, channel_name: channel }: Body = req.body;
    const data = {
        user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return res.send(authResponse);
}
