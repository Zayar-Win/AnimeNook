/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import Select from "@/Components/Select";
import AdminLayout from "@/Layouts/AdminLayout";
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
        <div>
            <div className="w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-6">
                    {type === "edit" ? "Edit" : "Create New"} User
                </h1>
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
                >
                    <div className="grid grid-cols-2 gap-x-10 gap-y-8 ">
                        <div className="col-span-2 flex justify-center">
                            <div className="w-28 h-28 relative">
                                <img
                                    className="w-28 h-28 rounded-full object-cover"
                                    src={
                                        profileImageUrl
                                            ? profileImageUrl
                                            : "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
                                    }
                                    alt=""
                                />
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "profile_picture",
                                            e.target.files[0]
                                        )
                                    }
                                    className="absolute top-0 opacity-0 left-0 w-full h-full"
                                />
                            </div>
                        </div>
                        <Input
                            label="Name"
                            errorMessage={errors?.name}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <Input
                            label="Email"
                            errorMessage={errors?.email}
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <Select
                            options={roleOptions}
                            label="Role"
                            errorMessage={errors?.role_id}
                            selected={data.role_id}
                            onChange={(role) => setData("role_id", role.value)}
                        />
                        <Select
                            label={"Type"}
                            options={typeOptions}
                            selected={data.type}
                            errorMessage={errors?.type}
                            onChange={(type) => setData("type", type.value)}
                        />
                        <Input
                            label="Password"
                            type="password"
                            vlaue={data.password}
                            errorMessage={errors?.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                    </div>
                    <Button
                        type={"submit"}
                        text={type === "edit" ? "Edit" : "Create"}
                        className={"!bg-blue-500 mt-8 !px-20"}
                    />
                </form>
            </div>
        </div>
    );
};

export default UserForm;

UserForm.layout = (page) => <AdminLayout>{page}</AdminLayout>;
