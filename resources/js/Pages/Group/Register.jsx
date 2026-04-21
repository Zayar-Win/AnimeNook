import React from "react";
import Logo from "../../../assets/logo.png";
import Button from "@/Components/Button";
import { Link, useForm, usePage } from "@inertiajs/react";
import Google from "@/../assets/Google";
import GroupAuthLayout from "@/Layouts/GroupAuthLayout";

const Register = () => {
    const { data, setData, errors, post, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
    });
    const { group, APP_URL } = usePage().props;
    const handleSubmit = (e) => {
        e.preventDefault();
        post(window.route("group.register"));
    };
    return (
        <GroupAuthLayout>
            <div className="flex min-h-dvh w-full items-center justify-center bg-zinc-100 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 dark:bg-zinc-950">
                <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl sm:rounded-2xl dark:border-white/10 dark:bg-zinc-900 lg:min-h-[min(40rem,92vh)] lg:flex-row">
                    <div className="relative order-1 h-36 w-full shrink-0 sm:h-44 md:h-52 lg:order-2 lg:h-auto lg:min-h-[28rem] lg:w-[40%] lg:max-w-md xl:max-w-none">
                        <img
                            className="absolute inset-0 h-full w-full object-cover"
                            src="https://cdn.oneesports.gg/cdn-data/2023/06/Anime_OnePiece_Wallpaper_StrawHatPirates_Complete.jpg"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black/20" />
                    </div>

                    <div className="order-2 w-full flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:order-1 lg:flex lg:w-[60%] lg:flex-col lg:justify-center lg:px-10 lg:py-12">
                        <div className="mx-auto w-full max-w-md lg:max-w-lg">
                            <div className="mb-6 flex items-center gap-3 sm:mb-8">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
                                    <img
                                        src={Logo}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="border-l-4 border-l-yellow-400 py-2 pl-3 sm:pl-4">
                                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
                                    <h1 className="text-2xl font-medium text-primary sm:text-3xl">
                                        Konnichiwa!
                                    </h1>
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        My fellow Otaku!
                                    </span>
                                </div>
                                <p className="mt-2 max-w-xl text-sm font-medium text-zinc-700 sm:text-base dark:text-zinc-300">
                                    Heard you would like watching anime. Dive
                                    into the world of all animes and series.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 w-full sm:mt-10"
                            >
                                <div
                                    className={`relative ${
                                        errors.name ? "shake" : ""
                                    }`}
                                >
                                    <input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData("name", e.target.value);
                                            clearErrors();
                                        }}
                                        className="animate-input w-full border-0 border-b-2 border-b-yellow-400 bg-transparent pl-0 text-zinc-900 outline-none focus:border-yellow-400 focus:outline-none focus:ring-0 dark:text-white"
                                        type="text"
                                        name="name"
                                        autoComplete="name"
                                    />
                                    <label
                                        className={`animate-label absolute bottom-3 left-0 block text-sm font-medium text-zinc-600 transition-all dark:text-zinc-400 ${
                                            data.name !== "" ? "active" : ""
                                        }`}
                                        htmlFor="name"
                                    >
                                        Name
                                    </label>
                                    {errors.name && (
                                        <span className="absolute bottom-[-22px] left-0 text-sm font-medium text-red-500 dark:text-red-400">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`relative mt-8 sm:mt-10 ${
                                        errors.email ? "shake" : ""
                                    }`}
                                >
                                    <input
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => {
                                            setData("email", e.target.value);
                                            clearErrors();
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
                                <div
                                    className={`relative mt-8 sm:mt-10 ${
                                        errors.password ? "shake" : ""
                                    }`}
                                >
                                    <input
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => {
                                            setData(
                                                "password",
                                                e.target.value,
                                            );
                                            clearErrors();
                                        }}
                                        className="animate-input w-full border-0 border-b-2 border-b-yellow-400 bg-transparent pl-0 text-zinc-900 outline-none focus:border-yellow-400 focus:outline-none focus:ring-0 dark:text-white"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                    />
                                    <label
                                        className={`animate-label absolute bottom-3 left-0 block text-sm font-medium text-zinc-600 transition-all dark:text-zinc-400 ${
                                            data.password !== ""
                                                ? "active"
                                                : ""
                                        }`}
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    {errors.password && (
                                        <span className="absolute bottom-[-22px] left-0 text-sm font-medium text-red-500 dark:text-red-400">
                                            {errors.password}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    text={"Register"}
                                    type={"submit"}
                                    className={
                                        "mt-6 w-full bg-yellow-400 !px-8 py-3 text-center sm:mt-8 sm:w-auto sm:!px-20"
                                    }
                                />
                                <span className="mt-4 block text-center text-sm text-zinc-700 sm:text-left dark:text-zinc-300">
                                    You already have an account?{" "}
                                    <Link
                                        href={window.route("group.login")}
                                        className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Login
                                    </Link>{" "}
                                    here.
                                </span>
                                <a
                                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-primary px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 sm:text-base dark:text-white dark:hover:bg-white/10"
                                    href={`${APP_URL}/auth-google-redirect?subdomain=${group.subdomain}`}
                                >
                                    <Google />
                                    <span>Register With Google</span>
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GroupAuthLayout>
    );
};

export default Register;
