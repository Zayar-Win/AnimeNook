import BlogLayout from "@/Layouts/BlogLayout";
import { Link } from "@inertiajs/react";
import moment from "moment";
import React from "react";

const BlogDetail = ({ blog, popularBlogs, tags, relatedBlogs }) => {
    return (
        <div>
            <div className="flex gap-10 mx-[100px] mt-[60px]">
                <div className="w-[65%]">
                    <h1 className="text-4xl font-bold  mb-6">{blog?.title}</h1>
                    <img
                        src={blog?.image}
                        className="w-full mb-5 h-auto object-cover"
                    />
                    <div className="blog-content">
                        <p
                            dangerouslySetInnerHTML={{ __html: blog?.content }}
                        />
                    </div>
                </div>
                <div className="w-[35%]">
                    <div>
                        <h1 className="text-lg font-bold mb-4">
                            Popular Posts
                        </h1>
                        <div className="w-full h-[1px] bg-black/40"></div>
                        <div className="flex flex-col gap-8 mt-6">
                            {popularBlogs?.map((blog, index) => (
                                <Link
                                    key={index}
                                    href={window.route("blogs.show", {
                                        blog,
                                    })}
                                >
                                    <div className="flex items-start gap-5">
                                        <img
                                            className="w-[150px] h-auto shrink-0"
                                            src={blog?.image}
                                            alt=""
                                        />
                                        <div className="flex flex-col gap-3">
                                            <p className="text-lg font-medium">
                                                {blog?.title}
                                            </p>
                                            <p className="text-sm text-black/40">
                                                {moment(
                                                    blog?.created_at
                                                ).format("MMMM DD, YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* <div className="mt-[100px]">
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
                    </div> */}
                    <div className="mt-[60px]">
                        <h1 className="text-lg font-bold mb-4">Categories</h1>
                        <div className="w-full h-[1px] bg-black/40 mb-2"></div>
                        <div className="flex gap-1 flex-wrap mt-[30px]">
                            {tags?.map((tag, index) => (
                                <div
                                    key={index}
                                    className="bg-black/10 text-gray-600 w-max px-3 text-sm py-1 rounded-md"
                                >
                                    {tag?.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-[100px] mt-[60px]">
                <h1 className="text-3xl font-medium">Related Posts</h1>
                <div className="grid grid-cols-3 gap-5 mt-[50px]">
                    {relatedBlogs?.map((blog, index) => (
                        <Link
                            key={index}
                            href={window.route("blogs.show", {
                                blog,
                            })}
                        >
                            <div>
                                <img
                                    className="rounded-md"
                                    src={blog?.image}
                                    alt=""
                                />
                                <div className="uppercase mt-6 text-xs font-semibold bg-[#8BC24A] text-white px-3 tracking-widest py-1 rounded-md w-max ">
                                    {blog?.tags[0]?.name}
                                </div>
                                <p className="my-6 text-2xl font-bold">
                                    {blog?.title}
                                </p>
                                <div className="flex items-center gap-2 text-sm  font-bold">
                                    <p>
                                        {moment(blog?.created_at).format(
                                            "MMMM DD, YYYY"
                                        )}
                                    </p>
                                </div>
                                <p
                                    className="mt-6 line-clamp-4"
                                    dangerouslySetInnerHTML={{
                                        __html: blog?.content,
                                    }}
                                ></p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;

BlogDetail.layout = (page) => <BlogLayout>{page}</BlogLayout>;
