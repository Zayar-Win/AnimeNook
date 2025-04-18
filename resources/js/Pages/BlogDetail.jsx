import { Link } from "@inertiajs/react";
import React from "react";

const BlogDetail = () => {
    return (
        <div>
            <div className="flex items-center border-b-[1px] shadow-md justify-between px-16 py-4">
                <p className="text-3xl font-bold ">AnimeNook</p>
                <nav>
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
            </div>
            <div className="flex gap-10 mx-[100px] mt-[100px]">
                <div className="w-[65%]">blog Content</div>
                <div className="w-[35%]">
                    <div>
                        <h1 className="text-lg font-bold mb-4">
                            Popular Posts
                        </h1>
                        <div className="w-full h-[1px] bg-black/40"></div>
                        <div className="flex flex-col gap-8 mt-6">
                            <div className="flex items-start gap-5">
                                <img
                                    className="w-[150px] h-auto shrink-0"
                                    src="https://preview.colorlib.com/theme/hikers/images/img_1.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col gap-3">
                                    <p className="text-lg font-medium">
                                        Lorem ipsum dolor, sit amet consectetur
                                        adipisicing elit. Optio, debitis.
                                    </p>
                                    <p className="text-sm text-black/40">
                                        March 15, 2018
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <img
                                    className="w-[150px] h-auto shrink-0"
                                    src="https://preview.colorlib.com/theme/hikers/images/img_1.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col gap-3">
                                    <p className="text-lg font-medium">
                                        Lorem ipsum dolor, sit amet consectetur
                                        adipisicing elit. Optio, debitis.
                                    </p>
                                    <p className="text-sm text-black/40">
                                        March 15, 2018
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <img
                                    className="w-[150px] h-auto shrink-0"
                                    src="https://preview.colorlib.com/theme/hikers/images/img_1.jpg"
                                    alt=""
                                />
                                <div className="flex flex-col gap-3">
                                    <p className="text-lg font-medium">
                                        Lorem ipsum dolor, sit amet consectetur
                                        adipisicing elit. Optio, debitis.
                                    </p>
                                    <p className="text-sm text-black/40">
                                        March 15, 2018
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[100px]">
                        <h1 className="text-lg font-bold mb-4">Categories</h1>
                        <div className="w-full h-[1px] bg-black/40 mb-2"></div>
                        <div className="flex flex-col gap-3 ">
                            <div className="flex items-center cursor-pointer border-b-[1px] border-dotted py-3 justify-between">
                                <p className="text-blue-500 ">Food</p>
                                <p className="text-black/40 font-semibold">
                                    (12)
                                </p>
                            </div>
                            <div className="flex items-center border-b-[1px] cursor-pointer border-dotted py-3 justify-between">
                                <p className="text-blue-500 ">Food</p>
                                <p className="text-black/40 font-semibold">
                                    (12)
                                </p>
                            </div>
                            <div className="flex items-center border-b-[1px] border-dotted cursor-pointer py-3 justify-between">
                                <p className="text-blue-500 ">Food</p>
                                <p className="text-black/40 font-semibold">
                                    (12)
                                </p>
                            </div>
                            <div className="flex items-center border-b-[1px] cursor-pointer border-dotted py-3 justify-between">
                                <p className="text-blue-500 ">Food</p>
                                <p className="text-black/40 font-semibold">
                                    (12)
                                </p>
                            </div>
                            <div className="flex items-center border-b-[1px] cursor-pointer border-dotted py-3 justify-between">
                                <p className="text-blue-500 ">Food</p>
                                <p className="text-black/40 font-semibold">
                                    (12)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[60px]">
                        <h1 className="text-lg font-bold mb-4">Categories</h1>
                        <div className="w-full h-[1px] bg-black/40 mb-2"></div>
                        <div className="flex gap-1 flex-wrap mt-[30px]">
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                            <div className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md">
                                Travel
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-[100px] mt-[60px]">
                <h1 className="text-3xl font-medium">Related Posts</h1>
                <div className="grid grid-cols-3 gap-5">
                    <div>
                        <img
                            className="rounded-md"
                            src="https://preview.colorlib.com/theme/hikers/images/img_1.jpg"
                            alt=""
                        />
                        <div className="uppercase mt-6 text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                            Nature
                        </div>
                        <p className="my-6 text-2xl font-bold">
                            China's Best 2019 Stock Is Already Up 33% and No One
                            Knows Why
                        </p>
                        <div className="flex items-center gap-2 text-sm  font-bold">
                            <p>By Zayarwin</p>
                            <p>-</p>
                            <p>February 10, 2019</p>
                        </div>
                        <p className="mt-6">
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Quo sunt tempora dolor laudantium sed optio.
                            laborum error in eum id veritatis quidem neque
                            nesciunt at architecto nam ullam, officia unde
                            dolores officiis veniam
                        </p>
                    </div>
                    <div>
                        <img
                            className="rounded-md"
                            src="https://preview.colorlib.com/theme/hikers/images/img_1.jpg"
                            alt=""
                        />
                        <div className="uppercase mt-6 text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                            Nature
                        </div>
                        <p className="my-6 text-2xl font-bold">
                            China's Best 2019 Stock Is Already Up 33% and No One
                            Knows Why
                        </p>
                        <div className="flex items-center gap-2 text-sm  font-bold">
                            <p>By Zayarwin</p>
                            <p>-</p>
                            <p>February 10, 2019</p>
                        </div>
                        <p className="mt-6">
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Quo sunt tempora dolor laudantium sed optio.
                            laborum error in eum id veritatis quidem neque
                            nesciunt at architecto nam ullam, officia unde
                            dolores officiis veniam
                        </p>
                    </div>
                    <div>
                        <img
                            className="rounded-md"
                            src="https://preview.colorlib.com/theme/hikers/images/img_1.jpg"
                            alt=""
                        />
                        <div className="uppercase mt-6 text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                            Nature
                        </div>
                        <p className="my-6 text-2xl font-bold">
                            China's Best 2019 Stock Is Already Up 33% and No One
                            Knows Why
                        </p>
                        <div className="flex items-center gap-2 text-sm  font-bold">
                            <p>By Zayarwin</p>
                            <p>-</p>
                            <p>February 10, 2019</p>
                        </div>
                        <p className="mt-6">
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Quo sunt tempora dolor laudantium sed optio.
                            laborum error in eum id veritatis quidem neque
                            nesciunt at architecto nam ullam, officia unde
                            dolores officiis veniam
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-black/80 mt-[100px] py-10 px-[100px]">
                <div className="grid text-white grid-cols-3 gap-5">
                    <div>
                        <h1 className="text-lg font-semibold">About us</h1>
                        <p className="mt-5 text-white/50">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Et ab necessitatibus quas laboriosam incidunt
                            at, harum ipsa aliquam quam vel saepe sint accusamus
                            odit nostrum unde doloremque distinctio est odio
                            expedita aliquid possimus. Laboriosam ipsum
                            similique delectus odio est alias architecto, quae
                            quidem nobis dolores nulla praesentium veritatis
                            aperiam ut!
                        </p>
                    </div>
                    <div className="w-full flex items-center flex-col">
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

export default BlogDetail;
