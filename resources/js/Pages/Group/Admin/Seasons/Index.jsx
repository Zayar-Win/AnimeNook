import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    {
        field: "Anime",
    },
    {
        field: "Season Title",
    },
    {
        field: "Season Number",
    },
    {
        field: "Chapter Count",
    },
    {
        field: "Actions",
    },
];

const Index = ({ seasons, serie, type }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.seasons.delete", {
                season: selectedSeason,
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
            <Table datas={seasons} columns={columns}>
                <TableData>
                    {(season) => <p>{season?.seasonable.name}</p>}
                </TableData>
                <TableData>{(season) => <p>{season?.title}</p>}</TableData>
                <TableData>
                    {(season) => <p>{season?.season_number}</p>}
                </TableData>
                <TableData>
                    {(season) => <p>{season.chapters_count}</p>}
                </TableData>
                <TableData>
                    {(season) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route(
                                    type === "anime"
                                        ? "group.admin.anime.seasons.edit"
                                        : "group.admin.manga.seasons.edit",
                                    type === "anime"
                                        ? {
                                              anime: serie,
                                              season,
                                          }
                                        : {
                                              manga: serie,
                                              season,
                                          }
                                )}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedSeason(season);
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
                    title={"Are you sure want to delete this season."}
                    body={"The episodes in this season will not have season."}
                />
            )}
        </div>
    );
};

export default Index;
