/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, useForm } from "@inertiajs/react";
import React, { useEffect } from "react";

const backBtnClass =
    "inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm";

const TagForm = ({ type, tag }) => {
    const { data, setData, post, errors } = useForm({
        name: "",
    });

    useEffect(() => {
        if (type === "edit" && tag) {
            setData((prev) => ({
                ...prev,
                name: tag.name ?? "",
            }));
        }
    }, [type, tag]);

    return (
        <div className="flex min-h-full flex-1 flex-col bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
                <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                            >
                                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                                <path d="M7 7h.01" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                                {type === "edit" ? "Edit tag" : "Create tag"}
                            </h1>
                            <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                                {type === "edit"
                                    ? "Rename this tag; it updates everywhere it is used."
                                    : "Add a label your group can attach to manga or posts."}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={window.route("group.admin.tags")}
                        className={backBtnClass}
                    >
                        ← Back to tags
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("group.admin.tags.update", {
                                      tag,
                                  })
                                : window.route("group.admin.tags.store"),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                    className="flex flex-col rounded-2xl border border-white/10 bg-[#141414] p-4 shadow-xl shadow-black/40 ring-1 ring-white/5 sm:p-6 lg:p-8"
                >
                    <div className="min-w-0">
                        <Input
                            label="Tag name"
                            errorMessage={errors?.name}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="e.g. Action, Romance, Ongoing"
                        />
                    </div>
                    <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
                        <Button
                            type="submit"
                            text={type === "edit" ? "Save changes" : "Create tag"}
                            className="!w-full !rounded-xl !bg-primary !px-6 !py-3 !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!w-auto sm:!px-10"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagForm;

TagForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
