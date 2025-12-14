import React, { useState } from "react";
import Table from "@/Components/Table.jsx";
import TableData from "@/Components/TableData.jsx";
import { Link, router } from "@inertiajs/react";
import DeleteModal from "@/Components/DeleteModal";
import GroupAdminLayout from "../../../../Layouts/GroupAdminLayout";

const columns = [
    {
        field: "Email",
    },
    {
        field: "Actions",
    },
];
const Index = ({ subscribers }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.subscribers.delete", {
                subscriber: selectedSubscriber,
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
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                        Subscribers Management
                    </h1>
                    <p className="text-zinc-400 text-sm font-medium mt-1">
                        Manage your newsletter subscribers
                    </p>
                </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl shadow-xl shadow-black/50 overflow-hidden">
                <Table datas={subscribers} columns={columns}>
                    <TableData>
                        {(subscriber) => (
                            <p className="text-zinc-300 font-medium">
                                {subscriber.email}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(subscriber) => (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={window.route(
                                        "group.admin.subscribers.edit",
                                        { subscriber }
                                    )}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
                                    title="Edit Subscriber"
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
                                        setSelectedSubscriber(subscriber);
                                    }}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                                    title="Delete Subscriber"
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
            </div>

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure you want to delete this subscriber?"}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
