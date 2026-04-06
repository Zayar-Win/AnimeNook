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
        <div className="bg-[#0a0a0a] min-h-screen p-8 text-white flex items-center justify-center">
            <div className="w-full max-w-2xl">
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
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                            {season ? "Edit Season" : "Create Season"}
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium mt-1">
                            For {serie.name}
                        </p>
                    </div>
                </div>

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
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 shadow-xl shadow-black/50"
                >
                    <div className="space-y-6">
                        <div>
                            <Input
                                label="Season Title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                errorMessage={errors.title}
                                placeholder="e.g. Season 1: The Beginning"
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
                                placeholder="e.g. 1"
                                type="number"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-8 pt-6 border-t border-white/5">
                        <Button
                            text={season ? "Update Season" : "Create Season"}
                            className={
                                "!bg-primary hover:!bg-primary/90 !px-10 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
                            }
                            type={"submit"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
SeasonForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
export default SeasonForm;
