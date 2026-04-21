import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import { Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

function AdminPagination({ meta }) {
    if (!meta?.links?.length || (meta?.last_page ?? 1) <= 1) return null;

    return (
        <nav
            className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:mt-6 sm:gap-2"
            aria-label="Seasons pagination"
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

function SeasonFiltersToolbar({
    search,
    setSearch,
    searchInputRef,
    chaptersFilter,
    applyChaptersFilter,
    onClear,
    hasActiveFilters,
}) {
    return (
        <div className="mb-4 rounded-2xl border border-white/5 bg-[#141414]/90 p-4 shadow-inner sm:mb-5 sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-4">
                <div className="lg:col-span-6">
                    <label
                        htmlFor="season-search"
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
                            id="season-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Title or season number…"
                            autoComplete="off"
                            className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                        />
                    </div>
                </div>
                <div className="sm:col-span-1 lg:col-span-4">
                    <label
                        htmlFor="season-chapters"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Chapters
                    </label>
                    <select
                        id="season-chapters"
                        value={chaptersFilter}
                        onChange={(e) =>
                            applyChaptersFilter(e.target.value)
                        }
                        className="h-[42px] w-full cursor-pointer rounded-xl border border-white/10 bg-[#0f0f0f] px-3 text-sm text-white outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="any">Any</option>
                        <option value="with">Has chapters</option>
                        <option value="none">No chapters</option>
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

function SeasonRowActions({ type, serie, season, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Link
                href={window.route(
                    type === "anime"
                        ? "group.admin.anime.seasons.edit"
                        : "group.admin.manga.seasons.edit",
                    type === "anime"
                        ? { anime: serie, season }
                        : { manga: serie, season }
                )}
                className="flex h-10 min-w-[4.5rem] items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-bold text-primary transition hover:bg-primary/10 sm:h-9"
            >
                Edit
            </Link>
            <button
                type="button"
                onClick={() => onDelete(season)}
                className="flex h-10 min-w-[4.5rem] items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-bold text-red-400 transition hover:bg-red-500/10 sm:h-9"
            >
                Delete
            </button>
        </div>
    );
}

function normalizeChaptersMode(v) {
    return v === "with" || v === "none" ? v : "any";
}

const Index = ({ seasons, serie, type, seasonFilters = {} }) => {
    const { url } = usePage();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [search, setSearch] = useState(seasonFilters?.search ?? "");
    const [chaptersFilter, setChaptersFilter] = useState(
        normalizeChaptersMode(seasonFilters?.chapters)
    );
    const searchInputRef = useRef(null);

    const seriesColumnLabel = type === "anime" ? "Anime" : "Manga";
    const columns = [
        { field: seriesColumnLabel },
        { field: "Season Title" },
        { field: "Season Number" },
        { field: "Chapter Count" },
        { field: "Actions" },
    ];

    const rows = seasons?.data ?? [];
    const total = seasons?.total ?? 0;

    const navigateWithMergedQuery = (updates) => {
        const path = url.split(/[?#]/)[0];
        const qsPart = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
        const params = new URLSearchParams(qsPart);
        Object.entries(updates).forEach(([k, v]) => {
            if (v === null || v === undefined || v === "") {
                params.delete(k);
            } else {
                params.set(k, String(v));
            }
        });
        const qs = params.toString();
        router.visit(qs ? `${path}?${qs}` : path, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const applyChaptersFilter = (v) => {
        setChaptersFilter(v);
        navigateWithMergedQuery({
            season_chapters: v === "any" ? null : v,
            seasons_page: 1,
        });
    };

    useEffect(() => {
        if (document.activeElement === searchInputRef.current) return;
        setSearch(seasonFilters?.search ?? "");
    }, [seasonFilters?.search]);

    useEffect(() => {
        setChaptersFilter(normalizeChaptersMode(seasonFilters?.chapters));
    }, [seasonFilters?.chapters]);

    useEffect(() => {
        const id = setTimeout(() => {
            const applied = (seasonFilters?.search ?? "").trim();
            if (search.trim() === applied) return;
            navigateWithMergedQuery({
                season_search: search.trim() || null,
                seasons_page: 1,
            });
        }, 420);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const hasActiveFilters =
        Boolean(search.trim()) || chaptersFilter !== "any";

    const clearFilters = () => {
        setSearch("");
        setChaptersFilter("any");
        navigateWithMergedQuery({
            season_search: null,
            season_chapters: null,
            seasons_page: 1,
        });
    };

    const deleteHandler = () => {
        router.post(
            window.route("group.admin.seasons.delete", {
                season: selectedSeason,
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

    const openDelete = (season) => {
        setSelectedSeason(season);
        setIsDeleteModalOpen(true);
    };

    const emptyMessage = hasActiveFilters
        ? "No seasons match your filters."
        : "No seasons created yet.";

    return (
        <div className="min-w-0 text-white">
            <SeasonFiltersToolbar
                search={search}
                setSearch={setSearch}
                searchInputRef={searchInputRef}
                chaptersFilter={chaptersFilter}
                applyChaptersFilter={applyChaptersFilter}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {seasons.from ?? 0}–{seasons.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {seasons.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">
                            No seasons
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    rows.map((season) => (
                        <article
                            key={season.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                {seriesColumnLabel}
                            </p>
                            <p className="mt-0.5 font-semibold text-white">
                                {season?.seasonable?.name ?? "—"}
                            </p>
                            <div className="mt-3 border-t border-white/5 pt-3">
                                <p className="text-lg font-black leading-tight text-white">
                                    {season?.title}
                                </p>
                                <p className="mt-1 text-sm text-zinc-400">
                                    Season #{season?.season_number}
                                </p>
                                <p className="mt-2 text-sm text-zinc-500">
                                    <span className="font-bold text-zinc-400">
                                        Chapters:{" "}
                                    </span>
                                    {season.chapters_count}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                    Actions
                                </span>
                                <SeasonRowActions
                                    type={type}
                                    serie={serie}
                                    season={season}
                                    onDelete={openDelete}
                                />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden min-w-0 md:block">
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] shadow-lg shadow-black/40">
                    <Table datas={seasons} columns={columns}>
                        <TableData>
                            {(season) => (
                                <p className="max-w-[180px] truncate font-medium text-zinc-200">
                                    {season?.seasonable?.name ?? "—"}
                                </p>
                            )}
                        </TableData>
                        <TableData>
                            {(season) => (
                                <p className="font-medium text-white">
                                    {season?.title}
                                </p>
                            )}
                        </TableData>
                        <TableData>
                            {(season) => (
                                <span className="font-bold text-zinc-300">
                                    {season?.season_number}
                                </span>
                            )}
                        </TableData>
                        <TableData>
                            {(season) => (
                                <span className="text-sm font-semibold text-zinc-400">
                                    {season.chapters_count}
                                </span>
                            )}
                        </TableData>
                        <TableData>
                            {(season) => (
                                <SeasonRowActions
                                    type={type}
                                    serie={serie}
                                    season={season}
                                    onDelete={openDelete}
                                />
                            )}
                        </TableData>
                    </Table>
                </div>
            </div>

            <AdminPagination meta={seasons} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure want to delete this season."}
                    body={
                        "The episodes in this season will not have season."
                    }
                />
            )}
        </div>
    );
};

export default Index;
