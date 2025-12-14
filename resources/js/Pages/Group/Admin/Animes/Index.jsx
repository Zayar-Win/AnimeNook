import Button from "@/Components/Button";
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
        field: "ThumbNail",
    },
    {
        field: "Description",
    },
    {
        field: "Status",
    },
    {
        field: "Rating",
    },
    {
        field: "Action",
    },
];

const Index = ({ animes }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.animes.delete", { anime: selectedAnime }),
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
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                        Anime Management
                    </h1>
                    <p className="text-zinc-400 text-sm font-medium mt-1">
                        Manage your anime catalog and episodes
                    </p>
                </div>
                <div className="ml-auto">
                    <Button
                        href={window.route("group.admin.animes.create")}
                        text={"Create Anime"}
                        className={
                            "!bg-primary hover:!bg-primary/90 !px-6 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
                        }
                    />
                </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl shadow-xl shadow-black/50 overflow-hidden">
                <Table datas={animes} columns={columns}>
                    <TableData>
                        {(anime) => (
                            <p className="font-bold text-white">{anime.name}</p>
                        )}
                    </TableData>
                    <TableData>
                        {(anime) => (
                            <div className="w-12 h-16 rounded-lg overflow-hidden ring-1 ring-white/10">
                                <img
                                    className="w-full h-full object-cover"
                                    src={anime.thumbnail}
                                    alt="Anime ThumbNail"
                                />
                            </div>
                        )}
                    </TableData>
                    <TableData className={"min-w-[300px]"}>
                        {(anime) => (
                            <p className="line-clamp-2 text-zinc-400 text-sm leading-relaxed">
                                {anime.description}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(anime) => (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 capitalize border border-green-500/20">
                                {anime?.status?.name}
                            </span>
                        )}
                    </TableData>
                    <TableData>
                        {(anime) => (
                            <div className="flex items-center gap-1.5 font-bold text-white">
                                <svg
                                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span>{anime?.rating}</span>
                            </div>
                        )}
                    </TableData>
                    <TableData>
                        {(anime) => (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={window.route(
                                        "group.admin.animes.edit",
                                        {
                                            anime,
                                        }
                                    )}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
                                    title="Edit Anime"
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
                                        setSelectedAnime(anime);
                                    }}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                                    title="Delete Anime"
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
                    title={"Are you sure you want to delete this anime?"}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
