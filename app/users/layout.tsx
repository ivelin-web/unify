import { Prisma } from "@prisma/client";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
    const select = {
        id: true,
        email: true,
        name: true,
        image: true,
    } satisfies Prisma.UserSelect;

    const users = await getUsers({ select });

    return (
        // @ts-expect-error Server Component
        <Sidebar>
            <div className="h-full">
                <UserList users={users} />
                {children}
            </div>
        </Sidebar>
    );
}
