import Button from "@/Components/Button";
import ToastLayout from "@/Layouts/ToastLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";
import Logo from "../../../assets/logo.png";

const ResetPassword = ({ token, email: emailProp }) => {
    const { group } = usePage().props;
    const { data, setData, errors, clearErrors, post, processing } = useForm({
        token: token ?? "",
        email: emailProp ?? "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(window.route("group.password.store", { group: group.subdomain }));
    };

    return (
        <ToastLayout>
            <div className="w-full h-[100vh] flex items-center justify-center bg-[#0D0D0D]">
                <div className="w-[80%] flex rounded-lg p-10 gap-8 bg-white">
                    <div className="basis-[60%]">
                        <div className="w-32 h-32">
                            <img
                                src={Logo}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="border-l-4 border-l-yellow-400 rounded-md py-3 pl-4">
                            <div className="flex items-baseline gap-3">
                                <h1 className="text-3xl font-medium text-primary">
                                    Set new password
                                </h1>
                                <span className="text-sm font-medium">
                                    My fellow Otaku!
                                </span>
                            </div>
                            <p className="text-gray-700 font-medium w-[60%] pt-2">
                                Choose a new password for your account (6–30
                                characters).
                            </p>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="mt-10 w-[70%]"
                        >
                            <div
                                className={`relative ${
                                    errors.email ? "shake" : ""
                                }`}
                            >
                                <input
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => {
                                        clearErrors();
                                        setData("email", e.target.value);
                                    }}
                                    className="w-full pl-0 animate-input outline-none focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                />
                                <label
                                    className={`absolute transition-all ${
                                        data.email !== "" ? "active" : ""
                                    } animate-label block bottom-3 left-0 text-sm font-medium text-gray-600`}
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                {errors.email && (
                                    <span className="absolute left-0 text-sm font-medium bottom-[-22px] text-red-500">
                                        {errors.email}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`relative mt-8 ${
                                    errors.password ? "shake" : ""
                                }`}
                            >
                                <input
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => {
                                        clearErrors();
                                        setData("password", e.target.value);
                                    }}
                                    className="w-full pl-0 animate-input outline-none focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                />
                                <label
                                    className={`absolute transition-all ${
                                        data.password !== "" ? "active" : ""
                                    } animate-label block bottom-3 left-0 text-sm font-medium text-gray-600`}
                                    htmlFor="password"
                                >
                                    New password
                                </label>
                                {errors.password && (
                                    <span className="absolute left-0 text-sm font-medium bottom-[-22px] text-red-500">
                                        {errors.password}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`relative mt-8 ${
                                    errors.password_confirmation ? "shake" : ""
                                }`}
                            >
                                <input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => {
                                        clearErrors();
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        );
                                    }}
                                    className="w-full pl-0 animate-input outline-none focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                />
                                <label
                                    className={`absolute transition-all ${
                                        data.password_confirmation !== ""
                                            ? "active"
                                            : ""
                                    } animate-label block bottom-3 left-0 text-sm font-medium text-gray-600`}
                                    htmlFor="password_confirmation"
                                >
                                    Confirm password
                                </label>
                                {errors.password_confirmation && (
                                    <span className="absolute left-0 text-sm font-medium bottom-[-22px] text-red-500">
                                        {errors.password_confirmation}
                                    </span>
                                )}
                            </div>
                            <Button
                                text={
                                    processing ? "Updating…" : "Reset password"
                                }
                                type="submit"
                                className="bg-yellow-400 my-8 !px-20 inline-block"
                            />
                            <span className="block text-sm text-gray-700">
                                <Link
                                    href={window.route("group.login", {
                                        group: group.subdomain,
                                    })}
                                    className="text-blue-500 hover:underline font-semibold"
                                >
                                    Back to login
                                </Link>
                            </span>
                        </form>
                    </div>
                    <div className="basis-[40%]">
                        <img
                            className="w-full h-full object-cover"
                            src="https://cdn.oneesports.gg/cdn-data/2023/06/Anime_OnePiece_Wallpaper_StrawHatPirates_Complete.jpg"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </ToastLayout>
    );
};

export default ResetPassword;
