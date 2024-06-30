import { Link, useForm } from "@inertiajs/react";
import React from "react";
import Logo from "../../../assets/logo.png";
import Button from "@/Components/Button";
import Google from "@/../assets/Google";
import { usePage } from "@inertiajs/react";

const Login = () => {
    const { data, setData, errors, clearErrors, post } = useForm({
        email: "",
        password: "",
    });
    const { group, APP_URL } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(window.route("group.login"));
    };
    return (
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
                                Konnichiwa!
                            </h1>
                            <span className="text-sm font-medium">
                                My fellow Otaku!
                            </span>
                        </div>
                        <p className="text-gray-700 font-medium w-[60%] pt-2">
                            Welcome back from the world of animes and movies
                            Guy.Just Watch and Chill.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-10 w-[70%]">
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
                                className="w-full pl-0 animate-input outline-none  focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400"
                                type="text"
                                name="name"
                            />
                            <label
                                className={`absolute transition-all ${
                                    data.email !== "" ? "active" : ""
                                } animate-label block bottom-3 left-0 text-sm font-medium text-gray-600`}
                                htmlFor="name"
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
                            className={`relative ${
                                errors.password ? "shake" : ""
                            } mt-8`}
                        >
                            <input
                                id="password"
                                value={data.password}
                                onChange={(e) => {
                                    clearErrors();
                                    setData("password", e.target.value);
                                }}
                                className="w-full pl-0 animate-input outline-none  focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400"
                                type="password"
                                name="password"
                            />
                            <label
                                className={`absolute transition-all ${
                                    data.password !== "" ? "active" : ""
                                } animate-label block bottom-3 left-0 text-sm font-medium text-gray-600`}
                                htmlFor="password"
                            >
                                Password
                            </label>
                            {errors.password && (
                                <span className="absolute left-0 text-sm font-medium bottom-[-22px] text-red-500">
                                    {errors.password}
                                </span>
                            )}
                        </div>
                        <Button
                            text={"Login"}
                            type={"submit"}
                            className={"bg-yellow-400 my-8 !px-20 inline-block"}
                        />
                        <span className="block  text-sm text-gray-700">
                            You don't have an account?{" "}
                            <Link
                                href={window.route("group.register")}
                                className="text-blue-500 hover:underline font-semibold"
                            >
                                Register
                            </Link>{" "}
                            here.
                        </span>
                        <a
                            className="cursor-pointer flex items-center gap-3 justify-center flex-grow-0 text-black px-4 py-2 border-2 border-primary mt-4 rounded-lg font-semibold"
                            href={`${APP_URL}/auth-google-redirect?subdomain=${group.subdomain}`}
                        >
                            <Google />
                            <p>Login With Google</p>
                        </a>
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
    );
};

export default Login;
