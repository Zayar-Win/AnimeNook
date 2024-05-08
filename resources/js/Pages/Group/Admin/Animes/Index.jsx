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
        <div>
            <h1 className="text-center text-xl font-bold my-10">
                Animes Management
            </h1>
            <div className="flex justify-end">
                <Button
                    href={window.route("group.admin.animes.create")}
                    text={"Create Anime"}
                    className={"!bg-blue-500 my-8 mr-5"}
                />
            </div>
            <Table datas={animes} columns={columns}>
                <TableData>{(anime) => <p>{anime.name}</p>}</TableData>
                <TableData>
                    {(anime) => (
                        <img
                            className="w-20 h-10 object-cover"
                            src={anime.thumbnail}
                            alt="Anime ThumbNail"
                        ></img>
                    )}
                </TableData>
                <TableData className={"min-w-[300px]"}>
                    {(anime) => (
                        <p className="line-clamp-1">{anime.description}</p>
                    )}
                </TableData>
                <TableData>
                    {(anime) => (
                        <p className="font-extrabold">{anime?.status?.name}</p>
                    )}
                </TableData>
                <TableData>
                    {(anime) => (
                        <p className="font-extrabold">
                            <span className="text-yellow-500 pr-3">
                                {anime?.rating}
                            </span>{" "}
                            Ratings
                        </p>
                    )}
                </TableData>
                <TableData>
                    {(anime) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route("group.admin.animes.edit", {
                                    anime,
                                })}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedAnime(anime);
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
