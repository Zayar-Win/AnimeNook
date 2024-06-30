import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    {
        field: "Type",
    },
    {
        field: "Name",
    },
    {
        field: "Comment",
    },
    {
        field: "Like Count",
    },
    {
        field: "Action",
    },
];

const Index = ({ comments }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.comments.delete", {
                comment: selectedComment,
            }),
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
                Comments Management
            </h1>
            <Table datas={comments} columns={columns}>
                <TableData>
                    {(comment) => (
                        <p className="font-extrabold">
                            {comment.commentable_type === "App\\Models\\Anime"
                                ? "Anime"
                                : "Manga"}
                        </p>
                    )}
                </TableData>
                <TableData>
                    {(comment) => <p>{comment.commentable.name}</p>}
                </TableData>
                <TableData className={"min-w-[300px]"}>
                    {(comment) => (
                        <p className="line-clamp-3">{comment.body}</p>
                    )}
                </TableData>
                <TableData>
                    {(comment) => <p>{comment.likes_count}</p>}
                </TableData>
                <TableData>
                    {(comment) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedComment(comment);
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
