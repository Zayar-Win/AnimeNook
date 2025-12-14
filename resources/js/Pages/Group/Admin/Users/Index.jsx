import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
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
            window.route("group.admin.users.delete", { user: selectedUser }),
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
        <div>
            <div className="flex items-center gap-4 py-8 mb-4">
                <div className="p-3 text-white bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(237,100,0,0.15)]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-primary"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                        User Management
                    </h1>
                    <p className="text-zinc-400 text-sm font-medium mt-1">
                        Manage members, roles, and permissions
                    </p>
                </div>
            </div>
            <Table datas={users} columns={columns}>
                <TableData>{(user) => <p>{user.name}</p>}</TableData>
                <TableData>
                    {(user) => (
                        <img
                            className="w-10 h-10 object-cover rounded-full"
                            src={user.profile_picture}
                            alt="Jese image"
                        ></img>
                    )}
                </TableData>
                <TableData>{(user) => <p>{user.email}</p>}</TableData>
                <TableData>
                    {(user) => <p className="capitalize">{user.role.name}</p>}
                </TableData>
                <TableData>
                    {(user) => <p className="capitalize">{user.type}</p>}
                </TableData>
                <TableData>
                    {(user) => (
                        <div className="flex items-center gap-3">
                            <Link
                                href={window.route("group.admin.users.edit", {
                                    user,
                                })}
                                className="p-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
                                title="Edit User"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedUser(user);
                                }}
                                className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                                title="Delete User"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line
                                        x1="10"
                                        y1="11"
                                        x2="10"
                                        y2="17"
                                    ></line>
                                    <line
                                        x1="14"
                                        y1="11"
                                        x2="14"
                                        y2="17"
                                    ></line>
                                </svg>
                            </button>
                        </div>
                    )}
                </TableData>
            </Table>
            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure want to delete this user."}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
