/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import FilePondUploader from "@/Components/FilePondUploader";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

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

const ChapterForm = ({ chapter, type, manga, seasons, images }) => {
    const { data, setData, post, errors } = useForm({
        thumbnail: chapter?.thumbnail ?? null,
        chapter_number: chapter?.chapter_number ?? "",
        title: chapter?.title ?? "",
        description: chapter?.description ?? "",
        season_id: chapter?.season_id ?? null,
        content_mode: chapter?.pdf_path ? "pdf" : "images",
        pdf: null,
        images: images ?? [],
    });

    const seasonOptions = seasons.map((season) => {
        return {
            label: season.title,
            value: season.id,
        };
    });

    const imagesError = firstImagesRelatedError(errors);
    const contentFileError =
        imagesError ?? fieldError(errors, "pdf");

    return (
        <div className="bg-[#0a0a0a] min-h-screen p-8 text-white flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(237,100,0,0.15)]">
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
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                            {type === "edit" ? "Edit Chapter" : "New Chapter"}
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium mt-1">
                            {manga?.name}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        type === "edit"
                            ? post(
                                  window.route(
                                      "group.admin.mangas.chapters.update",
                                      { manga, chapter },
                                  ),
                              )
                            : post(
                                  window.route(
                                      "group.admin.mangas.chapters.store",
                                      { manga },
                                  ),
                              );
                    }}
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 shadow-xl shadow-black/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Thumbnail Section */}
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Cover Image
                            </h3>
                            <InputLabel
                                value="Chapter Thumbnail (optional)"
                                className="!text-zinc-400 !mb-2"
                            />
                            <div className="relative bg-black/20 rounded-xl p-2 border border-white/5 pb-6">
                                <FilePondUploader
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

                        {/* General Info */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Chapter Details
                            </h3>
                        </div>

                        <div>
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
                        <div>
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

                        {/* Links & Association */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Chapter content
                            </h3>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        content_mode: "images",
                                        pdf: null,
                                    }))
                                }
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                    data.content_mode === "images"
                                        ? "bg-primary text-black border-primary"
                                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
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
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                    data.content_mode === "pdf"
                                        ? "bg-primary text-black border-primary"
                                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                                }`}
                            >
                                Single PDF
                            </button>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <InputError
                                message={fieldError(errors, "content_mode")}
                                inline
                            />
                        </div>

                        {seasonOptions.length > 0 && (
                            <div>
                                <Select
                                    label="Season"
                                    onChange={(option) =>
                                        setData("season_id", option.value)
                                    }
                                    selected={data.season_id}
                                    options={seasonOptions}
                                    isDisabled={!seasonOptions.length}
                                    errorMessage={fieldError(
                                        errors,
                                        "season_id",
                                    )}
                                />
                            </div>
                        )}

                        {data.content_mode === "images" && (
                            <div className="col-span-1 md:col-span-2 mt-4">
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                                        Manga pages
                                    </h3>
                                    <span className="text-xs text-zinc-500 font-medium">
                                        Drag and drop to reorder pages
                                    </span>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                    <div className="mb-3 flex items-center gap-2 text-zinc-400 text-xs">
                                        <span>
                                            Upload pages in reading order. You
                                            can rearrange them after uploading.
                                        </span>
                                    </div>
                                    <InputError
                                        message={contentFileError}
                                        inline
                                        className="mb-2"
                                    />
                                    <FilePondUploader
                                        allowMultiple
                                        photos={data.images}
                                        onUpload={(files) =>
                                            setData("images", files)
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {data.content_mode === "pdf" && (
                            <div className="col-span-1 md:col-span-2 mt-4 space-y-3">
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
                                            className="text-primary hover:underline break-all"
                                        >
                                            {chapter.pdf_path}
                                        </a>
                                        . Upload a new file below to replace
                                        it.
                                    </p>
                                )}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black"
                                    onChange={(e) =>
                                        setData(
                                            "pdf",
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                <InputError
                                    message={contentFileError}
                                    inline
                                />
                            </div>
                        )}

                        <div className="col-span-1 md:col-span-2">
                            <Input
                                textarea
                                value={data.description}
                                errorMessage={fieldError(
                                    errors,
                                    "description",
                                )}
                                label="Description"
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Chapter summary..."
                                className="!h-32"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-10 pt-6 border-t border-white/5">
                        <Button
                            type={"submit"}
                            text={
                                type === "edit"
                                    ? "Update Chapter"
                                    : "Create Chapter"
                            }
                            className={
                                "!bg-primary hover:!bg-primary/90 !px-10 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
                            }
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChapterForm;
ChapterForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
