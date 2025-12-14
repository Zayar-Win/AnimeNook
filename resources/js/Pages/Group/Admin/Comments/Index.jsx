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
        <div className="bg-[#0a0a0a] min-h-screen p-8 text-white">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(237,100,0,0.15)]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                        Comments Management
                    </h1>
                    <p className="text-zinc-400 text-sm font-medium mt-1">
                        Moderate user comments and discussions
                    </p>
                </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl shadow-xl shadow-black/50 overflow-hidden">
                <Table datas={comments} columns={columns}>
                    <TableData>
                        {(comment) => (
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    comment.commentable_type ===
                                    "App\\Models\\Anime"
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                }`}
                            >
                                {comment.commentable_type ===
                                "App\\Models\\Anime"
                                    ? "Anime"
                                    : "Manga"}
                            </span>
                        )}
                    </TableData>
                    <TableData>
                        {(comment) => (
                            <p className="font-bold text-white line-clamp-1">
                                {comment.commentable.name}
                            </p>
                        )}
                    </TableData>
                    <TableData className={"min-w-[300px]"}>
                        {(comment) => (
                            <div
                                className="text-zinc-400 text-sm leading-relaxed line-clamp-2"
                                dangerouslySetInnerHTML={{
                                    __html: comment.body,
                                }}
                            />
                        )}
                    </TableData>
                    <TableData>
                        {(comment) => (
                            <div className="flex items-center gap-1.5 font-bold text-white">
                                <svg
                                    className="w-4 h-4 text-red-500 fill-red-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span>{comment.likes_count}</span>
                            </div>
                        )}
                    </TableData>
                    <TableData>
                        {(comment) => (
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedComment(comment);
                                }}
                                className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                                title="Delete Comment"
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
                        )}
                    </TableData>
                </Table>
            </div>

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure you want to delete this comment?"}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
