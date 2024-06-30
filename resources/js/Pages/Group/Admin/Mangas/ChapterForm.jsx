/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import FilePondUploader from "@/Components/FilePondUploader";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

const ChapterForm = ({ chapter, type, manga, seasons }) => {
    const { data, setData, post, errors } = useForm({
        thumbnail: chapter?.thumbnail ?? null,
        chapter_number: chapter?.chapter_number ?? "",
        title: chapter?.title ?? "",
        link: chapter?.chapter_link ?? "",
        description: chapter?.description ?? "",
        season_id: chapter?.season_id ?? null,
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
                {type === "edit" ? "Edit" : "Create New"} Chapter For{" "}
                {manga?.name}
            </h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    type === "edit"
                        ? post(
                              window.route(
                                  "group.admin.mangas.chapters.update",
                                  { manga, chapter }
                              )
                          )
                        : post(
                              window.route(
                                  "group.admin.mangas.chapters.store",
                                  { manga }
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

export default ChapterForm;
ChapterForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
