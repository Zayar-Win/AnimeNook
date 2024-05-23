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
            <h1 className="text-center text-xl font-bold my-10">
                User Management
            </h1>
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
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route("group.admin.users.edit", {
                                    user,
                                })}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedUser(user);
                                }}
                                className="hover:underline cursor-pointer"
                            >
                                Delete
                            </div>
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
