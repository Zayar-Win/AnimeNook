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
import Season from "@/Pages/Group/Admin/Seasons/Index";

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

const AnimeForm = ({
    type,
    statuses,
    anime,
    episodes,
    seasons,
    tags,
    seasonFilters,
}) => {
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
        tag_ids:
            anime?.tags?.map((tag) => {
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

    const tabs = [
        { id: "details", label: "Details" },
        ...(type === "edit"
            ? [
                  { id: "seasons", label: "Seasons" },
                  { id: "episodes", label: "Episodes" },
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
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                                {type === "edit"
                                    ? "Edit Anime"
                                    : "Create New Anime"}
                            </h1>
                            <p className="text-zinc-400 text-sm font-medium mt-1">
                                {type === "edit"
                                    ? "Manage anime details, seasons, and episodes"
                                    : "Add a new anime series to the catalog"}
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:w-auto md:shrink-0 md:justify-end">
                        <Link
                            href={window.route("group.admin.animes")}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                        >
                            Back to anime list
                        </Link>
                        {type === "edit" && activeTab !== "details" && (
                            <>
                                {activeTab === "seasons" && (
                                    <Button
                                        href={window.route(
                                            "group.admin.anime.seasons.create",
                                            {
                                                anime: anime.slug,
                                            }
                                        )}
                                        text={"Create Season"}
                                        className={
                                            "!bg-primary hover:!bg-primary/90 !px-6 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 w-full sm:w-auto text-center justify-center"
                                        }
                                    />
                                )}
                                {activeTab === "episodes" && (
                                    <Button
                                        href={window.route(
                                            "group.admin.animes.episodes.create",
                                            { anime }
                                        )}
                                        text={"Create Episode"}
                                        className={
                                            "!bg-primary hover:!bg-primary/90 !px-6 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 w-full sm:w-auto text-center justify-center"
                                        }
                                    />
                                )}
                            </>
                        )}
                    </div>
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
                                          "group.admin.animes.update",
                                          {
                                              anime,
                                          }
                                      )
                                  )
                                : post(
                                      window.route("group.admin.animes.store")
                                  );
                        }}
                        className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 shadow-xl shadow-black/50 mb-10"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column - Images */}
                            <div className="lg:col-span-1 space-y-6">
                                <div>
                                    <InputLabel
                                        value={"Thumbnail"}
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
                                <div>
                                    <InputLabel
                                        isOptional
                                        value={"Background Image"}
                                        className="!text-zinc-400 !mb-2"
                                    />
                                    <div className="bg-black/20 rounded-xl p-2 border border-white/5">
                                        <FilePondUploader
                                            photos={data.background_image}
                                            onUpload={(file) =>
                                                setData(
                                                    "background_image",
                                                    file
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.background_image}
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        isOptional
                                        value={"Transparent Background"}
                                        className="!text-zinc-400 !mb-2"
                                    />
                                    <div className="bg-black/20 rounded-xl p-2 border border-white/5">
                                        <FilePondUploader
                                            photos={data.transparent_background}
                                            onUpload={(file) =>
                                                setData(
                                                    "transparent_background",
                                                    file
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.transparent_background}
                                    />
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
                                        placeholder="Enter anime title"
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
                                                : "Create Anime"
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
                                <div className="p-4 sm:p-6">
                                    {seasons ? (
                                        <Season
                                            seasons={seasons}
                                            serie={anime}
                                            type="anime"
                                            seasonFilters={seasonFilters}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                                            <p className="font-medium">
                                                No seasons data.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Episodes Tab */}
                        <div
                            className={
                                activeTab === "episodes" ? "block" : "hidden"
                            }
                        >
                            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-xl shadow-black/50 overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Manage Episodes
                                    </h2>
                                </div>
                                <div className="">
                                    <Table datas={episodes} columns={columns}>
                                        <TableData>
                                            {(episode) => (
                                                <span className="font-bold text-white bg-white/5 px-3 py-1 rounded-lg">
                                                    Ep {episode?.chapter_number}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(episode) => (
                                                <span className="text-zinc-400">
                                                    {episode?.season.title}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(episode) => (
                                                <p className="font-medium text-white line-clamp-1">
                                                    {episode?.title}
                                                </p>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(episode) => (
                                                <div className="w-24 h-14 rounded-lg overflow-hidden border border-white/10">
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={episode?.thumbnail}
                                                        alt="Thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </TableData>
                                        <TableData className={"max-w-[200px]"}>
                                            {(episode) => (
                                                <a
                                                    href={episode?.chapter_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary hover:underline text-xs truncate block"
                                                >
                                                    {episode?.chapter_link}
                                                </a>
                                            )}
                                        </TableData>
                                        <TableData className="max-w-[250px]">
                                            {(episode) => (
                                                <p className="line-clamp-2 text-zinc-500 text-xs">
                                                    {episode?.description}
                                                </p>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(episode) => (
                                                <span className="text-zinc-400 text-xs font-bold">
                                                    {episode?.like_count}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(episode) => (
                                                <span className="text-zinc-400 text-xs font-bold">
                                                    {episode?.view_count}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(episode) => (
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={window.route(
                                                            "group.admin.animes.episodes.edit",
                                                            {
                                                                anime,
                                                                episode,
                                                            }
                                                        )}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                                                        title="Edit Episode"
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
                                                            setSelectedEpisode(
                                                                episode
                                                            );
                                                        }}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                                                        title="Delete Episode"
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
                                                "Are you sure you want to delete this episode?"
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

export default AnimeForm;
AnimeForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
