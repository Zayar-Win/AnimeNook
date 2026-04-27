import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import ChunkUploader from "@/Components/ChunkUploader";
import InputError from "@/Components/InputError";
import Select from "@/Components/Select";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import moment from "moment";
import React, { useEffect, useState } from "react";

const GroupForm = ({ group, type, plans }) => {
    const planOptions = plans.map((plan) => ({
        label: plan.name,
        value: plan.id,
    }));
    const [logoUrl, setLogoUrl] = useState(group?.logo || null);

    const { data, setData, post, errors } = useForm({
        name: group?.name || "",
        subdomain: group?.subdomain || "",
        logo: group?.logo || null,
        plan_id: group?.plan_id || "",
        start_date: moment(group?.start_date).format("YYYY-MM-DDTHH:mm") || "",
        expire_date:
            moment(group?.expire_date).format("YYYY-MM-DDTHH:mm") || "",
    });

    useEffect(() => {
        if (data.logo && typeof data.logo !== "string") {
            setLogoUrl(URL.createObjectURL(data.logo));
            return;
        }
        if (typeof data.logo === "string") {
            setLogoUrl(data.logo);
            return;
        }
        setLogoUrl(null);
    }, [data.logo]);

    const logoFallback =
        "https://ui-avatars.com/api/?name=Group&background=27272a&color=fafafa&size=512&bold=true";
    const submitLabel = type === "edit" ? "Save Group" : "Create Group";

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
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
                                aria-hidden
                            >
                                <path d="M3 21h18" />
                                <path d="M5 21V7l8-4v18" />
                                <path d="M19 21V11l-6-4" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                                {type === "edit"
                                    ? "Edit Group"
                                    : "Create Group"}
                            </h1>
                            <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                                Set branding, domain, plan, and subscription
                                dates
                            </p>
                        </div>
                    </div>
                    <Link
                        href={window.route("admin.groups")}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                    >
                        Back to groups
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("admin.groups.update", { group })
                                : window.route("admin.groups.store"),
                            {
                                preserveScroll: true,
                            },
                        );
                    }}
                    className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/50 sm:p-6 lg:p-8"
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                        <div className="space-y-4 lg:col-span-1">
                            <p className="text-sm font-semibold text-zinc-300">
                                Group Logo
                            </p>
                            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/10">
                                <img
                                    className="h-full w-full object-cover"
                                    src={logoUrl || logoFallback}
                                    alt=""
                                />
                            </div>
                            <ChunkUploader
                                photos={data.logo}
                                onUpload={(file) => setData("logo", file)}
                                acceptedFileTypes={["image/*"]}
                                allowImagePreview
                            />
                            <InputError message={errors?.logo} />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
                            <Input
                                label="Name"
                                errorMessage={errors?.name}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <Input
                                label="Subdomain"
                                errorMessage={errors?.subdomain}
                                value={data.subdomain}
                                onChange={(e) =>
                                    setData("subdomain", e.target.value)
                                }
                            />
                            <Select
                                options={planOptions}
                                label="Plan"
                                inputProps={{ autoComplete: "off" }}
                                errorMessage={errors?.plan_id}
                                selected={data.plan_id}
                                onChange={(plan) =>
                                    setData("plan_id", plan.value)
                                }
                            />
                            <Input
                                type="datetime-local"
                                label="Start Date"
                                errorMessage={errors?.start_date}
                                value={data.start_date || ""}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                            />
                            <Input
                                type="datetime-local"
                                label="Expire Date"
                                errorMessage={errors?.expire_date}
                                value={data.expire_date || ""}
                                onChange={(e) =>
                                    setData("expire_date", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-white/5 pt-6">
                        <Button
                            type="submit"
                            text={submitLabel}
                            className="!rounded-xl !bg-primary !px-8 !py-3 !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

GroupForm.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default GroupForm;
