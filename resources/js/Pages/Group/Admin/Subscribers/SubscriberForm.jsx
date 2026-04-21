import Button from "@/Components/Button";
import Input from "@/Components/Admin/Input";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, useForm } from "@inertiajs/react";
import React from "react";

const SubscriberForm = ({ subscriber }) => {
    const { post, data, setData, errors } = useForm({
        email: subscriber?.email ?? "",
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mx-auto min-w-0 max-w-xl">
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
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                                Edit subscriber
                            </h1>
                            <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                                Update the newsletter email for this group
                            </p>
                        </div>
                    </div>
                    <Link
                        href={window.route("group.admin.subscribers")}
                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                    >
                        Back to list
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            window.route("group.admin.subscribers.update", {
                                subscriber,
                            }),
                            { preserveScroll: true }
                        );
                    }}
                    className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/50 sm:p-6 lg:p-8"
                >
                    <div className="min-w-0">
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            label="Email"
                            errorMessage={errors.email}
                            placeholder="newsletter@example.com"
                        />
                    </div>
                    <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
                        <Button
                            type="submit"
                            text="Save changes"
                            className="!w-full !rounded-xl !bg-primary !px-6 !py-3 !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!w-auto sm:!px-10"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubscriberForm;

SubscriberForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
