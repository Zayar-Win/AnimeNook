import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    { field: "Title" },
    { field: "Image", minWidth: "100px" },
    { field: "Content", minWidth: "200px" },
    { field: "Author" },
    { field: "Tags", minWidth: "300px" },
    { field: "Action" },
];

function AdminPagination({ meta }) {
    if (!meta?.links?.length || (meta?.last_page ?? 1) <= 1) return null;

    return (
        <nav
            className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            aria-label="Pagination"
        >
            {meta.links.map((link, i) => {
                const isDisabled = !link.url;
                const active = link.active;
                const content = (
                    <span
                        className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-bold sm:min-h-10 sm:min-w-10 sm:px-3 sm:text-sm ${
                            active
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "border border-white/10 bg-[#1a1a1a] text-zinc-300 hover:border-white/20 hover:bg-white/5"
                        } ${isDisabled ? "pointer-events-none opacity-35" : ""}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
                if (isDisabled) {
                    return (
                        <span key={i} className="inline-flex">
                            {content}
                        </span>
                    );
                }
                return (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        className="inline-flex"
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}

function BlogRowActions({ blog, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link
                href={window.route("admin.blogs.edit", { blog })}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:h-auto sm:w-auto sm:p-2"
                title="Edit blog"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </Link>
            <button
                type="button"
                onClick={() => onDelete(blog)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 sm:h-auto sm:w-auto sm:p-2"
                title="Delete blog"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
    );
}

const Index = ({ blogs }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [selectedBlogIds, setSelectedBlogIds] = useState([]);
    const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);
    const blogRows = blogs?.data ?? [];

    const deleteHandler = () => {
        if (!selectedBlog) return;

        router.post(
            window.route("admin.blogs.delete", { blog: selectedBlog }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedBlog(null);
                },
            }
        );
    };

    const openDelete = (blog) => {
        setSelectedBlogIds([]);
        setSelectedBlog(blog);
        setIsDeleteModalOpen(true);
    };

    const openBulkDelete = () => {
        if (!selectedBlogIds.length) return;
        setSelectedBlog(null);
        setIsDeleteModalOpen(true);
    };

    const bulkDeleteHandler = () => {
        if (!selectedBlogIds.length) return;

        setIsBulkDeletePending(true);
        router.post(
            window.route("admin.blogs.bulk-delete"),
            { blog_ids: selectedBlogIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedBlogIds([]);
                },
                onFinish: () => {
                    setIsBulkDeletePending(false);
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
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
                            Blog Management
                        </h1>
                        <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                            Manage posts, authors, and tags
                        </p>
                    </div>
                </div>
                <div className="w-full shrink-0 sm:w-auto">
                    <Button
                        text="Create Blog"
                        type="link"
                        href={window.route("admin.blogs.create")}
                        className="!block !w-full !rounded-xl !bg-primary !px-4 !py-3 !text-center !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!inline-block sm:!w-auto sm:!px-6"
                    />
                </div>
            </div>

            {blogs?.total != null && blogs.total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {blogs.from ?? 0}–{blogs.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {blogs.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {blogRows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">No blogs yet</p>
                        <p className="mt-1 text-sm text-zinc-500">
                            Create your first post to get started.
                        </p>
                    </div>
                ) : (
                    blogRows.map((blog) => (
                        <article
                            key={blog.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <div className="flex gap-3">
                                <img
                                    className="h-20 w-20 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                                    src={blog.image}
                                    alt="blog"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 font-bold text-white">
                                        {blog.title}
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        by {blog.author?.name ?? "Unknown"}
                                    </p>
                                    <div
                                        className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400"
                                        dangerouslySetInnerHTML={{
                                            __html: blog.content,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {blog.tags?.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-300"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                    Actions
                                </span>
                                <BlogRowActions blog={blog} onDelete={openDelete} />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden md:block">
                {selectedBlogIds.length > 0 && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                            {selectedBlogIds.length} blogs selected
                        </p>
                        <button
                            type="button"
                            onClick={openBulkDelete}
                            disabled={isBulkDeletePending}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isBulkDeletePending ? "Deleting..." : "Delete Selected"}
                        </button>
                    </div>
                )}
                <Table
                    datas={blogs}
                    columns={columns}
                    onSelectionChange={setSelectedBlogIds}
                >
                    <TableData>
                        {(blog) => (
                            <p className="line-clamp-1 font-semibold text-white">
                                {blog.title}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(blog) => (
                            <img
                                className="h-14 w-24 rounded-lg object-cover ring-1 ring-white/10"
                                src={blog.image}
                                alt="blog"
                            />
                        )}
                    </TableData>
                    <TableData className="min-w-[300px]">
                        {(blog) => (
                            <div
                                className="line-clamp-3 text-sm text-zinc-400"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        )}
                    </TableData>
                    <TableData>
                        {(blog) => (
                            <p className="text-zinc-300">{blog.author?.name ?? "Unknown"}</p>
                        )}
                    </TableData>
                    <TableData>
                        {(blog) => (
                            <div className="flex w-full flex-wrap items-center gap-1.5">
                                {blog.tags?.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-zinc-300"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </TableData>
                    <TableData>
                        {(blog) => (
                            <BlogRowActions blog={blog} onDelete={openDelete} />
                        )}
                    </TableData>
                </Table>
            </div>

            <AdminPagination meta={blogs} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={selectedBlog ? deleteHandler : bulkDeleteHandler}
                    title={
                        selectedBlog
                            ? "Are you sure want to delete this blog."
                            : `Are you sure you want to delete ${selectedBlogIds.length} blogs?`
                    }
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
