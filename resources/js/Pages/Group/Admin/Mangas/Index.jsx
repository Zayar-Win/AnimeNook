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

const Index = ({ mangas }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedManga, setSelectedManga] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.mangas.delete", { manga: selectedManga }),
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
                Mangas Management
            </h1>
            <div className="flex justify-end">
                <Button
                    href={window.route("group.admin.mangas.create")}
                    text={"Create Manga"}
                    className={"!bg-blue-500 my-8 mr-5"}
                />
            </div>
            <Table datas={mangas} columns={columns}>
                <TableData>{(manga) => <p>{manga.name}</p>}</TableData>
                <TableData>
                    {(manga) => (
                        <img
                            className="w-20 h-10 object-cover"
                            src={manga.thumbnail}
                            alt="manga ThumbNail"
                        ></img>
                    )}
                </TableData>
                <TableData className={"min-w-[300px]"}>
                    {(manga) => (
                        <p className="line-clamp-1">{manga.description}</p>
                    )}
                </TableData>
                <TableData>
                    {(manga) => (
                        <p className="font-extrabold">{manga?.status?.name}</p>
                    )}
                </TableData>
                <TableData>
                    {(manga) => (
                        <p className="font-extrabold">
                            <span className="text-yellow-500 pr-3">
                                {manga?.rating}
                            </span>{" "}
                            Ratings
                        </p>
                    )}
                </TableData>
                <TableData>
                    {(manga) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route("group.admin.mangas.edit", {
                                    manga,
                                })}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedManga(manga);
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
                    title={"Are you sure want to delete this Manga."}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
