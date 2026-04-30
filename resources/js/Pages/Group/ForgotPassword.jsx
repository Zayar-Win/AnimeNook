import Button from "@/Components/Button";
import GroupAuthLayout from "@/Layouts/GroupAuthLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import React from "react";
import LogoImg from "../../../assets/logo.png";

const ForgotPassword = () => {
    const { group } = usePage().props;
    const groupLogo =
        group?.group_setting?.logo || group?.groupSetting?.logo || group?.logo || LogoImg;
    const { data, setData, errors, clearErrors, post, processing } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(window.route("group.password.email", { group: group.subdomain }));
    };

    return (
        <GroupAuthLayout>
            <div className="flex min-h-dvh w-full items-center justify-center bg-zinc-100 px-4 py-8 dark:bg-zinc-950">
                <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900 lg:flex-row lg:rounded-2xl">
                    <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 sm:py-10 lg:w-[58%] lg:justify-center lg:py-12">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-6 h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:mb-8 sm:h-20 sm:w-20">
                                <img
                                    src={groupLogo}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="rounded-md border-l-4 border-l-yellow-400 py-2 pl-3 sm:pl-4">
                                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
                                    <h1 className="text-2xl font-medium text-primary sm:text-3xl">
                                        Forgot password?
                                    </h1>
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        My fellow Otaku!
                                    </span>
                                </div>
                                <p className="pt-2 text-sm font-medium text-zinc-700 sm:text-base dark:text-zinc-300">
                                    Enter the email you used to register.
                                    We&apos;ll send you a link to choose a new
                                    password.
                                </p>
                            </div>
                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 w-full sm:mt-10"
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
                                        className="animate-input w-full border-0 border-b-2 border-b-yellow-400 bg-transparent pl-0 text-zinc-900 outline-none focus:border-yellow-400 focus:outline-none focus:ring-0 dark:text-white"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                    />
                                    <label
                                        className={`animate-label absolute bottom-3 left-0 block text-sm font-medium text-zinc-600 transition-all dark:text-zinc-400 ${
                                            data.email !== "" ? "active" : ""
                                        }`}
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    {errors.email && (
                                        <span className="absolute bottom-[-22px] left-0 text-sm font-medium text-red-500 dark:text-red-400">
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
                                    className="my-8 inline-block bg-yellow-400 !px-12 sm:!px-20"
                                />
                                <span className="block text-sm text-zinc-700 dark:text-zinc-300">
                                    <Link
                                        href={window.route("group.login", {
                                            group: group.subdomain,
                                        })}
                                        className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Back to login
                                    </Link>
                                </span>
                            </form>
                        </div>
                    </div>
                    <div className="relative order-first h-40 w-full shrink-0 sm:h-48 lg:order-none lg:h-auto lg:min-h-[22rem] lg:w-[42%]">
                        <img
                            className="h-full w-full object-cover lg:absolute lg:inset-0 lg:min-h-full"
                            src="https://www.slashfilm.com/img/gallery/why-the-bleach-anime-ending-feels-so-anti-climactic/l-intro-1643214717.jpg"
                            alt=""
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black/25" />
                    </div>
                </div>
            </div>
        </GroupAuthLayout>
    );
};

export default ForgotPassword;
