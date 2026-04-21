import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

const columns = [
    { field: "Type" },
    { field: "Name" },
    { field: "Comment" },
    { field: "Like Count" },
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

function CommentFiltersToolbar({
    search,
    setSearch,
    searchInputRef,
    type,
    setType,
    period,
    setPeriod,
    onClear,
    hasActiveFilters,
    fetchWithState,
}) {
    return (
        <div className="mb-5 rounded-2xl border border-white/5 bg-[#1a1a1a]/80 p-4 shadow-inner sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-4">
                <div className="lg:col-span-5">
                    <label
                        htmlFor="comment-search"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </span>
                        <input
                            ref={searchInputRef}
                            id="comment-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Comment text or series name…"
                            autoComplete="off"
                            className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                        />
                    </div>
                </div>
                <div className="sm:col-span-1 lg:col-span-3">
                    <label
                        htmlFor="comment-type"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Type
                    </label>
                    <select
                        id="comment-type"
                        value={type}
                        onChange={(e) => {
                            const v = e.target.value;
                            setType(v);
                            fetchWithState({
                                page: 1,
                                search,
                                type: v,
                                period,
                            });
                        }}
                        className="h-[42px] w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 text-sm text-white outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="">All types</option>
                        <option value="anime">Anime</option>
                        <option value="manga">Manga</option>
                    </select>
                </div>
                <div className="sm:col-span-1 lg:col-span-2">
                    <label
                        htmlFor="comment-period"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Posted
                    </label>
                    <select
                        id="comment-period"
                        value={period}
                        onChange={(e) => {
                            const v = e.target.value;
                            setPeriod(v);
                            fetchWithState({
                                page: 1,
                                search,
                                type,
                                period: v,
                            });
                        }}
                        className="h-[42px] w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 text-sm text-white outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="">All time</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                </div>
                <div className="flex items-end lg:col-span-2">
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasActiveFilters}
                        className="h-[42px] w-full rounded-xl border border-white/10 px-3 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

function TypeBadge({ comment }) {
    const anime =
        comment.commentable_type === "App\\Models\\Anime";
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                anime
                    ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    : "border-pink-500/20 bg-pink-500/10 text-pink-400"
            }`}
        >
            {anime ? "Anime" : "Manga"}
        </span>
    );
}

function CommentBodyHtml({ comment }) {
    const html = comment.display_body ?? comment.body ?? "";
    return (
        <div
            className="max-w-none text-sm leading-relaxed text-zinc-400 line-clamp-3 sm:line-clamp-2 [&_a]:text-primary [&_a]:underline [&_img]:max-h-24 [&_img]:rounded-md [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

function CommentRowActions({ onDelete }) {
    return (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={onDelete}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 sm:h-9 sm:w-9"
                title="Delete comment"
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

function formatPostedAt(iso) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "—";
    }
}

const Index = ({ comments, filters = {} }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? "");
    const [type, setType] = useState(filters?.type ?? "");
    const [period, setPeriod] = useState(filters?.period ?? "");
    const searchInputRef = useRef(null);
    const rows = comments?.data ?? [];

    const buildQuery = (overrides = {}) => {
        const page = overrides.page ?? 1;
        const s =
            overrides.search !== undefined ? overrides.search : search;
        const t = overrides.type !== undefined ? overrides.type : type;
        const p = overrides.period !== undefined ? overrides.period : period;
        return {
            page,
            ...(String(s).trim() ? { search: String(s).trim() } : {}),
            ...(t ? { type: t } : {}),
            ...(p ? { period: p } : {}),
        };
    };

    const fetchWithState = (overrides = {}) => {
        router.get(
            window.route("group.admin.comments"),
            buildQuery(overrides),
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            }
        );
    };

    useEffect(() => {
        if (document.activeElement === searchInputRef.current) return;
        setSearch(filters?.search ?? "");
    }, [filters?.search]);

    useEffect(() => {
        setType(filters?.type ?? "");
    }, [filters?.type]);

    useEffect(() => {
        setPeriod(filters?.period ?? "");
    }, [filters?.period]);

    useEffect(() => {
        const id = setTimeout(() => {
            const applied = (filters?.search ?? "").trim();
            if (search.trim() === applied) return;
            fetchWithState({ page: 1, search, type, period });
        }, 420);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const hasActiveFilters =
        Boolean(search.trim()) || Boolean(type) || Boolean(period);

    const clearFilters = () => {
        setSearch("");
        setType("");
        setPeriod("");
        router.get(
            window.route("group.admin.comments"),
            { page: 1 },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const openDelete = (comment) => {
        setSelectedComment(comment);
        setIsDeleteModalOpen(true);
    };

    const deleteHandler = () => {
        router.post(
            window.route("group.admin.comments.delete", {
                comment: selectedComment,
            }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
            }
        );
    };

    const emptyMessage = hasActiveFilters
        ? "No comments match your filters."
        : "There are no comments to moderate yet.";

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 flex min-w-0 items-start gap-3 border-b border-white/10 pb-6 sm:mb-8 sm:items-center sm:gap-4">
                <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                </div>
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                        Comments
                    </h1>
                    <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                        Moderate user comments on this group
                    </p>
                </div>
            </div>

            <CommentFiltersToolbar
                search={search}
                setSearch={setSearch}
                searchInputRef={searchInputRef}
                type={type}
                setType={setType}
                period={period}
                setPeriod={setPeriod}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
                fetchWithState={fetchWithState}
            />

            {comments?.total != null && comments.total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {comments.from ?? 0}–{comments.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {comments.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">
                            No comments
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    rows.map((comment) => (
                        <article
                            key={comment.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <TypeBadge comment={comment} />
                                <span className="text-[11px] text-zinc-500">
                                    {formatPostedAt(comment.created_at)}
                                </span>
                            </div>
                            <p className="mt-2 font-semibold text-white">
                                {comment.commentable?.name ?? "—"}
                            </p>
                            <div className="mt-3 border-t border-white/5 pt-3">
                                <CommentBodyHtml comment={comment} />
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                                <div className="flex items-center gap-1.5 font-bold text-white">
                                    <svg
                                        className="h-4 w-4 fill-red-500 text-red-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span>{comment.likes_count}</span>
                                </div>
                                <CommentRowActions
                                    onDelete={() => openDelete(comment)}
                                />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden md:block">
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] shadow-xl shadow-black/50">
                    <Table datas={comments} columns={columns}>
                        <TableData>
                            {(comment) => <TypeBadge comment={comment} />}
                        </TableData>
                        <TableData>
                            {(comment) => (
                                <p className="line-clamp-1 font-bold text-white">
                                    {comment.commentable?.name ?? "—"}
                                </p>
                            )}
                        </TableData>
                        <TableData className="min-w-[280px] max-w-md">
                            {(comment) => <CommentBodyHtml comment={comment} />}
                        </TableData>
                        <TableData>
                            {(comment) => (
                                <div className="flex items-center gap-1.5 font-bold text-white">
                                    <svg
                                        className="h-4 w-4 fill-red-500 text-red-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span>{comment.likes_count}</span>
                                </div>
                            )}
                        </TableData>
                        <TableData>
                            {(comment) => (
                                <CommentRowActions
                                    onDelete={() => openDelete(comment)}
                                />
                            )}
                        </TableData>
                    </Table>
                </div>
            </div>

            <AdminPagination meta={comments} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure you want to delete this comment?"}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
