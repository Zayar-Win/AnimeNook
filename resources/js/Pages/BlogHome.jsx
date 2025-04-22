import { Link } from "@inertiajs/react";
import Carousel from "@/Components/Carousel/Index";
import React from "react";
import { SwiperSlide } from "swiper/react";
import moment from "moment";
import BlogLayout from "@/Layouts/BlogLayout";

const BlogHome = ({
    sliderBlogs,
    randomBlogs,
    randomGridBlogs,
    popularBlogs,
    tagsWithBlogs,
}) => {
    return (
        <div>
            <div>
                <Carousel
                    id="blog-swiper"
                    className="!h-[90vh] rounded-none"
                    autoPlay={{
                        delay: 6000,
                        disableOnInteraction: false,
                    }}
                    navigation={true}
                >
                    {sliderBlogs.map((blog, index) => {
                        return (
                            <SwiperSlide key={index} className="w-full h-full">
                                <div
                                    className="w-full flex items-center h-full relative bg-cover bg-top"
                                    style={{
                                        backgroundImage: `url(${blog.image})`,
                                    }}
                                >
                                    <div className="absolute top-0 left-0 z-[1] right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>
                                    <div className="relative flex flex-col gap-5 lg:w-[40%] md:w-[60%] w-full z-[10] md:ml-[150px] ml-[40px]">
                                        <div className="uppercase text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                            {blog?.tags[0]?.name}
                                        </div>
                                        <Link
                                            href={window.route("blogs.show", {
                                                blog,
                                            })}
                                        >
                                            <p className="text-white md:text-5xl text-4xl font-medium leading-[1.2]">
                                                {blog?.title}
                                            </p>
                                        </Link>
                                        <div className="flex items-center text-white text-sm gap-2">
                                            <p>By {blog?.author?.name}</p>
                                            <p>-</p>
                                            <p>
                                                {moment(blog.created_at).format(
                                                    "MMMM DD, YYYY"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Carousel>
            </div>
            <div className="border-[1px] border-black/10 grid mt-16 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5 p-5 xl:mx-[100px] md:mx-[50px] mx-[20px] rounded-lg">
                {randomBlogs.map((blog, index) => {
                    return (
                        <Link key={index} href={blog?.slug}>
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-[130px] rounded-lg"
                                    src={blog?.image}
                                    alt=""
                                />
                                <div>
                                    <div className="uppercase text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                        {blog?.tags[0]?.name}
                                    </div>
                                    <p className="mt-1">{blog?.title}</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <div className="mt-[100px] grid lg:grid-cols-7 grid-cols-1 lg:grid-rows-2 gap-5 xl:mx-[100px] md:mx-[50px] mx-[20px]">
                <Link
                    className="lg:col-span-3 lg:row-span-2"
                    href={window.route("blogs.show", {
                        blog: randomGridBlogs[0],
                    })}
                >
                    <div
                        className=" relative lg:h-full h-[300px]   px-5 py-5 bg-cover bg-center  "
                        style={{
                            backgroundImage: `url(${randomGridBlogs[0]?.image})`,
                        }}
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>
                        <div className="relative z-[10] h-full flex flex-col justify-between">
                            <div className="uppercase text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                {randomGridBlogs[0]?.tags[0]?.name}
                            </div>
                            <div className="text-white">
                                <p className="text-2xl font-medium md:w-[60%]">
                                    {randomGridBlogs[0]?.title}
                                </p>
                                <p className="mt-1">
                                    {moment(
                                        randomGridBlogs[0]?.created_at
                                    ).format("MMMM DD, YYYY")}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link
                    className="lg:col-span-4"
                    href={window.route("blogs.show", {
                        blog: randomGridBlogs[1],
                    })}
                >
                    <div
                        className="flex flex-col relative h-[300px] px-5 py-5 justify-between "
                        style={{
                            backgroundImage: `url(${randomGridBlogs[1]?.image})`,
                        }}
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>
                        <div className="h-full flex flex-col relative z-[10] justify-between">
                            <div className="uppercase text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                {randomGridBlogs[1]?.tags[0]?.name}
                            </div>
                            <div className="text-white">
                                <p className="text-xl font-medium md:w-[60%]">
                                    {randomGridBlogs[1]?.title}
                                </p>
                                <p className="mt-1">
                                    {moment(
                                        randomGridBlogs[1]?.created_at
                                    ).format("MMMM DD, YYYY")}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link
                    href={window.route("blogs.show", {
                        blog: randomGridBlogs[2],
                    })}
                    className="lg:col-span-2 lg:col-start-4"
                >
                    <div
                        className="flex flex-col relative h-[300px] px-5 py-5 justify-between "
                        style={{
                            backgroundImage: `url(${randomGridBlogs[2]?.image})`,
                        }}
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>
                        <div className="flex flex-col justify-between h-full relative z-[10]">
                            <div className="uppercase text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                {randomGridBlogs[2]?.tags[0]?.name}
                            </div>
                            <div className="text-white">
                                <p className="text-xl font-medium ">
                                    {randomGridBlogs[2]?.title}
                                </p>
                                <p className="mt-1">
                                    {moment(
                                        randomGridBlogs[2]?.created_at
                                    ).format("MMMM DD, YYYY")}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link
                    href={window.route("blogs.show", {
                        blog: randomGridBlogs[3],
                    })}
                    className="lg:col-span-2"
                >
                    <div
                        className="flex flex-col relative h-[300px] px-5 py-5 justify-between col-span-2"
                        style={{
                            backgroundImage: `url(${randomGridBlogs[3]?.image})`,
                        }}
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>
                        <div className="h-full z-[10] relative flex flex-col justify-between ">
                            <div className="uppercase text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                {randomGridBlogs[3]?.tags[0]?.name}
                            </div>
                            <div className="text-white">
                                <p className="text-xl font-medium ">
                                    {randomGridBlogs[3]?.title}
                                </p>
                                <p className="mt-1">
                                    {moment(
                                        randomGridBlogs[3]?.created_at
                                    ).format("MMMM DD, YYYY")}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="mt-[100px] xl:mx-[100px] md:mx-[50px] mx-[20px]">
                <h1 className="text-4xl font-bold">Popular Posts</h1>
                <div className="mt-[50px] flex lg:flex-row flex-col gap-8">
                    <div className="lg:w-[50%]">
                        <img
                            className="w-full rounded-md"
                            src={popularBlogs[0]?.image}
                            alt=""
                        />
                        <div className="uppercase mt-8 text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                            {popularBlogs[0]?.tags[0]?.name}
                        </div>
                        <Link href={popularBlogs[0]?.slug}>
                            <p className="text-3xl font-semibold mt-4">
                                {popularBlogs[0]?.title}
                            </p>
                        </Link>
                        <div className="flex items-center gap-5 mt-5">
                            <div className="flex items-center text-sm gap-2">
                                <p>{popularBlogs[0]?.author?.name}</p>
                                <p>-</p>
                                <p>
                                    {moment(popularBlogs[0]?.created_at).format(
                                        "MMMM DD, YYYY"
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="blog-content">
                            <p
                                className="mt-5 line-clamp-5"
                                dangerouslySetInnerHTML={{
                                    __html: popularBlogs[0]?.content,
                                }}
                            ></p>
                        </div>
                    </div>
                    <div className="lg:w-[50%] flex flex-col gap-8">
                        {popularBlogs.slice(1).map((blog, index) => {
                            return (
                                <Link key={index} href={blog?.slug}>
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <div className="uppercase text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                                {blog?.tags[0]?.name}
                                            </div>
                                            <p className="mt-4 text-lg font-bold">
                                                {blog?.title}
                                            </p>
                                            <p className="mt-2 text-black/40 text-sm">
                                                {moment(blog.created_at).format(
                                                    "MMMM DD, YYYY"
                                                )}
                                            </p>
                                            <div className="blog-content">
                                                <p
                                                    className="mt-5 line-clamp-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html: blog.content,
                                                    }}
                                                ></p>
                                            </div>
                                        </div>
                                        <div className="w-[200px] overflow-hidden rounded-md shrink-0">
                                            <img src={blog?.image} alt="" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="mt-[100px] xl:mx-[100px] md:mx-[50px] mx-[20px] grid lg:grid-cols-3 md:grid-cols-2 gap-5">
                {tagsWithBlogs.map((tag, index) => {
                    return (
                        <div key={index} className="flex flex-col gap-8">
                            <div className="">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-bold">
                                        {tag?.name}
                                    </h1>
                                    <button className="text-xs font-bold bg-gray-300 px-3 py-1 rounded-md">
                                        View All
                                    </button>
                                </div>
                                <Link
                                    href={window.route("blogs.show", {
                                        blog: tag?.blogs[0],
                                    })}
                                    className="block mt-[50px]"
                                >
                                    <div>
                                        <img
                                            src={tag?.blogs[0]?.image}
                                            alt=""
                                            className="w-full rounded-md"
                                        />
                                        <div className="uppercase mt-8 text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                            {tag?.blogs[0]?.tags[0]?.name}
                                        </div>
                                        <p className="text-2xl mt-5 font-bold ">
                                            {tag?.blogs[0]?.title}
                                        </p>
                                        <p className="mt-5 text-black/40 text-sm">
                                            {moment(
                                                tag?.blogs[0]?.created_at
                                            ).format("MMMM DD, YYYY")}
                                        </p>
                                        <div className="blog-content">
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: tag?.blogs[0]
                                                        ?.content,
                                                }}
                                                className="mt-5 line-clamp-5"
                                            ></p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {tag?.blogs.slice(1).map((blog, index) => {
                                return (
                                    <Link
                                        key={index}
                                        href={window.route("blogs.show", {
                                            blog,
                                        })}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div>
                                                <div className="uppercase  text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                                    {blog?.tags[0]?.name}
                                                </div>
                                                <p className="mt-3 text-lg font-bold">
                                                    {blog?.title}
                                                </p>
                                                <p className="mt-3 text-sm text-black/40">
                                                    {moment(
                                                        blog?.created_at
                                                    ).format("MMMM DD, YYYY")}
                                                </p>
                                            </div>
                                            <img
                                                className="w-[100px] rounded-md shrink-0"
                                                src={blog?.image}
                                                alt=""
                                            />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BlogHome;

BlogHome.layout = (page) => <BlogLayout>{page}</BlogLayout>;
