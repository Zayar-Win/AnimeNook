import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import SectionContainer from "@/Components/SectionContainer";
import UserLayout from "@/Layouts/UserLayout";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import moment from "moment";

const Profile = () => {
    const {
        auth: { user },
    } = usePage().props;
    const [profileLink, setProfileLink] = useState(user.profile_picture);
    const { data, setData, errors, post } = useForm({
        profile_picture: user.profile_picture,
        name: user.name,
        email: user.email,
    });

    useEffect(() => {
        if (data.profile_picture && typeof data.profile_picture !== "string") {
            const link = URL.createObjectURL(data.profile_picture);
            setProfileLink(link);
        }
    }, [data.profile_picture]);

    return (
        <SectionContainer className={"bg-[#0D0D0D]"}>
            <div className="flex gap-3">
                <div className="basis-[25%] flex flex-col items-center rounded-xl p-8 pt-12  bg-[#1C1C1C]">
                    <div className="w-[80%] aspect-square relative">
                        <div className="absolute rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 top-0 bg-[rgba(0,0,0,0.4)] left-0 bottom-0 right-0">
                            <input
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        "profile_picture",
                                        e.target.files[0]
                                    )
                                }
                                className="absolute cursor-pointer top-0 left-0 bottom-0 right-0 opacity-0"
                            />
                            <p className="font-bold text-white">
                                Change Profile
                            </p>
                        </div>
                        <img
                            src={profileLink}
                            className="w-full object-cover rounded-full border-4 border-primary h-full"
                            alt="User Profile"
                        />
                    </div>
                    <h1 className="text-xl font-bold text-white pt-4">
                        {user.name}
                    </h1>
                    <div className="w-full mt-4">
                        <div className="flex items-center text-sm text-gray-300 justify-between w-full">
                            <p>Join Date</p>
                            <p>
                                {moment(user.created_at).format("MMM DD, YYYY")}
                            </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-300 justify-between w-full mt-2">
                            <p>Watch List</p>
                            <p>0</p>
                        </div>
                    </div>
                </div>
                <div className="basis-[75%] rounded-xl p-5 bg-[#1C1C1C]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post(window.route("group.users.profile.update"), {
                                preserveScroll: true,
                            });
                        }}
                        className="w-[60%] flex flex-col gap-y-7 text-gray-300"
                    >
                        <div>
                            <Input
                                readOnly
                                labelClassName="!text-gray-300 !basis-[40%] mb-0"
                                direction="row"
                                value={moment(user.created_at).format(
                                    "MMM DD, YYYY"
                                )}
                                inputContainerClassName="!basis-[60%]"
                                className="bg-transparent !py-2 !text-gray-300"
                                label="Join Date"
                            />
                        </div>
                        <div>
                            <Input
                                direction="row"
                                labelClassName="!text-gray-300 !basis-[40%] mb-0"
                                inputContainerClassName="!basis-[60%]"
                                className="bg-transparent !py-2 !text-gray-300"
                                label="Email Address"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                errorMessage={errors.email}
                            />
                        </div>
                        <div>
                            <Input
                                direction="row"
                                labelClassName="!text-gray-300 !basis-[40%] mb-0"
                                inputContainerClassName="!basis-[60%]"
                                className="bg-transparent !py-2 !text-gray-300"
                                label="Username"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                errorMessage={errors.name}
                            />
                        </div>
                        <div className="flex items-center">
                            <p className="basis-[40%] text-sm font-semibold">
                                Type
                            </p>
                            <p className="px-8 py-2 font-bold bg-primary text-white rounded-[100px]">
                                {user.type}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <p className="basis-[40%] text-sm font-semibold">
                                Role
                            </p>
                            <p className="px-8 py-2 font-bold bg-primary text-white rounded-[100px]">
                                {user.role.name}
                            </p>
                        </div>
                        <Button
                            type="submit"
                            text="Update"
                            className={"!bg-primary w-[50%] mt-7"}
                        />
                    </form>
                </div>
            </div>
        </SectionContainer>
    );
};

export default Profile;

Profile.layout = (page) => <UserLayout>{page}</UserLayout>;
