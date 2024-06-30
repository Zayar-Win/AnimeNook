import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import FilePondUploader from "@/Components/FilePondUploader";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Season from "../Seasons/Index";

const columns = [
    {
        field: "Chapter Number",
    },
    {
        field: "Season",
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

const MangaForm = ({ type, manga, statuses, chapters, seasons }) => {
    const [statusOptions, setStatusOptions] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const { data, setData, post, errors } = useForm({
        thumbnail: manga?.thumbnail ?? null,
        background_image: manga?.background_image ?? null,
        transparent_background: manga?.transparent_background ?? null,
        name: manga?.name ?? "",
        status_id: manga?.status_id ?? 1,
        description: manga?.description ?? "",
    });
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.mangas.chapters.delete", {
                chapter: selectedChapter,
                manga,
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
                    {type === "eidt" ? "Edit" : "Create New"} Manga
                </h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        type === "edit"
                            ? post(window.route("group.admin.mangas.update"))
                            : post(window.route("group.admin.mangas.store"));
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
                            Seasons
                        </h1>
                        <div className="flex justify-end">
                            <Button
                                href={window.route(
                                    "group.admin.manga.seasons.create",
                                    {
                                        manga: manga.slug,
                                    }
                                )}
                                text={"Create Season"}
                                className={"!bg-blue-500 my-8 mr-5"}
                            />
                        </div>
                        {seasons?.data.length > 0 ? (
                            <Season
                                seasons={seasons}
                                serie={manga}
                                type={"manga"}
                            />
                        ) : (
                            <p className="text-center text-xl text-gray-500 font-medium">
                                No Seasons are created.
                            </p>
                        )}
                    </div>
                )}

                {type === "edit" && (
                    <div>
                        <h1 className="text-xl font-semibold mt-6 mb-3">
                            Chapters
                        </h1>
                        <div className="flex justify-end">
                            <Button
                                href={window.route(
                                    "group.admin.mangas.chapters.create",
                                    { manga }
                                )}
                                text={"Create Chapter"}
                                className={"!bg-blue-500 my-8 mr-5"}
                            />
                        </div>
                        <Table datas={chapters} columns={columns}>
                            <TableData>
                                {(chapter) => <p>{chapter?.chapter_number}</p>}
                            </TableData>
                            <TableData>
                                {(chapter) => <p>{chapter?.season?.title}</p>}
                            </TableData>
                            <TableData>
                                {(chapter) => <p>{chapter?.title}</p>}
                            </TableData>
                            <TableData>
                                {(chapter) => (
                                    <img
                                        className="w-20 h-10 object-cover"
                                        src={chapter?.thumbnail}
                                        alt="Anime ThumbNail"
                                    ></img>
                                )}
                            </TableData>
                            <TableData className={"max-w-[400px]"}>
                                {(chapter) => (
                                    <a
                                        href={chapter?.chapter_link}
                                        className="line-clamp-1 hover:underline hover:text-blue-500"
                                    >
                                        {chapter?.chapter_link}
                                    </a>
                                )}
                            </TableData>
                            <TableData>
                                {(chapter) => (
                                    <p className="line-clamp-2">
                                        {chapter?.description}
                                    </p>
                                )}
                            </TableData>
                            <TableData>
                                {(chapter) => <p>{chapter?.like_count}</p>}
                            </TableData>
                            <TableData>
                                {(chapter) => <p>{chapter?.view_count}</p>}
                            </TableData>
                            <TableData>
                                {(chapter) => (
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Link
                                            href={window.route(
                                                "group.admin.mangas.chapters.edit",
                                                {
                                                    manga,
                                                    chapter,
                                                }
                                            )}
                                            className="hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <div
                                            onClick={() => {
                                                setIsDeleteModalOpen(true);
                                                setSelectedChapter(chapter);
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
                                    "Are you sure want to delete this chapter."
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MangaForm;
MangaForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
