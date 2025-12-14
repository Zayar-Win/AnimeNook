import SectionContainer from "@/Components/SectionContainer";
import UserLayout from "@/Layouts/UserLayout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Sort from "@/../assets/Sort";
import Filter from "@/../assets/Filter";
import Tags from "@/Components/Tags";
import { format } from "timeago.js";
import { Link } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import useFilter from "@/hooks/useFilter";
import axios from "axios";
import MangaCard from "@/Components/MangaCard";
import MovieCard from "@/Components/MovieCard";

const Animes = ({ data, filters, tags, paginateData }) => {
    const [search, setSearch] = useState(filters["search"] || "");
    const [filterTags, setFilterTags] = useState(
        filters["tags"]?.split(",") || []
    );
    const [sort, setSort] = useState(filters["sort"] || "newest");
    const [filter, setFilter] = useState(filters["filter"] || "all");
    const debounceSearch = useDebounce(search, 500);
    const observer = useRef();
    const [animesAndMangas, setAnimesAndMangas] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const { setIsFilter, dynamicParams } = useFilter(
        { search: debounceSearch, sort, filter, tags: filterTags },
        window.route("group.animes")
    );
    const [mangaCurrentPage, setMangaCurrentPage] = useState(
        paginateData?.manga?.currentPage || 1
    );
    const [animeCurrentPage, setAnimeCurrentPage] = useState(
        paginateData?.anime?.currentPage || 1
    );
    const [mangaLastPage] = useState(paginateData?.manga?.lastPage);
    const [animeLastPage] = useState(paginateData?.anime?.lastPage);
    const getAnimesAndMangas = async () => {
        const response = await axios.get(
            window.route("group.getAnimesAndMangas", {
                isApi: true,
                animepage: animeCurrentPage + 1,
                mangapage: mangaCurrentPage + 1,
                ...dynamicParams,
            })
        );
        setAnimesAndMangas((prev) => [...prev, ...response.data.data]);
        setAnimeCurrentPage(response.data.paginateData.anime.currentPage);
        setMangaCurrentPage(response.data.paginateData.anime.currentPage);
    };
    const lastRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (
                        (animeCurrentPage < animeLastPage ||
                            mangaCurrentPage < mangaLastPage) &&
                        !isLoading
                    ) {
                        setIsLoading(true);
                        getAnimesAndMangas();
                        setIsLoading(false);
                    }
                }
            });
            if (node) observer.current.observe(node);
        },
        [animeCurrentPage, mangaCurrentPage, isLoading]
    );
    useEffect(() => {
        setAnimeCurrentPage(1);
        setMangaCurrentPage(1);
        setAnimesAndMangas(data);
    }, [data]);
    return (
        <SectionContainer className={"bg-black min-h-screen py-10"}>
            <div className="w-[90%] mx-auto">
                {/* Search & Filter Header */}
                <div className="flex md:flex-row flex-col gap-6 mb-12 items-center justify-between">
                    <div className="flex items-center relative gap-3 px-5 py-3 xl:max-w-[500px] xl:min-w-[500px] md:min-w-[380px] w-full bg-[#1a1a1a] rounded-2xl border border-white/10 focus-within:border-primary/50 focus-within:shadow-[0_0_15px_rgba(237,100,0,0.2)] transition-all duration-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-zinc-500"
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
                            placeholder="Search Anime & Manga..."
                            className="bg-transparent text-white p-0 w-full h-full border-0 focus:ring-0 outline-none placeholder:text-zinc-600 font-medium"
                        />
                    </div>

                    <div className="flex items-center w-full md:w-auto md:justify-end justify-between gap-4 text-white">
                        <div className="group relative sort items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl hover:bg-[#252525] hover:border-white/20 transition-all cursor-pointer">
                            <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
                                <Sort className="w-5 h-5" />
                                <span className="uppercase font-bold text-xs tracking-wider">
                                    Sort By
                                </span>
                            </div>
                            <ul className="absolute w-[180px] sort-options z-30 hidden top-[calc(100%+10px)] right-0 p-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50">
                                <li
                                    onClick={() => {
                                        setSort("popularity");
                                        setIsFilter(true);
                                    }}
                                    className={`p-3 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-medium transition-colors ${
                                        sort === "popularity"
                                            ? "text-primary bg-primary/10"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    Popularity
                                </li>
                                <li
                                    onClick={() => {
                                        setSort("newest");
                                        setIsFilter(true);
                                    }}
                                    className={`p-3 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-medium transition-colors ${
                                        sort === "newest"
                                            ? "text-primary bg-primary/10"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    Newest
                                </li>
                            </ul>
                        </div>

                        <div className="group relative filter items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl hover:bg-[#252525] hover:border-white/20 transition-all cursor-pointer">
                            <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
                                <Filter className="w-5 h-5" />
                                <span className="uppercase font-bold text-xs tracking-wider">
                                    Filter
                                </span>
                            </div>
                            <ul className="absolute w-[180px] filter-options z-30 hidden top-[calc(100%+10px)] right-0 p-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50">
                                <li
                                    onClick={() => {
                                        setFilter("all");
                                        setIsFilter(true);
                                    }}
                                    className={`p-3 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-medium transition-colors ${
                                        filter === "all"
                                            ? "text-primary bg-primary/10"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    All
                                </li>
                                <li
                                    onClick={() => {
                                        setFilter("animes");
                                        setIsFilter(true);
                                    }}
                                    className={`p-3 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-medium transition-colors ${
                                        filter === "animes"
                                            ? "text-primary bg-primary/10"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    Animes Only
                                </li>
                                <li
                                    onClick={() => {
                                        setFilter("mangas");
                                        setIsFilter(true);
                                    }}
                                    className={`p-3 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-medium transition-colors ${
                                        filter === "mangas"
                                            ? "text-primary bg-primary/10"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    Mangas Only
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Tags Filter */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-12">
                        <div className="w-full text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
                            Filter by Genres
                        </div>
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                onClick={() => {
                                    setFilterTags((prev) => {
                                        if (prev.includes(tag.name)) {
                                            return prev.filter(
                                                (prevTag) =>
                                                    prevTag !== tag.name
                                            );
                                        } else {
                                            return [...prev, tag.name];
                                        }
                                    });
                                    setIsFilter(true);
                                }}
                                className={`shrink-0 cursor-pointer px-4 py-1.5 rounded-full border text-xs font-bold transition-all duration-300 ${
                                    filterTags.includes(tag.name)
                                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(237,100,0,0.4)]"
                                        : "bg-[#1a1a1a] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
                                }`}
                            >
                                {tag.name}
                            </div>
                        ))}
                    </div>
                )}

                {/* Content Grid */}
                <div>
                    {animesAndMangas?.length > 0 ? (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                                Browse Content
                            </h1>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                {animesAndMangas?.map((data, i) =>
                                    data.type === "anime" ? (
                                        <div key={i} className="h-full">
                                            <MovieCard anime={data} />
                                        </div>
                                    ) : (
                                        <div key={i} className="h-full">
                                            <MangaCard manga={data} />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 rounded-3xl bg-[#1a1a1a]/30 border border-white/5 border-dashed">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-zinc-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-10 h-10"
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
                            <h3 className="text-2xl font-bold text-white mb-2">
                                No Results Found
                            </h3>
                            <p className="text-zinc-500">
                                Try adjusting your search or filters to find
                                what you're looking for.
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
