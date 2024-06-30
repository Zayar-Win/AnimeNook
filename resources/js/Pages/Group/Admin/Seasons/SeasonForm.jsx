import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

const SeasonForm = ({ serie, type, season }) => {
    const { data, setData, errors, post } = useForm({
        title: season ? season.title : "",
        season_number: season ? season.season_number : "",
        type: type,
        serie,
    });
    return (
        <div className="w-[50%] mx-auto">
            <h1 className="text-xl font-semibold mt-10 mb-8">
                Create A New Season For {serie.name}
            </h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    season
                        ? post(
                              window.route("group.admin.seasons.update", {
                                  season,
                              })
                          )
                        : post(window.route("group.admin.seasons.store"));
                }}
            >
                <div className="grid gap-5">
                    <div>
                        <Input
                            label="Title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            errorMessage={errors.title}
                        />
                    </div>
                    <div>
                        <Input
                            label="Season Number"
                            value={data.season_number}
                            onChange={(e) =>
                                setData("season_number", e.target.value)
                            }
                            errorMessage={errors.season_number}
                        />
                    </div>
                </div>
                <div>
                    <Button
                        text={season ? "Update" : "Create"}
                        className={"!bg-blue-500 !inline-block my-8 !px-20"}
                        type={"submit"}
                    />
                </div>
            </form>
        </div>
    );
};
SeasonForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
export default SeasonForm;
