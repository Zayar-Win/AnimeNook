/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import ChunkUploader from "@/Components/ChunkUploader";
import RichTextEditor from "@/Components/Editor/RichTextEditor";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { uploadFileInChunks } from "@/utils/chunkUpload";

function fieldError(errors, key) {
    if (!errors || key == null) {
        return undefined;
    }
    const raw = errors[key];
    if (raw == null || raw === "") {
        return undefined;
    }
    return Array.isArray(raw) ? raw[0] : raw;
}

function firstImagesRelatedError(errors) {
    const direct = fieldError(errors, "images");
    if (direct) {
        return direct;
    }
    if (!errors) {
        return undefined;
    }
    const key = Object.keys(errors).find((k) => k.startsWith("images."));
    return key ? fieldError(errors, key) : undefined;
}

function AdminPagination({ meta }) {
    if (!meta?.links?.length || (meta?.last_page ?? 1) <= 1) return null;

    return (
        <nav
            className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            aria-label="Seasons pagination"
        >
            {meta.links.map((link, i) => {
                const isDisabled = !link.url;
                const active = link.active;
                const content = (
                    <span
                        className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-bold sm:min-h-10 sm:min-w-10 sm:px-3 sm:text-sm ${
                            active
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "border border-white/10 bg-[#141414] text-zinc-300 hover:border-white/20 hover:bg-white/5"
                        } ${isDisabled ? "pointer-events-none opacity-35" : ""}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
                if (isDisabled) {
                    return (
                        <span key={i} className="inline-flex">
                            {content}
                        </span>
                    );
                }
                return (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        className="inline-flex"
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}

function SeasonListToolbar({
    search,
    setSearch,
    searchInputRef,
    order,
    applyOrder,
    onClear,
    hasActiveFilters,
}) {
    return (
        <div className="mb-4 rounded-xl border border-white/5 bg-black/30 p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end sm:gap-3">
                <div className="sm:col-span-6">
                    <label
                        htmlFor="chapter-season-search"
                        className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Search seasons
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </span>
                        <input
                            ref={searchInputRef}
                            id="chapter-season-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Title or season #…"
                            autoComplete="off"
                            className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] py-2 pl-8 pr-2 text-sm text-white placeholder-zinc-600 outline-none ring-primary/30 focus:border-zinc-500 focus:ring-2"
                        />
                    </div>
                </div>
                <div className="sm:col-span-4">
                    <label
                        htmlFor="chapter-season-order"
                        className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Order by number
                    </label>
                    <select
                        id="chapter-season-order"
                        value={order}
                        onChange={(e) => applyOrder(e.target.value)}
                        className="h-[38px] w-full cursor-pointer rounded-lg border border-white/10 bg-[#0f0f0f] px-2 text-sm text-white outline-none focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div className="sm:col-span-2">
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasActiveFilters}
                        className="h-[38px] w-full rounded-lg border border-white/10 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

const ChapterForm = ({
    chapter,
    type,
    manga,
    seasons,
    images,
    seasonListFilters = {},
    selectedSeasonSummary = null,
}) => {
    const { url } = usePage();
    const form = useForm({
        thumbnail: chapter?.thumbnail ?? null,
        chapter_number: chapter?.chapter_number ?? "",
        title: chapter?.title ?? "",
        description: chapter?.description ?? "",
        season_id: chapter?.season_id ?? null,
        content_mode: chapter?.pdf_path ? "pdf" : "images",
        pdf: null,
        images: images ?? [],
    });
    const { data, setData, post, errors, processing } = form;

    const [uploading, setUploading] = useState(false);
    const [uploadLabel, setUploadLabel] = useState("");
    const [uploadPercent, setUploadPercent] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [activeImageUploads, setActiveImageUploads] = useState(0);

    const [search, setSearch] = useState(seasonListFilters?.search ?? "");
    const searchInputRef = useRef(null);
    const order = seasonListFilters?.order === "desc" ? "desc" : "asc";

    const seasonRows = seasons?.data ?? [];
    const selectionOnPage = useMemo(
        () => seasonRows.some((s) => s.id === data.season_id),
        [seasonRows, data.season_id],
    );

    const navigateWithMergedQuery = (updates) => {
        const path = url.split(/[?#]/)[0];
        const qsPart = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
        const params = new URLSearchParams(qsPart);
        Object.entries(updates).forEach(([k, v]) => {
            if (v === null || v === undefined || v === "") {
                params.delete(k);
            } else {
                params.set(k, String(v));
            }
        });
        const qs = params.toString();
        router.visit(qs ? `${path}?${qs}` : path, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const applyOrder = (nextOrder) => {
        navigateWithMergedQuery({
            season_order: nextOrder,
            chapter_seasons_page: 1,
        });
    };

    useEffect(() => {
        if (document.activeElement === searchInputRef.current) return;
        setSearch(seasonListFilters?.search ?? "");
    }, [seasonListFilters?.search]);

    useEffect(() => {
        const id = setTimeout(() => {
            const applied = (seasonListFilters?.search ?? "").trim();
            if (search.trim() === applied) return;
            navigateWithMergedQuery({
                season_search: search.trim() || null,
                chapter_seasons_page: 1,
            });
        }, 420);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const hasSeasonSearch = Boolean(search.trim());

    const clearSeasonFilters = () => {
        setSearch("");
        navigateWithMergedQuery({
            season_search: null,
            season_order: null,
            chapter_seasons_page: 1,
        });
    };

    const imagesError = firstImagesRelatedError(errors);
    const contentFileError = imagesError ?? fieldError(errors, "pdf");

    const isChapterSubmitting =
        uploading || processing || activeImageUploads > 0;

    const showOffPageSelection = Boolean(data.season_id) && !selectionOnPage;

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:py-8 lg:px-8">
            <div className="mx-auto min-w-0 w-full max-w-4xl">
                <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
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
                                aria-hidden
                            >
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl font-black leading-tight tracking-tight text-white sm:text-2xl md:text-3xl">
                                {type === "edit"
                                    ? "Edit Chapter"
                                    : "New Chapter"}
                            </h1>
                            <p className="mt-1 break-words text-xs font-medium text-zinc-400 sm:text-sm">
                                {manga?.name}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`${window.route("group.admin.mangas.edit", { manga })}?tab=chapters`}
                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                    >
                        Back to manga
                    </Link>
                </div>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (isChapterSubmitting) return;

                        setUploadError(null);

                        if (
                            data.content_mode === "images" &&
                            (activeImageUploads > 0 ||
                                (Array.isArray(data.images) &&
                                    data.images.some(
                                        (item) => item instanceof File,
                                    )))
                        ) {
                            setUploadError(
                                "Images are still uploading. Please wait until all uploads finish.",
                            );
                            return;
                        }

                        const submitUrl =
                            type === "edit"
                                ? window.route(
                                      "group.admin.mangas.chapters.update",
                                      { manga, chapter },
                                  )
                                : window.route(
                                      "group.admin.mangas.chapters.store",
                                      { manga },
                                  );

                        try {
                            setUploading(true);
                            setUploadLabel("Preparing chapter save…");
                            setUploadPercent(0);

                            let nextImages = data.images;
                            let nextPdf = data.pdf;

                            if (data.content_mode === "images") {
                                nextImages = Array.isArray(data.images)
                                    ? data.images
                                    : [];
                                nextPdf = null;
                            } else {
                                if (data.pdf instanceof File) {
                                    setUploadLabel("Uploading PDF…");
                                    setUploadPercent(0);
                                    const url = await uploadFileInChunks({
                                        file: data.pdf,
                                        target: "chapter-pdf",
                                        chunkSize: 1024 * 1024,
                                        onProgress: ({ percent }) =>
                                            setUploadPercent(percent),
                                    });
                                    nextPdf = url;
                                }
                                nextImages = [];
                            }

                            setUploadLabel("Saving chapter…");
                            setUploadPercent(100);

                            // Persist uploaded file URLs in form state so validation
                            // retries don't re-upload files that already finished.
                            setData((prev) => ({
                                ...prev,
                                images: nextImages,
                                pdf: nextPdf,
                            }));

                            form.transform(() => ({
                                ...data,
                                images: nextImages,
                                pdf: nextPdf,
                            }));

                            post(submitUrl, {
                                forceFormData: true,
                                onFinish: () => {
                                    form.transform((d) => d);
                                    setUploading(false);
                                    setUploadLabel("");
                                    setUploadPercent(0);
                                },
                            });
                        } catch (err) {
                            setUploading(false);
                            setUploadLabel("");
                            setUploadPercent(0);
                            setUploadError(
                                err?.response?.data?.message ??
                                    err?.message ??
                                    "Upload failed",
                            );
                        }
                    }}
                    className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/50 sm:p-6 lg:p-8"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:gap-x-10">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">
                                Cover Image
                            </h3>
                            <InputLabel
                                value="Chapter Thumbnail (optional)"
                                className="!text-zinc-400 !mb-2"
                            />
                            <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black/20 p-2 pb-6">
                                <ChunkUploader
                                    photos={data.thumbnail}
                                    onUpload={(file) =>
                                        setData("thumbnail", file)
                                    }
                                />
                                <InputError
                                    message={errors?.thumbnail}
                                    inline
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 mt-2 md:mt-4">
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">
                                Chapter Details
                            </h3>
                        </div>

                        <div className="min-w-0">
                            <Input
                                errorMessage={fieldError(
                                    errors,
                                    "chapter_number",
                                )}
                                label="Chapter Number"
                                value={data.chapter_number}
                                onChange={(e) =>
                                    setData("chapter_number", e.target.value)
                                }
                                placeholder="e.g. 1"
                            />
                        </div>
                        <div className="min-w-0">
                            <Input
                                errorMessage={fieldError(errors, "title")}
                                label="Title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Chapter Title"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 mt-2 md:mt-4">
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">
                                Chapter content
                            </h3>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        content_mode: "images",
                                        pdf: null,
                                    }))
                                }
                                className={`min-h-[44px] flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all sm:min-h-0 sm:flex-none sm:px-5 ${
                                    data.content_mode === "images"
                                        ? "border-primary bg-primary text-black"
                                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20"
                                }`}
                            >
                                Image pages
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        content_mode: "pdf",
                                        images: [],
                                    }))
                                }
                                className={`min-h-[44px] flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all sm:min-h-0 sm:flex-none sm:px-5 ${
                                    data.content_mode === "pdf"
                                        ? "border-primary bg-primary text-black"
                                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20"
                                }`}
                            >
                                Single PDF
                            </button>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <InputError
                                message={fieldError(errors, "content_mode")}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">
                                Season
                            </h3>
                            <p className="mb-3 text-xs text-zinc-500 sm:text-sm">
                                Search and sort, then tap a row to assign this
                                chapter to a season.
                            </p>
                            <SeasonListToolbar
                                search={search}
                                setSearch={setSearch}
                                searchInputRef={searchInputRef}
                                order={order}
                                applyOrder={applyOrder}
                                onClear={clearSeasonFilters}
                                hasActiveFilters={
                                    hasSeasonSearch || order !== "asc"
                                }
                            />
                            {showOffPageSelection && (
                                <div className="mb-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-zinc-200 sm:text-sm">
                                    {selectedSeasonSummary?.id ===
                                    data.season_id ? (
                                        <>
                                            <span className="font-bold text-primary">
                                                Selected:
                                            </span>{" "}
                                            {selectedSeasonSummary.title} (#
                                            {
                                                selectedSeasonSummary.season_number
                                            }
                                            ) — not on this page. Clear search
                                            or change pages to see it in the
                                            list.
                                        </>
                                    ) : (
                                        <>
                                            A season is selected but it does not
                                            appear in the list below — adjust
                                            search or pagination.
                                        </>
                                    )}
                                </div>
                            )}
                            {seasons?.total === 0 ? (
                                <p className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-zinc-500">
                                    {hasSeasonSearch || order !== "asc"
                                        ? "No seasons match your filters."
                                        : "No seasons exist for this manga yet. Create a season first."}
                                </p>
                            ) : (
                                <>
                                    {seasons?.total > 0 && (
                                        <p className="mb-2 text-center text-[11px] text-zinc-500 sm:text-left sm:text-xs">
                                            Showing{" "}
                                            <span className="font-semibold text-zinc-300">
                                                {seasons.from ?? 0}–
                                                {seasons.to ?? 0}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold text-zinc-300">
                                                {seasons.total}
                                            </span>
                                        </p>
                                    )}
                                    <div className="space-y-2 md:hidden">
                                        {seasonRows.map((season) => {
                                            const selected =
                                                data.season_id === season.id;
                                            return (
                                                <button
                                                    key={season.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "season_id",
                                                            season.id,
                                                        )
                                                    }
                                                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                                                        selected
                                                            ? "border-primary bg-primary/15 ring-1 ring-primary/40"
                                                            : "border-white/10 bg-[#141414] hover:border-white/20"
                                                    }`}
                                                >
                                                    <p className="font-bold text-white">
                                                        {season.title}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-zinc-500">
                                                        Season #
                                                        {season.season_number}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="hidden overflow-hidden rounded-xl border border-white/10 md:block">
                                        <table className="w-full text-left text-sm">
                                            <thead className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wide text-zinc-400">
                                                <tr>
                                                    <th className="px-4 py-3">
                                                        Title
                                                    </th>
                                                    <th className="px-4 py-3 w-28">
                                                        #
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {seasonRows.map((season) => {
                                                    const selected =
                                                        data.season_id ===
                                                        season.id;
                                                    return (
                                                        <tr
                                                            key={season.id}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() =>
                                                                setData(
                                                                    "season_id",
                                                                    season.id,
                                                                )
                                                            }
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                        "Enter" ||
                                                                    e.key ===
                                                                        " "
                                                                ) {
                                                                    e.preventDefault();
                                                                    setData(
                                                                        "season_id",
                                                                        season.id,
                                                                    );
                                                                }
                                                            }}
                                                            className={`cursor-pointer transition hover:bg-white/5 ${
                                                                selected
                                                                    ? "bg-primary/10"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <td className="px-4 py-3 font-medium text-white">
                                                                {season.title}
                                                            </td>
                                                            <td className="px-4 py-3 text-zinc-400">
                                                                #
                                                                {
                                                                    season.season_number
                                                                }
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <AdminPagination meta={seasons} />
                                </>
                            )}
                            <div className="mt-2">
                                <InputError
                                    message={fieldError(errors, "season_id")}
                                    inline
                                />
                            </div>
                        </div>

                        {data.content_mode === "images" && (
                            <div className="col-span-1 md:col-span-2 mt-2 md:mt-4">
                                <div className="mb-3 flex flex-col gap-1 border-b border-white/5 pb-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">
                                        Manga pages
                                    </h3>
                                    <span className="text-[11px] font-medium text-zinc-500 sm:text-xs">
                                        Drag and drop to reorder pages
                                    </span>
                                </div>

                                <div className="rounded-xl border border-white/5 bg-black/20 p-3 sm:p-4">
                                    <p className="mb-3 text-xs leading-relaxed text-zinc-400">
                                        Upload pages in reading order. You can
                                        rearrange them after uploading.
                                    </p>
                                    <InputError
                                        message={contentFileError}
                                        inline
                                        className="mb-2"
                                    />
                                    <ChunkUploader
                                        allowMultiple
                                        acceptedFileTypes={["image/*"]}
                                        photos={data.images}
                                        uploadMode="auto"
                                        chunkTarget="chapter-image"
                                        onUploadingChange={
                                            setActiveImageUploads
                                        }
                                        onUpload={(files) => {
                                            setData("images", files);
                                            setUploadError(null);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {data.content_mode === "pdf" && (
                            <div className="col-span-1 md:col-span-2 mt-2 space-y-3 md:mt-4">
                                <InputLabel
                                    value="PDF file"
                                    className="!text-zinc-400 !mb-2"
                                />
                                {chapter?.pdf_path && (
                                    <p className="text-xs text-zinc-500">
                                        Current file:{" "}
                                        <a
                                            href={chapter.pdf_path}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="break-all text-primary hover:underline"
                                        >
                                            {chapter.pdf_path}
                                        </a>
                                        . Upload a new file below to replace it.
                                    </p>
                                )}
                                <div className="rounded-xl border border-white/5 bg-black/20 p-2 pb-6">
                                    <ChunkUploader
                                        photos={data.pdf}
                                        onUpload={(file) =>
                                            setData("pdf", file)
                                        }
                                        allowMultiple={false}
                                        allowImagePreview={false}
                                        acceptedFileTypes={["application/pdf"]}
                                        maxFiles={1}
                                    />
                                </div>
                                <InputError message={contentFileError} inline />
                            </div>
                        )}

                        <div className="col-span-1 md:col-span-2">
                            <RichTextEditor
                                label="Description"
                                value={data.description}
                                onChange={(html) =>
                                    setData("description", html)
                                }
                                error={fieldError(errors, "description")}
                                placeholder="Chapter summary..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:mt-10 sm:flex-row sm:justify-end">
                        <Button
                            type={"submit"}
                            disabled={isChapterSubmitting}
                            text={
                                isChapterSubmitting
                                    ? uploadLabel || "Creating chapter..."
                                    : type === "edit"
                                      ? "Update Chapter"
                                      : "Create Chapter"
                            }
                            className="!w-full !rounded-xl !bg-primary !px-6 !py-3 !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!w-auto sm:!px-10"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChapterForm;
ChapterForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
