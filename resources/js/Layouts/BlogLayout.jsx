import { Link } from "@inertiajs/react";
import { MenuIcon } from "lucide-react";
import React from "react";

const BlogLayout = ({ children }) => {
    return (
        <div>
            <div className="flex items-center border-b-[1px] shadow-md justify-between xl:px-16 md:px-[50px] px-[20px] py-4">
                <Link href="/">
                    <p className="text-3xl font-bold ">AnimeNook</p>
                </Link>
                <nav className="md:block hidden">
                    <ul className="flex  items-center gap-5 text-base font-semibold">
                        <li className="hover:underline transition-all">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="hover:underline transition-all">
                            <Link href="/about">About</Link>
                        </li>
                        <li className="hover:underline transition-all">
                            <Link href="/contact-us">Contact Us</Link>
                        </li>
                        <li className="hover:underline transition-all">
                            <Link href="/privacy-and-policy">
                                Privacy And Policy
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="md:hidden block cursor-pointer">
                    <MenuIcon />
                </div>
            </div>
            {children}
            <div className="bg-black/80 mt-[100px] py-10 xl:px-[100px] md:px-[50px] px-[20px]">
                <div className="grid text-white md:grid-cols-3 gap-5">
                    <div>
                        <h1 className="text-lg font-semibold">About us</h1>
                        <p className="mt-5 text-white/50">
                            Welcome to AnimeNook, your ultimate destination for
                            all things anime! We're passionate about bringing
                            you the latest news, reviews, and discussions about
                            your favorite anime series. Our community-driven
                            platform aims to create a welcoming space for anime
                            enthusiasts to connect, share, and explore the
                            wonderful world of Japanese animation.
                        </p>
                    </div>
                    <div className="w-full flex md:items-center flex-col">
                        <h1 className="text-lg font-semibold">Quick Menu</h1>
                        <ul className="flex mt-5 flex-col gap-3 text-white/50">
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/about">About</Link>
                            </li>
                            <li>
                                <Link href="/contact-us">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/privacy-and-policy">
                                    Privacy And Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">
                            Contact With Us
                        </h1>
                        <div className="flex items-center text-white/50 gap-4 mt-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
                                />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23"
                                />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogLayout;
