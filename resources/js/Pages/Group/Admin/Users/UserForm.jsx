/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import Select from "@/Components/Select";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const UserForm = ({ type, user }) => {
    const roleOptions = [
        { label: "User", value: 1 },
        { label: "Editor", value: 2 },
        { label: "Admin", value: 3 },
    ];
    const typeOptions = [
        { label: "Free", value: "free" },
        { label: "Paid", value: "paid" },
    ];
    const [profileImageUrl, setProfileImageUrl] = useState(
        user?.profile_picture
    );
    const { data, setData, post, errors } = useForm({
        name: "",
        email: "",
        profile_picture: null,
        role_id: 1,
        type: "free",
        password: "",
    });

    useEffect(() => {
        if (data.profile_picture && typeof data.profile_picture !== "string") {
            setProfileImageUrl(URL.createObjectURL(data.profile_picture));
        }
    }, [data.profile_picture]);

    useEffect(() => {
        if (type === "edit" && user) {
            setData((prev) => ({
                ...prev,
                name: user.name,
                email: user.email,
                profile_picture: user.profile_picture,
                role_id: user.role_id,
                type: user.type,
                password: user.password,
            }));
        }
    }, [type, user?.id, setData]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                            {type === "edit" ? "Edit user" : "Create user"}
                        </h1>
                        <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                            {type === "edit"
                                ? "Update profile, role, and account type."
                                : "Add a new member to this group."}
                        </p>
                    </div>
                    <Link
                        href={window.route("group.admin.users")}
                        className="shrink-0 self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:self-auto sm:px-4 sm:text-sm"
                    >
                        ← Back to list
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("group.admin.users.update", {
                                      user,
                                  })
                                : window.route("group.admin.users.store"),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                    className="rounded-xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/50 sm:rounded-2xl sm:p-6 lg:p-8"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:gap-x-10">
                        <div className="col-span-1 flex flex-col items-center md:col-span-2">
                            <div className="group relative cursor-pointer touch-manipulation">
                                <div className="h-28 w-28 overflow-hidden rounded-full shadow-2xl ring-4 ring-white/10 transition-all duration-300 group-hover:ring-primary group-active:ring-primary/80 sm:h-32 sm:w-32">
                                    <img
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        src={
                                            profileImageUrl
                                                ? profileImageUrl
                                                : "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
                                        }
                                        alt=""
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-100 transition-opacity duration-300 sm:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-7 w-7 text-white sm:h-8 sm:w-8"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            "profile_picture",
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    aria-label="Upload profile picture"
                                />
                            </div>
                            <p className="mt-2 text-center text-[11px] text-zinc-500 sm:hidden">
                                Tap image to change photo
                            </p>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-sm">
                                Basic information
                            </h3>
                        </div>

                        <Input
                            label="Name"
                            errorMessage={errors?.name}
                            value={data.name}
                            placeholder="Enter full name"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <Input
                            label="Email"
                            errorMessage={errors?.email}
                            value={data.email}
                            placeholder="name@example.com"
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <div className="col-span-1 mt-2 md:col-span-2 md:mt-4">
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-sm">
                                Account settings
                            </h3>
                        </div>

                        <Select
                            options={roleOptions}
                            label="Role"
                            errorMessage={errors?.role_id}
                            selected={data.role_id}
                            onChange={(role) => setData("role_id", role.value)}
                        />
                        <Select
                            label="Account type"
                            options={typeOptions}
                            selected={data.type}
                            errorMessage={errors?.type}
                            onChange={(accountType) =>
                                setData("type", accountType.value)
                            }
                        />

                        <div className="col-span-1 md:col-span-2">
                            <Input
                                label="Password"
                                type="password"
                                value={data.password}
                                placeholder={
                                    type === "edit"
                                        ? "Leave blank to keep current password"
                                        : "Enter secure password"
                                }
                                errorMessage={errors?.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:mt-10 sm:flex-row sm:justify-end sm:gap-4">
                        <Link
                            href={window.route("group.admin.users")}
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/15 text-sm font-bold text-zinc-300 transition hover:border-white/25 hover:bg-white/5 hover:text-white sm:h-auto sm:w-auto sm:px-6"
                        >
                            Cancel
                        </Link>
                        <Button
                            type="submit"
                            text={
                                type === "edit" ? "Update user" : "Create user"
                            }
                            className="!h-11 !w-full !rounded-xl !px-6 !py-3 !text-sm !font-bold !normal-case transition-all hover:-translate-y-0.5 sm:!h-auto sm:!w-auto sm:!px-10 !bg-primary hover:!bg-primary/90 shadow-lg shadow-primary/20"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;

UserForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
