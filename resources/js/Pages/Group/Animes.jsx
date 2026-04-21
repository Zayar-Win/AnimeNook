import SectionContainer from "@/Components/SectionContainer";
import UserLayout from "@/Layouts/UserLayout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Sort from "@/../assets/Sort";
import Filter from "@/../assets/Filter";
import { Link } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import useFilter from "@/hooks/useFilter";
import axios from "axios";
import MangaCard from "@/Components/MangaCard";

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "popularity", label: "Most viewed" },
    { value: "alphabetical", label: "A–Z" },
    { value: "most_liked", label: "Most liked" },
    { value: "top_rated", label: "Highest rated" },
    { value: "most_chapters", label: "Most chapters" },
];

const Animes = ({ data, filters, tags, paginateData, statuses = [] }) => {
    const [search, setSearch] = useState(filters["search"] || "");
    const [filterTags, setFilterTags] = useState(
        filters["tags"]?.split(",") || [],
    );
    const [sort, setSort] = useState(filters["sort"] || "newest");
    const [status, setStatus] = useState(filters["status"] || "all");
    const debounceSearch = useDebounce(search, 500);
    const observer = useRef();
    const [mangas, setMangas] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const { setIsFilter, dynamicParams } = useFilter(
        { search: debounceSearch, sort, tags: filterTags, status },
        window.route("group.animes"),
    );
    const [currentPage, setCurrentPage] = useState(
        paginateData?.manga?.currentPage || 1,
    );
    const [lastPage, setLastPage] = useState(paginateData?.manga?.lastPage || 1);

    const getMoreMangas = async () => {
        const response = await axios.get(
            window.route("group.getAnimesAndMangas", {
                isApi: true,
                page: currentPage + 1,
                ...dynamicParams,
            }),
        );
        setMangas((prev) => [...prev, ...response.data.data]);
        setCurrentPage(response.data.paginateData.manga.currentPage);
        setLastPage(response.data.paginateData.manga.lastPage);
    };

    const lastRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (currentPage < lastPage && !isLoading) {
                        setIsLoading(true);
                        getMoreMangas().finally(() => setIsLoading(false));
                    }
                }
            });
            if (node) observer.current.observe(node);
        },
        [currentPage, lastPage, isLoading, dynamicParams],
    );

    useEffect(() => {
        setCurrentPage(paginateData?.manga?.currentPage || 1);
        setLastPage(paginateData?.manga?.lastPage || 1);
        setMangas(data);
    }, [data, paginateData]);

    return (
        <SectionContainer className="min-h-screen bg-white py-6 sm:py-10 dark:bg-black">
            <div className="mx-auto w-full max-w-[1600px] px-3 sm:w-[90%] sm:px-0">
                <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:mb-12 md:flex-row md:gap-6">
                    <div className="flex w-full items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-[0_0_15px_rgba(237,100,0,0.2)] sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-3 md:min-w-[380px] xl:max-w-[500px] xl:min-w-[500px] dark:border-white/10 dark:bg-[#1a1a1a]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-zinc-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setIsFilter(true);
                            }}
                            autoComplete="off"
                            id="search"
                            placeholder="Search manga..."
                            className="h-full w-full border-0 bg-transparent p-0 font-medium text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-0 dark:text-white dark:placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="flex w-full flex-wrap items-center justify-end gap-2 overflow-visible text-zinc-900 sm:gap-3 md:w-auto dark:text-white">
                        <div className="group sort relative z-40 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 transition-all hover:border-zinc-300 hover:bg-zinc-50 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 dark:border-white/10 dark:bg-[#1a1a1a] dark:hover:border-white/20 dark:hover:bg-[#252525]">
                            <div className="flex items-center gap-1.5 text-zinc-600 transition-colors group-hover:text-zinc-900 sm:gap-2 dark:text-zinc-400 dark:group-hover:text-white">
                                <Sort className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                                    Sort
                                </span>
                            </div>
                            <ul className="sort-options absolute left-0 top-[calc(100%+10px)] z-30 hidden max-h-[min(70vh,22rem)] w-[200px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-900/10 dark:border-white/10 dark:bg-[#1a1a1a] dark:shadow-black/50">
                                {SORT_OPTIONS.map((opt) => (
                                    <li
                                        key={opt.value}
                                        onClick={() => {
                                            setSort(opt.value);
                                            setIsFilter(true);
                                        }}
                                        className={`cursor-pointer rounded-lg p-3 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 ${
                                            sort === opt.value
                                                ? "bg-primary/10 text-primary"
                                                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                        }`}
                                    >
                                        {opt.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {statuses.length > 0 && (
                            <div className="status-filter group relative z-40 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 transition-all hover:border-zinc-300 hover:bg-zinc-50 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 dark:border-white/10 dark:bg-[#1a1a1a] dark:hover:border-white/20 dark:hover:bg-[#252525]">
                                <div className="flex items-center gap-1.5 text-zinc-600 transition-colors group-hover:text-zinc-900 sm:gap-2 dark:text-zinc-400 dark:group-hover:text-white">
                                    <Filter className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                                        Status
                                    </span>
                                </div>
                                <ul className="status-filter-options absolute right-0 top-[calc(100%+10px)] z-30 hidden w-[200px] max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-900/10 dark:border-white/10 dark:bg-[#1a1a1a] dark:shadow-black/50">
                                    <li
                                        onClick={() => {
                                            setStatus("all");
                                            setIsFilter(true);
                                        }}
                                        className={`cursor-pointer rounded-lg p-3 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 ${
                                            status === "all" || !status
                                                ? "bg-primary/10 text-primary"
                                                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                        }`}
                                    >
                                        All statuses
                                    </li>
                                    {statuses.map((s) => (
                                        <li
                                            key={s.id}
                                            onClick={() => {
                                                setStatus(s.keyword);
                                                setIsFilter(true);
                                            }}
                                            className={`cursor-pointer rounded-lg p-3 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 ${
                                                status === s.keyword
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                            }`}
                                        >
                                            {s.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {tags.length > 0 && (
                    <div className="mb-8 sm:mb-12">
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 sm:text-xs">
                            Genres
                        </div>
                        <div
                            className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden px-1 py-1 scroll-smooth touch-pan-x [scrollbar-width:thin] [scrollbar-color:rgb(212_212_216)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/20"
                            role="list"
                            aria-label="Genre filters"
                        >
                            {tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    role="listitem"
                                    onClick={() => {
                                        setFilterTags((prev) => {
                                            if (prev.includes(tag.name)) {
                                                return prev.filter(
                                                    (prevTag) =>
                                                        prevTag !== tag.name,
                                                );
                                            }
                                            return [...prev, tag.name];
                                        });
                                        setIsFilter(true);
                                    }}
                                    className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold transition-all duration-300 sm:px-4 sm:py-1.5 sm:text-xs ${
                                        filterTags.includes(tag.name)
                                            ? "border-primary bg-primary text-white shadow-[0_0_15px_rgba(237,100,0,0.4)]"
                                            : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-zinc-400 dark:hover:border-white/30 dark:hover:text-white"
                                    }`}
                                >
                                    {tag.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    {mangas?.length > 0 ? (
                        <div>
                            <h1 className="mb-5 flex items-center gap-2 text-xl font-black text-zinc-900 sm:mb-8 sm:gap-3 sm:text-2xl md:text-3xl dark:text-white">
                                <span className="h-6 w-1 rounded-full bg-primary sm:h-8 sm:w-1.5"></span>
                                Manga
                            </h1>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5 xl:grid-cols-5 xl:gap-6">
                                {mangas.map((manga, i) => (
                                    <div key={manga.id ?? i} className="h-full">
                                        <MangaCard manga={manga} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 py-32 dark:border-white/5 dark:bg-[#1a1a1a]/30">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-white/5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                                No manga found
                            </h3>
                            <p className="text-zinc-500">
                                Try different search, status, genres, or sort.
                            </p>
                        </div>
                    )}
                </div>
                <div ref={lastRef}></div>
            </div>
        </SectionContainer>
    );
};

export default Animes;
Animes.layout = (page) => <UserLayout>{page}</UserLayout>;
