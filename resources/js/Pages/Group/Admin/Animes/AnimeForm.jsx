import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import FilePondUploader from "@/Components/FilePondUploader";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const columns = [
    {
        field: "Chapter Number",
    },
    {
        field: "Title",
    },
    {
        field: "Thumbnail",
    },
    {
        field: "Video Link",
    },
    {
        field: "Description",
    },
    {
        field: "Likes",
    },
    {
        field: "Views",
    },
    {
        field: "Actions",
    },
];

const AnimeForm = ({ type, statuses, anime, episodes }) => {
    const [statusOptions, setStatusOptions] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const { data, setData, post, errors } = useForm({
        thumbnail: anime?.thumbnail ?? null,
        background_image: anime?.background_image ?? null,
        transparent_background: anime?.transparent_background ?? null,
        name: anime?.name ?? "",
        status_id: anime?.status_id ?? 1,
        description: anime?.description ?? "",
    });
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.animes.episodes.delete", {
                episode: selectedEpisode,
                anime,
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
    useEffect(() => {
        if (statuses.length > 0) {
            const options = statuses.map((status) => {
                return {
                    label: status.name,
                    value: status.id,
                };
            });
            setStatusOptions(options);
        }
    }, []);
    return (
        <div>
            <div className="w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-6">
                    {type === "eidt" ? "Edit" : "Create New"} Anime
                </h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        type === "edit"
                            ? post(window.route("group.admin.animes.update"))
                            : post(window.route("group.admin.animes.store"));
                    }}
                >
                    <div className="grid grid-cols-2 gap-x-10 gap-y-14">
                        <div className={"col-span-2 relative"}>
                            <InputLabel value={"Thumbnail"} />
                            <FilePondUploader
                                photos={data.thumbnail}
                                onUpload={(file) => setData("thumbnail", file)}
                            />
                            <InputError message={errors.thumbnail} />
                        </div>
                        <div>
                            <InputLabel isOptional value={"Background Image"} />
                            <FilePondUploader
                                photos={data.background_image}
                                onUpload={(file) =>
                                    setData("background_image", file)
                                }
                            />
                            <InputError message={errors.background_image} />
                        </div>
                        <div>
                            <InputLabel
                                isOptional
                                value={"Transparent Background Image"}
                            />
                            <FilePondUploader
                                photos={data.transparent_background}
                                onUpload={(file) =>
                                    setData("transparent_background", file)
                                }
                            />
                            <InputError
                                message={errors.transparent_background}
                            />
                        </div>
                        <div>
                            <Input
                                label="Name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                errorMessage={errors.name}
                            />
                        </div>
                        <div>
                            <Select
                                label={"Status"}
                                options={statusOptions}
                                selected={data.status_id}
                                onChange={(status) =>
                                    setData("status_id", status.value)
                                }
                                errorMessage={errors.status}
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                textarea
                                label="Description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                errorMessage={errors.description}
                            />
                        </div>
                    </div>
                    <Button
                        text={type === "edit" ? "Update" : "Create"}
                        type={"submit"}
                        className={"!bg-blue-500 !inline-block my-8 !px-20"}
                    />
                </form>
                {type === "edit" && (
                    <div>
                        <h1 className="text-xl font-semibold mt-6 mb-3">
                            Episodes
                        </h1>
                        <div className="flex justify-end">
                            <Button
                                href={window.route(
                                    "group.admin.animes.episodes.create",
                                    { anime }
                                )}
                                text={"Create Eposide"}
                                className={"!bg-blue-500 my-8 mr-5"}
                            />
                        </div>
                        <Table datas={episodes} columns={columns}>
                            <TableData>
                                {(episode) => <p>{episode?.chapter_number}</p>}
                            </TableData>
                            <TableData>
                                {(episode) => <p>{episode?.title}</p>}
                            </TableData>
                            <TableData>
                                {(episode) => (
                                    <img
                                        className="w-20 h-10 object-cover"
                                        src={episode?.thumbnail}
                                        alt="Anime ThumbNail"
                                    ></img>
                                )}
                            </TableData>
                            <TableData className={"max-w-[400px]"}>
                                {(episode) => (
                                    <a
                                        href={episode?.chapter_link}
                                        className="line-clamp-1 hover:underline hover:text-blue-500"
                                    >
                                        {episode?.chapter_link}
                                    </a>
                                )}
                            </TableData>
                            <TableData>
                                {(episode) => (
                                    <p className="line-clamp-2">
                                        {episode?.description}
                                    </p>
                                )}
                            </TableData>
                            <TableData>
                                {(episode) => <p>{episode?.like_count}</p>}
                            </TableData>
                            <TableData>
                                {(episode) => <p>{episode?.view_count}</p>}
                            </TableData>
                            <TableData>
                                {(episode) => (
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Link
                                            href={window.route(
                                                "group.admin.animes.episodes.edit",
                                                {
                                                    anime,
                                                    episode,
                                                }
                                            )}
                                            className="hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <div
                                            onClick={() => {
                                                setIsDeleteModalOpen(true);
                                                setSelectedEpisode(episode);
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
                                title={
                                    "Are you sure want to delete this episode."
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnimeForm;
AnimeForm.layout = (page) => <AdminLayout>{page}</AdminLayout>;
