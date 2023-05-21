import EmptyState from "../components/EmptyState";

const Users = async () => {
    return (
        <div className="hidden lg:block lg:pl-80 h-full">
            <EmptyState />
        </div>
    );
};

export default Users;
