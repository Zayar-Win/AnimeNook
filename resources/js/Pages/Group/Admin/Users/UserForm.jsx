/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import Select from "@/Components/Select";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const UserForm = ({ type, user }) => {
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
        if (type === "edit") {
            setData((data) => {
                return {
                    ...data,
                    name: user.name,
                    email: user.email,
                    profile_picture: user.profile_picture,
                    role_id: user.role_id,
                    type: user.type,
                    password: user.password,
                };
            });
        }
    }, [type]);

    return (
        <div className="bg-[#0a0a0a] min-h-screen p-8 text-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        {type === "edit" ? "Edit" : "Create New"} User
                    </h1>
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
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 shadow-xl shadow-black/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="col-span-1 md:col-span-2 flex justify-center mb-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/10 group-hover:ring-primary transition-all duration-300 shadow-2xl">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={
                                            profileImageUrl
                                                ? profileImageUrl
                                                : "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
                                        }
                                        alt="Profile Preview"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-8 h-8 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
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
                                    onChange={(e) =>
                                        setData(
                                            "profile_picture",
                                            e.target.files[0]
                                        )
                                    }
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Basic Information
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

                        <div className="col-span-1 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Account Settings
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
                            label={"Account Type"}
                            options={typeOptions}
                            selected={data.type}
                            errorMessage={errors?.type}
                            onChange={(type) => setData("type", type.value)}
                        />

                        <div className="col-span-1 md:col-span-2">
                            <Input
                                label="Password"
                                type="password"
                                vlaue={data.password}
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

                    <div className="flex justify-end mt-10 pt-6 border-t border-white/5">
                        <Button
                            type={"submit"}
                            text={
                                type === "edit" ? "Update User" : "Create User"
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

export default UserForm;

UserForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
