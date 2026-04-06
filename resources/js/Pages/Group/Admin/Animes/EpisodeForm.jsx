/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import FilePondUploader from "@/Components/FilePondUploader";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

const EpisodeForm = ({ anime, episode, type, seasons }) => {
    const { data, setData, post, errors } = useForm({
        thumbnail: episode?.thumbnail ?? null,
        chapter_number: episode?.chapter_number ?? "",
        title: episode?.title ?? "",
        link: episode?.ouo_chapter_link ?? "",
        chapter_link: episode?.chapter_link ?? "",
        description: episode?.description ?? "",
        season_id: episode?.season_id ?? null,
    });

    const seasonOptions = seasons.map((season) => {
        return {
            label: season.title,
            value: season.id,
        };
    });

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
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                            {type === "edit" ? "Edit Episode" : "New Episode"}
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium mt-1">
                            {anime?.name}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        type === "edit"
                            ? post(
                                  window.route(
                                      "group.admin.animes.episodes.update",
                                      { anime, episode }
                                  )
                              )
                            : post(
                                  window.route(
                                      "group.admin.animes.episodes.store",
                                      { anime }
                                  )
                              );
                    }}
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 shadow-xl shadow-black/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Thumbnail Section */}
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Media Asset
                            </h3>
                            <InputLabel
                                value="Episode Thumbnail"
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
                                General Information
                            </h3>
                        </div>

                        <div>
                            <Input
                                errorMessage={errors?.chapter_number}
                                label="Episode Number"
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
                                placeholder="Episode Title"
                            />
                        </div>

                        {/* Links Section */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Sources & Links
                            </h3>
                        </div>

                        <div>
                            <Input
                                errorMessage={errors.link}
                                label="Standard Link"
                                value={data.link}
                                onChange={(e) =>
                                    setData("link", e.target.value)
                                }
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <Input
                                errorMessage={errors.chapter_link}
                                label="Premium Link"
                                value={data.chapter_link}
                                onChange={(e) =>
                                    setData("chapter_link", e.target.value)
                                }
                                placeholder="https://..."
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <Select
                                label="Season"
                                onChange={(option) =>
                                    setData("season_id", option.value)
                                }
                                selected={data.season_id}
                                options={seasonOptions}
                                isDisabled={!seasonOptions.length}
                                errorMessage={errors.season_id}
                            />
                            {!seasonOptions.length && (
                                <p className="text-xs text-yellow-500 mt-2">
                                    ⚠️ No seasons found. Please create a season
                                    first.
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="col-span-1 md:col-span-2">
                            <Input
                                textarea
                                value={data.description}
                                errorMessage={errors.description}
                                label="Description"
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Episode summary..."
                                className="!h-32"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-10 pt-6 border-t border-white/5">
                        <Button
                            type={"submit"}
                            text={
                                type === "edit"
                                    ? "Update Episode"
                                    : "Create Episode"
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

export default EpisodeForm;
EpisodeForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
