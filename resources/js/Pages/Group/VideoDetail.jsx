import SectionContainer from "@/Components/SectionContainer";
import UserLayout from "@/Layouts/UserLayout";
import React, { useEffect, useRef, useState } from "react";
import Share from "@/../assets/Share";
import Tags from "@/Components/Tags";
// import Star from '@/../assets/Star';
import Button from "@/Components/Button";
import BookMark from "@/../assets/BookMark";
import Pause from "@/../assets/Pause";
import { Link, router, usePage } from "@inertiajs/react";
import Comments from "@/Components/Comments";
import Liked from "@/../assets/Liked";
import CommentForm from "@/Components/CommentForm";
import Rating from "@/Components/Rating";
import { getQueryParam } from "@/helpers/getQueryParams";
import Saved from "@/../assets/Saved";
import axios from "axios";
import DownArrow from "@/../assets/DownArrow";
import useOnClickOutside from "use-onclickoutside";

const VideoDetail = ({ anime, seasons }) => {
    const {
        props: {
            auth: { user },
        },
        url,
    } = usePage();
    const [isSeasonBoxOpen, setIsSeasonBoxOpen] = useState(false);
    const seasonBoxRef = useRef(null);
    useOnClickOutside(seasonBoxRef, function (e) {
        if (e.target.parentElement.classList.contains("seasonbox-toggle"))
            return;
        setIsSeasonBoxOpen(false);
    });
    // const [isFirst,setIsFirst]  = useState(true);
    const likeAnime = () => {
        router.post(
            window.route("group.anime.like", { anime }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };
    const ratingHandler = (rating) => {
        router.post(
            window.route("group.anime.rating", { anime }),
            { rating },
            {
                preserveScroll: true,
            }
        );
    };
    const saveToWatchList = () => {
        if (!user) {
            return router.get(window.route("group.login"));
        }
        router.post(
            window.route("group.item.save", {
                collection: user?.collections[0],
            }),
            {
                id: anime.id,
                type: "anime",
            },
            {
                preserveScroll: true,
            }
        );
    };
    useEffect(() => {
        const scrollTo = getQueryParam(url, "scrollTo");
        if (scrollTo) {
            document.getElementById(scrollTo).scrollIntoView({
                behavior: "smooth",
            });
        }
    }, []);

    useEffect(() => {
        const createView = async () => {
            await axios.post(window.route("group.views.store"), {
                viewable_type: "anime",
                viewable_id: anime.id,
            });
        };
        createView();
    }, []);
    return (
        <>
            <div className="md:h-[350px] xs:h-[260px] h-[200px] relative ">
                <div className="absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.7)]"></div>
                <div
                    className="blur-sm h-full w-full bg-cover bg-no-repeat opacity-50"
                    style={{
                        backgroundPosition: "center",
                        backgroundImage: `url(${anime.thumbnail})`,
                    }}
                ></div>
                <div className="left-[50%] top-0 z-10 translate-x-[-50%] absolute h-full xl:w-[30%] lg:w-[40%]  md:w-[50%] w-[60%]">
                    <img
                        src={anime?.thumbnail}
                        className="w-full h-full object-cover"
                        alt=""
                    />
                </div>
            </div>
            <SectionContainer className={"bg-black text-white"}>
                <div className="xl:w-[80%] lg:w-[90%] w-[98%] py-10 mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                        {/* Info Section - Spans 8 columns */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-sm">
                                    {anime?.name}
                                </h1>
                                <div className="shrink-0 pt-2">
                                    <Share />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {anime?.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-zinc-300 transition-colors cursor-default"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                                {/* Rating Component */}
                                <div className="flex items-center gap-4 px-5 py-2 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                                            Rate
                                        </span>
                                        <Rating ratingHandler={ratingHandler} />
                                    </div>

                                    <div className="w-px h-8 bg-white/10"></div>

                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                                            Score
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-white font-bold text-lg leading-none">
                                                {anime?.rating}
                                            </span>
                                            <span className="text-zinc-600 text-xs">
                                                /5
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-px h-8 bg-white/10"></div>

                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                                            Reviews
                                        </span>
                                        <span className="text-white font-bold text-lg leading-none">
                                            {anime?.ratings_count}
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="hidden sm:block w-px h-8 bg-white/10"></div>

                                {/* Stats */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-default text-zinc-400 hover:text-white">
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
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            ></circle>
                                        </svg>
                                        <span className="text-sm font-medium">
                                            {anime?.views_count}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-default text-zinc-400 hover:text-pink-500">
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
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                        <span className="text-sm font-medium">
                                            {anime?.likes_count}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    text={
                                        anime.isSavedByCurrentUser
                                            ? "Saved"
                                            : "Add to Watchlist"
                                    }
                                    type={"button"}
                                    onClick={() => saveToWatchList()}
                                    className={`!px-6 !py-3 !rounded-xl !text-sm !font-bold transition-all hover:-translate-y-1 ${
                                        anime.isSavedByCurrentUser
                                            ? "!bg-primary !text-white hover:!bg-primary/90"
                                            : "!bg-white/10 !text-white hover:!bg-white hover:!text-black"
                                    }`}
                                    Icon={
                                        anime.isSavedByCurrentUser ? (
                                            <Saved />
                                        ) : (
                                            <BookMark />
                                        )
                                    }
                                />
                                <Button
                                    text={
                                        anime?.isLikeByCurrentUser
                                            ? "Liked"
                                            : "Like"
                                    }
                                    type={"button"}
                                    onClick={() => likeAnime()}
                                    className={`!px-6 !py-3 !rounded-xl !text-sm !font-bold transition-all hover:-translate-y-1 ${
                                        anime?.isLikeByCurrentUser
                                            ? "!bg-pink-600 !text-white hover:!bg-pink-700"
                                            : "!bg-white/10 !text-white hover:!bg-white hover:!text-black"
                                    }`}
                                    Icon={
                                        <Liked
                                            className={`w-5 h-5 ${
                                                anime?.isLikeByCurrentUser
                                                    ? "text-white"
                                                    : "currentColor"
                                            }`}
                                        />
                                    }
                                />
                            </div>

                            {/* Description */}
                            <div className="prose prose-invert max-w-none">
                                <p className="text-zinc-400 text-lg leading-relaxed">
                                    {anime?.description}
                                </p>
                            </div>
                        </div>

                        {/* Media Section - Spans 4 columns */}
                        <div className="lg:col-span-4">
                            {anime?.chapters[0] && (
                                <div className="sticky top-24">
                                    <div className="group relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                                        {/* Thumbnail */}
                                        <img
                                            src={
                                                anime?.chapters[0]?.thumbnail ??
                                                anime?.thumbnail
                                            }
                                            className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                                            alt="Episode 1 Thumbnail"
                                        />

                                        {/* Play Overlay */}
                                        <a
                                            href={
                                                anime?.chapters[0]?.chapter_link
                                            }
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors"
                                        >
                                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/90 text-white shadow-lg shadow-primary/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary">
                                                <Pause />
                                            </div>
                                        </a>

                                        {/* Episode Label */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">
                                                Start Watching
                                            </span>
                                            <h3 className="text-white font-bold truncate">
                                                Episode 1
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-12 space-y-8">
                        {/* Section Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="relative">
                                {seasons.length ? (
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setIsSeasonBoxOpen(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="seasonbox-toggle w-full flex items-center justify-between gap-4 px-6 py-4 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-primary/50 rounded-2xl transition-all duration-300 group shadow-lg shadow-black/20"
                                        >
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                                                    Select Season
                                                </span>
                                                <div className="flex items-center gap-3 flex-wrap text-left">
                                                    <span className="text-xl font-black text-white uppercase tracking-tight">
                                                        {anime?.name}
                                                    </span>
                                                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                                                    <span className="text-xl font-bold text-primary">
                                                        {anime.chapters.length
                                                            ? anime.chapters[0]
                                                                  .season.title
                                                            : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`shrink-0 p-2.5 rounded-full bg-white/5 group-hover:bg-primary group-hover:text-white text-zinc-400 transition-all duration-300 ${
                                                    isSeasonBoxOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            >
                                                <DownArrow className="w-5 h-5" />
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div
                                            ref={seasonBoxRef}
                                            className={`absolute left-0 top-[calc(100%+10px)] min-w-[320px] max-w-[90vw] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden transition-all duration-300 origin-top-left ${
                                                isSeasonBoxOpen
                                                    ? "opacity-100 scale-100 visible"
                                                    : "opacity-0 scale-95 invisible"
                                            }`}
                                        >
                                            <ul className="py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {seasons.map((season) => (
                                                    <li key={season.id}>
                                                        <Link
                                                            href={window.route(
                                                                "group.anime.detail",
                                                                {
                                                                    anime: anime,
                                                                    season: season.season_number,
                                                                }
                                                            )}
                                                            preserveScroll={
                                                                true
                                                            }
                                                            className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors group/item"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-white group-hover/item:text-primary transition-colors">
                                                                    {
                                                                        season.title
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-zinc-500">
                                                                    {anime.name}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-zinc-400">
                                                                {
                                                                    season.chapters_count
                                                                }{" "}
                                                                EPS
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <h2 className="text-2xl font-black uppercase tracking-wide text-white">
                                        Episodes
                                    </h2>
                                )}
                            </div>

                            {/* Episode Count Badge */}
                            {anime?.chapters.length > 0 && (
                                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-zinc-400">
                                    {anime.chapters.length} Episodes Available
                                </div>
                            )}
                        </div>

                        {/* Episodes Grid */}
                        <div id="chapters">
                            {anime?.chapters.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {anime?.chapters?.map((chapter, i) => (
                                        <a
                                            href={
                                                user && user?.type === "free"
                                                    ? chapter.ouo_chapter_link
                                                    : chapter.chapter_link ||
                                                      chapter.ouo_chapter_link
                                            }
                                            key={i}
                                            className="group flex flex-col gap-3 p-3 rounded-2xl bg-[#1a1a1a]/50 hover:bg-[#252525] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            {/* Thumbnail Container */}
                                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                                                <img
                                                    src={
                                                        chapter?.thumbnail ??
                                                        anime?.thumbnail
                                                    }
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={chapter?.title}
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                        <Pause className="w-5 h-5" />
                                                    </div>
                                                </div>

                                                {/* Episode Number Badge (if available in title or logic) */}
                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-[10px] font-bold text-white">
                                                    EP {i + 1}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col gap-1 px-1">
                                                <h3 className="font-bold text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                    {chapter?.title}
                                                </h3>
                                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                    {anime?.name}
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-[#1a1a1a]/30 border border-white/5 border-dashed">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="2"
                                                y="2"
                                                width="20"
                                                height="20"
                                                rx="2.18"
                                                ry="2.18"
                                            ></rect>
                                            <line
                                                x1="7"
                                                y1="2"
                                                x2="7"
                                                y2="22"
                                            ></line>
                                            <line
                                                x1="17"
                                                y1="2"
                                                x2="17"
                                                y2="22"
                                            ></line>
                                            <line
                                                x1="2"
                                                y1="12"
                                                x2="22"
                                                y2="12"
                                            ></line>
                                            <line
                                                x1="2"
                                                y1="7"
                                                x2="7"
                                                y2="7"
                                            ></line>
                                            <line
                                                x1="2"
                                                y1="17"
                                                x2="7"
                                                y2="17"
                                            ></line>
                                            <line
                                                x1="17"
                                                y1="17"
                                                x2="22"
                                                y2="17"
                                            ></line>
                                            <line
                                                x1="17"
                                                y1="7"
                                                x2="22"
                                                y2="7"
                                            ></line>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        No Episodes Yet
                                    </h3>
                                    <p className="text-zinc-500 text-sm">
                                        Check back later for new uploads.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-16" id="comments">
                        <div className="bg-[#1a1a1a]/50 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/5 shadow-2xl shadow-black/50">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                                <h2 className="text-2xl font-black text-white tracking-wide">
                                    Comments
                                </h2>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-bold text-zinc-400 border border-white/5">
                                    {anime?.comments_count}
                                </span>
                            </div>

                            <div className="lg:w-[90%] w-full mx-auto">
                                {/* Comment Form Area */}
                                <div className="flex gap-6 mb-12">
                                    <div className="shrink-0 hidden sm:block">
                                        <img
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 shadow-lg"
                                            src={
                                                user?.profile_picture ||
                                                "https://ui-avatars.com/api/?name=Guest&background=random"
                                            }
                                            alt="User"
                                        />
                                    </div>
                                    <div className="grow">
                                        <CommentForm
                                            anime={anime}
                                            className="dark-form"
                                        />
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-8">
                                    <Comments
                                        anime={anime}
                                        comments={anime?.comments}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </>
    );
};

export default VideoDetail;

VideoDetail.layout = (page) => <UserLayout>{page}</UserLayout>;
