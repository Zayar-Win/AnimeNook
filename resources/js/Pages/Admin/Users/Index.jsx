import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    {
        field: "Name",
    },
    {
        field: "Profile",
        minWidth: "50px",
    },
    {
        field: "Email",
    },
    {
        field: "Role",
    },
    {
        field: "Type",
    },
    {
        field: "Action",
    },
];

const Index = ({ users }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("admin.users.delete", { user: selectedUser }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
            }
        );
    };
    return (
        <div className="bg-[#0a0a0a] min-h-screen p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black tracking-tight text-white">
                    User Management
                </h1>
                <Button
                    text={"Create User"}
                    type={"link"}
                    href={window.route("admin.users.create")}
                    className={
                        "!bg-primary hover:!bg-primary/90 !px-6 !py-3 !rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
                    }
                />
            </div>
            <Table datas={users} columns={columns}>
                <TableData>
                    {(user) => <p className="font-semibold">{user.name}</p>}
                </TableData>
                <TableData>
                    {(user) => (
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10">
                            <img
                                className="w-full h-full object-cover"
                                src={user.profile_picture}
                                alt={user.name}
                            />
                        </div>
                    )}
                </TableData>
                <TableData>
                    {(user) => <p className="text-zinc-400">{user.email}</p>}
                </TableData>
                <TableData>
                    {(user) => (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                            {user.role.name}
                        </span>
                    )}
                </TableData>
                <TableData>
                    {(user) => (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                                user.type === "premium"
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                            }`}
                        >
                            {user.type}
                        </span>
                    )}
                </TableData>
                <TableData>
                    {(user) => (
                        <div className="flex items-center gap-3">
                            <Link
                                href={window.route("admin.users.edit", {
                                    user,
                                })}
                                className="text-zinc-400 hover:text-primary transition-colors font-medium"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedUser(user);
                                }}
                                className="text-zinc-400 hover:text-red-500 transition-colors font-medium cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </TableData>
            </Table>
            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure you want to delete this user?"}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
