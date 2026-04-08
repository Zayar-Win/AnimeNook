import Button from "@/Components/Button";
import ToastLayout from "@/Layouts/ToastLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";
import Logo from "../../../assets/logo.png";

const ForgotPassword = () => {
    const { group } = usePage().props;
    const { data, setData, errors, clearErrors, post, processing } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(window.route("group.password.email", { group: group.subdomain }));
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
                                    Forgot password?
                                </h1>
                                <span className="text-sm font-medium">
                                    My fellow Otaku!
                                </span>
                            </div>
                            <p className="text-gray-700 font-medium w-[60%] pt-2">
                                Enter the email you used to register. We&apos;ll
                                send you a link to choose a new password.
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
                            <Button
                                text={
                                    processing
                                        ? "Sending…"
                                        : "Send reset link"
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
                            src="https://www.slashfilm.com/img/gallery/why-the-bleach-anime-ending-feels-so-anti-climactic/l-intro-1643214717.jpg"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </ToastLayout>
    );
};

export default ForgotPassword;
