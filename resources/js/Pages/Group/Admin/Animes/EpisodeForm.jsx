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
        <div className="w-[90%] mx-auto mb-10">
            <h1 className="text-xl font-semibold my-6">
                {type === "edit" ? "Edit" : "Create New"} Episode For{" "}
                {anime?.name}
            </h1>
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
            >
                <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                    <div className="col-span-2">
                        <InputLabel value="Episode Thumbnail" />
                        <FilePondUploader
                            photos={data.thumbnail}
                            onUpload={(file) => setData("thumbnail", file)}
                        />
                    </div>
                    <div>
                        <Input
                            errorMessage={errors?.chapter_number}
                            label="Chapter Number"
                            value={data.chapter_number}
                            onChange={(e) =>
                                setData("chapter_number", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <Input
                            errorMessage={errors.title}
                            label="Title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            errorMessage={errors.link}
                            label="Episode Link"
                            value={data.link}
                            onChange={(e) => setData("link", e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            errorMessage={errors.link}
                            label="Preminum Episode Link"
                            value={data.chapter_link}
                            onChange={(e) =>
                                setData("chapter_link", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <InputLabel value="Season" />
                        <Select
                            onChange={(option) =>
                                setData("season_id", option.value)
                            }
                            selected={data.season_id}
                            options={seasonOptions}
                            isDisabled={!seasonOptions.length}
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            textarea
                            value={data.description}
                            errorMessage={errors.description}
                            label="Description"
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                    </div>
                </div>
                <Button
                    type={"submit"}
                    text={type === "edit" ? "Edit" : "Create"}
                    className={"!bg-blue-500 mt-8 !px-20"}
                />
            </form>
        </div>
    );
};

export default EpisodeForm;
EpisodeForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
