/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import FilePondUploader from "@/Components/FilePondUploader";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

const ChapterForm = ({ chapter, type, manga, seasons, images }) => {
    const { data, setData, post, errors } = useForm({
        thumbnail: chapter?.thumbnail ?? null,
        chapter_number: chapter?.chapter_number ?? "",
        title: chapter?.title ?? "",
        link: chapter?.ouo_chapter_link ?? "",
        chapter_link: chapter?.chapter_link ?? "",
        description: chapter?.description ?? "",
        season_id: chapter?.season_id ?? null,
        images: images ?? [],
    });

    const seasonOptions = seasons.map((season) => {
        return {
            label: season.title,
            value: season.id,
        };
    });

    console.log(images);

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
                                value="Chapter Thumbnail"
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
                        </div>

                        {/* General Info */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Chapter Details
                            </h3>
                        </div>

                        <div>
                            <Input
                                errorMessage={errors?.chapter_number}
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
                                errorMessage={errors.title}
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
                                Additional Info
                            </h3>
                        </div>

                        <div>
                            <Input
                                errorMessage={errors.link}
                                label="Chapter Link"
                                value={data.link}
                                onChange={(e) =>
                                    setData("link", e.target.value)
                                }
                                placeholder="https://..."
                            />
                        </div>
                        {/* <div>
                            <Input
                                errorMessage={errors.link}
                                label="Preminum Episode Link"
                                value={data.chapter_link}
                                onChange={(e) =>
                                    setData("chapter_link", e.target.value)
                                }
                            />
                        </div> */}
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
                                />
                            </div>
                        )}

                        {/* Manga Images */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                                    Manga Pages
                                </h3>
                                <span className="text-xs text-zinc-500 font-medium">
                                    Drag and drop to reorder pages
                                </span>
                            </div>

                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <div className="mb-3 flex items-center gap-2 text-zinc-400 text-xs">
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
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line
                                            x1="16"
                                            y1="13"
                                            x2="8"
                                            y2="13"
                                        ></line>
                                        <line
                                            x1="16"
                                            y1="17"
                                            x2="8"
                                            y2="17"
                                        ></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    <span>
                                        Upload pages in reading order. You can
                                        rearrange them after uploading.
                                    </span>
                                </div>
                                <FilePondUploader
                                    allowMultiple
                                    photos={data.images}
                                    onUpload={(files) =>
                                        setData("images", files)
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <Input
                                textarea
                                value={data.description}
                                errorMessage={errors.description}
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
