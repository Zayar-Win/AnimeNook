import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import { mangaThumbnailUrl } from "@/app";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

const columns = [
    { field: "Name" },
    { field: "ThumbNail" },
    { field: "Description" },
    { field: "Status" },
    { field: "Rating" },
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

function MangaFiltersToolbar({
    search,
    setSearch,
    searchInputRef,
    statusId,
    setStatusId,
    statuses,
    onClear,
    hasActiveFilters,
}) {
    return (
        <div className="mb-5 rounded-2xl border border-white/5 bg-[#1a1a1a]/80 p-4 shadow-inner sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-4">
                <div className="lg:col-span-6">
                    <label
                        htmlFor="manga-search"
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
                            id="manga-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or description…"
                            autoComplete="off"
                            className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                        />
                    </div>
                </div>
                <div className="sm:col-span-1 lg:col-span-4">
                    <label
                        htmlFor="manga-status"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Status
                    </label>
                    <select
                        id="manga-status"
                        value={statusId}
                        onChange={(e) => setStatusId(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 py-2.5 text-sm text-white outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="">All statuses</option>
                        {statuses.map((s) => (
                            <option key={s.id} value={String(s.id)}>
                                {s.name}
                            </option>
                        ))}
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

function MangaRowActions({ manga, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link
                href={window.route("group.admin.mangas.edit", { manga })}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:h-auto sm:w-auto sm:p-2"
                title="Edit manga"
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
                onClick={() => onDelete(manga)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 sm:h-auto sm:w-auto sm:p-2"
                title="Delete manga"
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

function StatusPill({ name }) {
    return (
        <span className="inline-flex max-w-full items-center truncate rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-bold capitalize text-green-500">
            {name ?? "—"}
        </span>
    );
}

const Index = ({ mangas, filters = {}, statuses = [] }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedManga, setSelectedManga] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? "");
    const [statusId, setStatusId] = useState(
        filters?.status_id != null && filters.status_id !== ""
            ? String(filters.status_id)
            : ""
    );
    const searchInputRef = useRef(null);
    const statusSkipRef = useRef(true);
    const rows = mangas?.data ?? [];

    const buildQuery = (page = 1) => ({
        page,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(statusId ? { status_id: statusId } : {}),
    });

    const fetchMangas = (page = 1) => {
        router.get(window.route("group.admin.mangas"), buildQuery(page), {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (document.activeElement === searchInputRef.current) return;
        setSearch(filters?.search ?? "");
    }, [filters?.search]);

    useEffect(() => {
        const next =
            filters?.status_id != null && filters.status_id !== ""
                ? String(filters.status_id)
                : "";
        setStatusId(next);
    }, [filters?.status_id]);

    useEffect(() => {
        const id = setTimeout(() => {
            const applied = (filters?.search ?? "").trim();
            if (search.trim() === applied) return;
            fetchMangas(1);
        }, 420);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        if (statusSkipRef.current) {
            statusSkipRef.current = false;
            return;
        }
        fetchMangas(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusId]);

    const hasActiveFilters = Boolean(search.trim()) || Boolean(statusId);

    const clearFilters = () => {
        statusSkipRef.current = true;
        setSearch("");
        setStatusId("");
        router.get(
            window.route("group.admin.mangas"),
            { page: 1 },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const openDelete = (manga) => {
        setSelectedManga(manga);
        setIsDeleteModalOpen(true);
    };

    const deleteHandler = () => {
        router.post(
            window.route("group.admin.mangas.delete", {
                manga: selectedManga,
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
        ? "No manga match your search or status filter."
        : "There are no manga in this library yet.";

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:mb-8">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
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
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                                Manga Management
                            </h1>
                            <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                                Manage your manga library and chapters
                            </p>
                        </div>
                    </div>
                    <div className="w-full shrink-0 sm:w-auto sm:min-w-[11rem]">
                        <Button
                            href={window.route("group.admin.mangas.create")}
                            text="Create Manga"
                            className="!block !w-full !rounded-xl !bg-primary !px-4 !py-3 !text-center !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!inline-block sm:!w-auto sm:!px-6"
                        />
                    </div>
                </div>
            </div>

            <MangaFiltersToolbar
                search={search}
                setSearch={setSearch}
                searchInputRef={searchInputRef}
                statusId={statusId}
                setStatusId={setStatusId}
                statuses={statuses}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {mangas?.total != null && mangas.total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {mangas.from ?? 0}–{mangas.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {mangas.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">
                            No manga
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    rows.map((manga) => (
                        <article
                            key={manga.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <div className="flex gap-3">
                                <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={
                                            manga?.thumbnail || mangaThumbnailUrl
                                        }
                                        alt=""
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold leading-snug text-white">
                                        {manga.name}
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                                        {manga.description}
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <StatusPill
                                            name={manga?.status?.name}
                                        />
                                        <div className="flex items-center gap-1 text-sm font-bold text-white">
                                            <svg
                                                className="h-4 w-4 fill-yellow-500 text-yellow-500"
                                                viewBox="0 0 24 24"
                                                aria-hidden
                                            >
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                            <span>{manga?.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                    Actions
                                </span>
                                <MangaRowActions
                                    manga={manga}
                                    onDelete={openDelete}
                                />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden md:block">
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] shadow-xl shadow-black/50">
                    <Table datas={mangas} columns={columns}>
                        <TableData>
                            {(manga) => (
                                <p className="font-bold text-white">
                                    {manga.name}
                                </p>
                            )}
                        </TableData>
                        <TableData>
                            {(manga) => (
                                <div className="h-16 w-12 overflow-hidden rounded-lg ring-1 ring-white/10">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={
                                            manga?.thumbnail || mangaThumbnailUrl
                                        }
                                        alt=""
                                    />
                                </div>
                            )}
                        </TableData>
                        <TableData className="min-w-[300px]">
                            {(manga) => (
                                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
                                    {manga.description}
                                </p>
                            )}
                        </TableData>
                        <TableData>
                            {(manga) => (
                                <StatusPill name={manga?.status?.name} />
                            )}
                        </TableData>
                        <TableData>
                            {(manga) => (
                                <div className="flex items-center gap-1.5 font-bold text-white">
                                    <svg
                                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                    <span>{manga?.rating}</span>
                                </div>
                            )}
                        </TableData>
                        <TableData>
                            {(manga) => (
                                <MangaRowActions
                                    manga={manga}
                                    onDelete={openDelete}
                                />
                            )}
                        </TableData>
                    </Table>
                </div>
            </div>

            <AdminPagination meta={mangas} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure you want to delete this manga?"}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
