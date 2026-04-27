/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import ChunkUploader from "@/Components/ChunkUploader";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/Editor/RichTextEditor";
import Select from "@/Components/Select";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import React from "react";

const BlogForm = ({ type, blog, tags }) => {
    const { data, setData, post, errors } = useForm({
        title: blog ? blog.title : "",
        content: blog ? blog.content : "",
        image: blog ? blog.image : null,
        tags: blog
            ? blog.tags.map((tag) => ({
                  label: tag.name,
                  value: tag.id,
              }))
            : [],
    });

    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
    }));

    const submitLabel = type === "edit" ? "Save Blog" : "Create Blog";

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden
                            >
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                                {type === "edit" ? "Edit Blog" : "Create Blog"}
                            </h1>
                            <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                                Publish and manage articles for your audience
                            </p>
                        </div>
                    </div>
                    <Link
                        href={window.route("admin.blogs")}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                    >
                        Back to blogs
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("admin.blogs.update", {
                                      blog,
                                  })
                                : window.route("admin.blogs.store"),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                    className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/50 sm:p-6 lg:p-8"
                >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
                        <div className="sm:col-span-2">
                            <ChunkUploader
                                photos={data.image}
                                onUpload={(file) => setData("image", file)}
                                acceptedFileTypes={["image/*"]}
                                allowImagePreview
                            />
                            <InputError message={errors?.image} inline />
                        </div>
                        <Input
                            label="Title"
                            errorMessage={errors?.title}
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <Select
                            options={tagOptions}
                            isMulti
                            selected={data.tags}
                            label="Tags"
                            onChange={(tags) => {
                                setData("tags", tags);
                            }}
                            errorMessage={errors?.tags}
                        />
                        <div className="sm:col-span-2">
                            <RichTextEditor
                                label="Content"
                                value={data.content}
                                onChange={(value) => setData("content", value)}
                                error={errors?.content}
                                placeholder="Write your blog content..."
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-white/5 pt-6">
                        <Button
                            type="submit"
                            text={submitLabel}
                            className="!rounded-xl !bg-primary !px-8 !py-3 !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogForm;

BlogForm.layout = (page) => <AdminLayout>{page}</AdminLayout>;
