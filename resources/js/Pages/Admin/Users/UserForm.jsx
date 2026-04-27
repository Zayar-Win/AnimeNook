/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import ChunkUploader from "@/Components/ChunkUploader";
import Select from "@/Components/Select";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, usePage, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const UserForm = ({ type, user }) => {
    const { errors: pageErrors = {} } = usePage().props;
    const roleOptions = [
        {
            label: "User",
            value: 1,
        },
        {
            label: "Editor",
            value: 2,
        },
        {
            label: "Admin",
            value: 3,
        },
    ];
    const typeOptions = [
        {
            label: "Free",
            value: "free",
        },
        {
            label: "Paid",
            value: "paid",
        },
    ];
    const [profileImageUrl, setProfileImageUrl] = useState(user?.profile_picture);
    const { data, setData, post, errors } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        profile_picture: user?.profile_picture || null,
        role_id: user?.role_id || 1,
        type: user?.type || "free",
        password: user?.password || "",
    });
    useEffect(() => {
        if (data.profile_picture && typeof data.profile_picture !== "string") {
            setProfileImageUrl(URL.createObjectURL(data.profile_picture));
            return;
        }
        if (typeof data.profile_picture === "string") {
            setProfileImageUrl(data.profile_picture);
            return;
        }
        setProfileImageUrl(null);
    }, [data.profile_picture]);

    const mergedErrors = { ...pageErrors, ...errors };
    const submitLabel = type === "edit" ? "Save User" : "Create User";
    const profileFallback =
        "https://ui-avatars.com/api/?name=User&background=3f3f46&color=fafafa&size=512&bold=true";

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
                                fill="currentColor"
                                aria-hidden
                            >
                                <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5m0 2c-4.4 0-8 2-8 4.5V22h16v-3.5c0-2.5-3.6-4.5-8-4.5" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                                {type === "edit" ? "Edit User" : "Create User"}
                            </h1>
                            <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                                Manage account identity, role, and access type
                            </p>
                        </div>
                    </div>
                    <Link
                        href={window.route("admin.users")}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                    >
                        Back to users
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("admin.users.update", {
                                      user,
                                  })
                                : window.route("admin.users.store"),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                    className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/50 sm:p-6 lg:p-8"
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                        <div className="space-y-4 lg:col-span-1">
                            <p className="text-sm font-semibold text-zinc-300">
                                Profile Picture
                            </p>
                            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/10">
                                <img
                                    className="h-full w-full object-cover"
                                    src={profileImageUrl || profileFallback}
                                    alt=""
                                />
                            </div>
                            <ChunkUploader
                                photos={data.profile_picture}
                                onUpload={(file) => setData("profile_picture", file)}
                                acceptedFileTypes={["image/*"]}
                                allowImagePreview
                            />
                            {mergedErrors.profile_picture && (
                                <p className="text-xs text-red-400">
                                    {mergedErrors.profile_picture}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
                            <Input
                                label="Name"
                                errorMessage={mergedErrors?.name}
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <Input
                                label="Email"
                                errorMessage={mergedErrors?.email}
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <Select
                                options={roleOptions}
                                label="Role"
                                inputProps={{ autoComplete: "off" }}
                                errorMessage={mergedErrors?.role_id}
                                selected={data.role_id}
                                onChange={(role) =>
                                    setData("role_id", role.value)
                                }
                            />
                            <Select
                                label="Type"
                                options={typeOptions}
                                inputProps={{ autoComplete: "off" }}
                                selected={data.type}
                                errorMessage={mergedErrors?.type}
                                onChange={(typeItem) =>
                                    setData("type", typeItem.value)
                                }
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Password"
                                    type="password"
                                    value={data.password}
                                    errorMessage={mergedErrors?.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                            </div>
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

export default UserForm;

UserForm.layout = (page) => <AdminLayout>{page}</AdminLayout>;
