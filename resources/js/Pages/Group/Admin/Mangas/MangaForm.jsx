import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import FilePondUploader from "@/Components/FilePondUploader";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import { mangaThumbnailUrl } from "@/app";
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
        field: "Reader",
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

const MangaForm = ({ type, manga, statuses, chapters, seasons, tags }) => {
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
        tag_ids:
            manga?.tags?.map((tag) => {
                return {
                    value: tag.id,
                    label: tag.name,
                };
            }) ?? [],
    });
    const [tagOptions, setTagOptions] = useState([]);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get("tab");
        if (tab && tabs.find((t) => t.id === tab)) {
            setActiveTab(tab);
        }
    }, [window.location.search]);

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

    const tabs = [
        { id: "details", label: "Details" },
        ...(type === "edit"
            ? [
                  { id: "seasons", label: "Seasons" },
                  { id: "chapters", label: "Chapters" },
              ]
            : []),
    ];

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
    useEffect(() => {
        if (tags.length > 0) {
            const options = tags.map((tag) => {
                return {
                    label: tag.name,
                    value: tag.id,
                };
            });
            setTagOptions(options);
        }
    }, []);
    return (
        <div className="bg-[#0a0a0a] min-h-screen p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(237,100,0,0.15)] shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                                {type === "edit"
                                    ? "Edit Manga"
                                    : "Create New Manga"}
                            </h1>
                            <p className="text-zinc-400 text-sm font-medium mt-1">
                                {type === "edit"
                                    ? "Manage manga details, seasons, and chapters"
                                    : "Add a new manga series to the catalog"}
                            </p>
                        </div>
                    </div>
                    {type === "edit" && activeTab !== "details" && (
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {activeTab === "seasons" && (
                                <Button
                                    href={window.route(
                                        "group.admin.manga.seasons.create",
                                        {
                                            manga: manga.slug,
                                        }
                                    )}
                                    text={"Create Season"}
                                    className={
                                        "!bg-primary hover:!bg-primary/90 !px-6 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 w-full sm:w-auto text-center justify-center"
                                    }
                                />
                            )}
                            {activeTab === "chapters" && (
                                <Button
                                    href={window.route(
                                        "group.admin.mangas.chapters.create",
                                        { manga }
                                    )}
                                    text={"Create Chapter"}
                                    className={
                                        "!bg-primary hover:!bg-primary/90 !px-6 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 w-full sm:w-auto text-center justify-center"
                                    }
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Details Tab (Form) */}
                <div className={activeTab === "details" ? "block" : "hidden"}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            type === "edit"
                                ? post(
                                      window.route(
                                          "group.admin.mangas.update",
                                          {
                                              manga,
                                          }
                                      )
                                  )
                                : post(
                                      window.route("group.admin.mangas.store")
                                  );
                        }}
                        className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 shadow-xl shadow-black/50 mb-10"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column - Images */}
                            <div className="lg:col-span-1 space-y-6">
                                <div>
                                    <InputLabel
                                        value={"Thumbnail (optional)"}
                                        className="!text-zinc-400 !mb-2"
                                    />
                                    <div className="bg-black/20 rounded-xl p-2 border border-white/5">
                                        <FilePondUploader
                                            photos={data.thumbnail}
                                            onUpload={(file) =>
                                                setData("thumbnail", file)
                                            }
                                        />
                                    </div>
                                    <InputError message={errors.thumbnail} />
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        errorMessage={errors.name}
                                        placeholder="Enter manga title"
                                    />
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
                                <div>
                                    <Select
                                        label={"Tags"}
                                        isMulti={true}
                                        options={tagOptions}
                                        selected={data.tag_ids}
                                        onChange={(option) =>
                                            setData("tag_ids", [...option])
                                        }
                                        errorMessage={errors.tag_ids}
                                    />
                                </div>
                                <div>
                                    <Input
                                        textarea
                                        label="Description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        errorMessage={errors.description}
                                        placeholder="Write a brief synopsis..."
                                        className="!h-32"
                                    />
                                </div>

                                <div className="flex justify-end pt-6 border-t border-white/5">
                                    <Button
                                        text={
                                            type === "edit"
                                                ? "Save Changes"
                                                : "Create Manga"
                                        }
                                        type={"submit"}
                                        className={
                                            "!bg-primary hover:!bg-primary/90 !px-10 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {type === "edit" && (
                    <>
                        {/* Seasons Tab */}
                        <div
                            className={
                                activeTab === "seasons" ? "block" : "hidden"
                            }
                        >
                            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-xl shadow-black/50 overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Manage Seasons
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {seasons?.data.length > 0 ? (
                                        <Season
                                            seasons={seasons}
                                            serie={manga}
                                            type={"manga"}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                                            <p className="font-medium">
                                                No seasons created yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chapters Tab */}
                        <div
                            className={
                                activeTab === "chapters" ? "block" : "hidden"
                            }
                        >
                            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-xl shadow-black/50 overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Manage Chapters
                                    </h2>
                                </div>
                                <div className="">
                                    <Table datas={chapters} columns={columns}>
                                        <TableData>
                                            {(chapter) => (
                                                <span className="font-bold text-white bg-white/5 px-3 py-1 rounded-lg">
                                                    Ch {chapter?.chapter_number}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <span className="text-zinc-400">
                                                    {chapter?.season?.title}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <p className="font-medium text-white line-clamp-1">
                                                    {chapter?.title}
                                                </p>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <div className="w-24 h-14 rounded-lg overflow-hidden border border-white/10">
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={
                                                            chapter?.thumbnail ||
                                                            mangaThumbnailUrl
                                                        }
                                                        alt="Thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </TableData>
                                        <TableData className={"max-w-[200px]"}>
                                            {(chapter) => (
                                                <a
                                                    href={window.route(
                                                        "group.manga.chapter.read",
                                                        {
                                                            manga: manga.slug,
                                                            chapter: chapter.id,
                                                        },
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary hover:underline text-xs font-bold"
                                                >
                                                    Open reader
                                                </a>
                                            )}
                                        </TableData>
                                        <TableData className="max-w-[250px]">
                                            {(chapter) => (
                                                <p className="line-clamp-2 text-zinc-500 text-xs">
                                                    {chapter?.description}
                                                </p>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <span className="text-zinc-400 text-xs font-bold">
                                                    {chapter?.like_count}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <span className="text-zinc-400 text-xs font-bold">
                                                    {chapter?.view_count}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={window.route(
                                                            "group.admin.mangas.chapters.edit",
                                                            {
                                                                manga,
                                                                chapter,
                                                            }
                                                        )}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                                                        title="Edit Chapter"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
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
                                                            setIsDeleteModalOpen(
                                                                true
                                                            );
                                                            setSelectedChapter(
                                                                chapter
                                                            );
                                                        }}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                                                        title="Delete Chapter"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </TableData>
                                    </Table>
                                    {isDeleteModalOpen && (
                                        <DeleteModal
                                            setIsDeleteModalOpen={
                                                setIsDeleteModalOpen
                                            }
                                            deleteHandler={deleteHandler}
                                            title={
                                                "Are you sure you want to delete this chapter?"
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MangaForm;
MangaForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
