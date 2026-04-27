import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import ChunkUploader from "@/Components/ChunkUploader";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import RichTextEditor from "@/Components/Editor/RichTextEditor";
import Select from "@/Components/Select";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import { mangaThumbnailUrl } from "@/app";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
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

function ChapterRowActions({ manga, chapter, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Link
                href={window.route("group.admin.mangas.chapters.edit", {
                    manga,
                    chapter,
                })}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:h-9 sm:w-9"
                title="Edit chapter"
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
                    aria-hidden
                >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </Link>
            <button
                type="button"
                onClick={() => onDelete(chapter)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 sm:h-9 sm:w-9"
                title="Delete chapter"
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
                    aria-hidden
                >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    );
}

const MangaForm = ({
    type,
    manga,
    statuses,
    chapters,
    seasons,
    tags,
    seasonFilters,
}) => {
    const { url } = usePage();
    const [statusOptions, setStatusOptions] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedChapterIds, setSelectedChapterIds] = useState([]);
    const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);
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

    const deleteHandler = () => {
        if (!selectedChapter) return;

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
                    setSelectedChapter(null);
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
        const qs = url.includes("?") ? url.split("?")[1] : "";
        const tab = new URLSearchParams(qs).get("tab");
        const allowed =
            type === "edit"
                ? ["details", "seasons", "chapters"]
                : ["details"];
        if (tab && allowed.includes(tab)) {
            setActiveTab(tab);
        }
    }, [url, type]);

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

    const chapterRows = chapters?.data ?? [];

    const openChapterDelete = (chapter) => {
        setSelectedChapterIds([]);
        setSelectedChapter(chapter);
        setIsDeleteModalOpen(true);
    };

    const openBulkDelete = () => {
        if (!selectedChapterIds.length) return;
        setSelectedChapter(null);
        setIsDeleteModalOpen(true);
    };

    const bulkDeleteHandler = () => {
        if (!selectedChapterIds.length) return;

        setIsBulkDeletePending(true);
        router.post(
            window.route("group.admin.mangas.chapters.bulk-delete", { manga }),
            { chapter_ids: selectedChapterIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedChapterIds([]);
                },
                onFinish: () => {
                    setIsBulkDeletePending(false);
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mx-auto min-w-0 max-w-7xl">
                <div className="mb-6 flex flex-col items-stretch justify-between gap-5 border-b border-white/10 pb-6 sm:mb-8 md:flex-row md:items-center md:gap-6">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
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
                        <div className="flex min-w-0 flex-1 flex-col">
                            <h1 className="text-xl font-black leading-tight tracking-tight text-white sm:text-2xl md:text-3xl">
                                {type === "edit"
                                    ? "Edit Manga"
                                    : "Create New Manga"}
                            </h1>
                            <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                                {type === "edit"
                                    ? "Manage manga details, seasons, and chapters"
                                    : "Add a new manga series to the catalog"}
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:w-auto md:shrink-0 md:justify-end">
                        <Link
                            href={window.route("group.admin.mangas")}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                        >
                            Back to manga list
                        </Link>
                        {type === "edit" && activeTab !== "details" && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="-mx-4 mb-6 flex items-center gap-1.5 overflow-x-auto overscroll-x-contain px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mb-8 sm:gap-2 sm:px-0 [&::-webkit-scrollbar]:hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 ${
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            } min-h-[44px] sm:min-h-0`}
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
                        className="mb-8 rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/50 sm:mb-10 sm:p-6 lg:p-8"
                    >
                        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
                            {/* Left Column - Images */}
                            <div className="min-w-0 space-y-6 lg:col-span-1">
                                <div className="min-w-0">
                                    <InputLabel
                                        value={"Thumbnail (optional)"}
                                        className="!text-zinc-400 !mb-2"
                                    />
                                    <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20 p-2">
                                        <ChunkUploader
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
                            <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-2">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
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
                                    <RichTextEditor
                                        label="Description"
                                        value={data.description}
                                        onChange={(html) =>
                                            setData("description", html)
                                        }
                                        error={errors.description}
                                        placeholder="Write a brief synopsis..."
                                    />
                                </div>

                                <div className="flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row sm:justify-end sm:pt-6">
                                    <Button
                                        text={
                                            type === "edit"
                                                ? "Save Changes"
                                                : "Create Manga"
                                        }
                                        type={"submit"}
                                        className="!w-full !rounded-xl !bg-primary !px-6 !py-3 !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!w-auto sm:!px-10"
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
                            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] shadow-xl shadow-black/50">
                                <div className="border-b border-white/5 p-4 sm:p-6">
                                    <h2 className="flex items-center gap-2 text-lg font-black text-white sm:gap-3 sm:text-xl">
                                        <span className="h-5 w-1 shrink-0 rounded-full bg-primary sm:h-6"></span>
                                        Manage Seasons
                                    </h2>
                                </div>
                                <div className="p-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
                                    {seasons ? (
                                        <div className="min-w-0 sm:px-0">
                                            <Season
                                                seasons={seasons}
                                                serie={manga}
                                                type="manga"
                                                seasonFilters={
                                                    seasonFilters
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center px-4 py-12 text-zinc-500">
                                            <p className="text-center font-medium">
                                                No seasons data.
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
                            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] shadow-xl shadow-black/50">
                                <div className="border-b border-white/5 p-4 sm:p-6">
                                    <h2 className="flex items-center gap-2 text-lg font-black text-white sm:gap-3 sm:text-xl">
                                        <span className="h-5 w-1 shrink-0 rounded-full bg-primary sm:h-6"></span>
                                        Manage Chapters
                                    </h2>
                                </div>
                                <div className="space-y-3 p-4 md:hidden">
                                    {chapterRows.length === 0 ? (
                                        <p className="py-8 text-center text-sm text-zinc-500">
                                            No chapters yet. Create one from
                                            the button above.
                                        </p>
                                    ) : (
                                        chapterRows.map((chapter) => (
                                            <article
                                                key={chapter.id}
                                                className="rounded-2xl border border-white/5 bg-[#141414] p-4"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10">
                                                        <img
                                                            className="h-full w-full object-cover"
                                                            src={
                                                                chapter?.thumbnail ||
                                                                mangaThumbnailUrl
                                                            }
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="rounded-lg bg-white/5 px-2 py-0.5 text-xs font-bold text-white">
                                                                Ch{" "}
                                                                {
                                                                    chapter?.chapter_number
                                                                }
                                                            </span>
                                                            <span className="truncate text-xs text-zinc-500">
                                                                {
                                                                    chapter
                                                                        ?.season
                                                                        ?.title
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 font-semibold leading-snug text-white">
                                                            {chapter?.title}
                                                        </p>
                                                        {chapter?.description && (
                                                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                                                                {
                                                                    chapter.description
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="mt-2 flex flex-wrap gap-3 text-xs">
                                                            <span className="text-zinc-400">
                                                                <span className="font-bold text-zinc-500">
                                                                    Likes{" "}
                                                                </span>
                                                                {
                                                                    chapter?.like_count
                                                                }
                                                            </span>
                                                            <span className="text-zinc-400">
                                                                <span className="font-bold text-zinc-500">
                                                                    Views{" "}
                                                                </span>
                                                                {
                                                                    chapter?.view_count
                                                                }
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={window.route(
                                                                "group.manga.chapter.read",
                                                                {
                                                                    manga: manga.slug,
                                                                    chapter: chapter.id,
                                                                }
                                                            )}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="mt-2 inline-block text-xs font-bold text-primary hover:underline"
                                                        >
                                                            Open reader
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                                        Actions
                                                    </span>
                                                    <ChapterRowActions
                                                        manga={manga}
                                                        chapter={chapter}
                                                        onDelete={
                                                            openChapterDelete
                                                        }
                                                    />
                                                </div>
                                            </article>
                                        ))
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    {selectedChapterIds.length > 0 && (
                                        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                            <p className="text-sm font-semibold text-white">
                                                {selectedChapterIds.length} chapters selected
                                            </p>
                                            <button
                                                type="button"
                                                onClick={openBulkDelete}
                                                disabled={isBulkDeletePending}
                                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isBulkDeletePending
                                                    ? "Deleting..."
                                                    : "Delete Selected"}
                                            </button>
                                        </div>
                                    )}
                                    <Table
                                        datas={chapters}
                                        columns={columns}
                                        onSelectionChange={setSelectedChapterIds}
                                    >
                                        <TableData>
                                            {(chapter) => (
                                                <span className="rounded-lg bg-white/5 px-3 py-1 font-bold text-white">
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
                                                <p className="line-clamp-1 font-medium text-white">
                                                    {chapter?.title}
                                                </p>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <div className="h-14 w-24 overflow-hidden rounded-lg border border-white/10">
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={
                                                            chapter?.thumbnail ||
                                                            mangaThumbnailUrl
                                                        }
                                                        alt=""
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
                                                        }
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    Open reader
                                                </a>
                                            )}
                                        </TableData>
                                        <TableData className="max-w-[250px]">
                                            {(chapter) => (
                                                <p className="line-clamp-2 text-xs text-zinc-500">
                                                    {chapter?.description}
                                                </p>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <span className="text-xs font-bold text-zinc-400">
                                                    {chapter?.like_count}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <span className="text-xs font-bold text-zinc-400">
                                                    {chapter?.view_count}
                                                </span>
                                            )}
                                        </TableData>
                                        <TableData>
                                            {(chapter) => (
                                                <ChapterRowActions
                                                    manga={manga}
                                                    chapter={chapter}
                                                    onDelete={openChapterDelete}
                                                />
                                            )}
                                        </TableData>
                                    </Table>
                                </div>
                                {isDeleteModalOpen && (
                                    <DeleteModal
                                        setIsDeleteModalOpen={
                                            setIsDeleteModalOpen
                                        }
                                        deleteHandler={
                                            selectedChapter
                                                ? deleteHandler
                                                : bulkDeleteHandler
                                        }
                                        title={
                                            selectedChapter
                                                ? "Are you sure you want to delete this chapter?"
                                                : `Are you sure you want to delete ${selectedChapterIds.length} chapters?`
                                        }
                                    />
                                )}
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
