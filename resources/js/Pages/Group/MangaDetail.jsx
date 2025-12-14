import SectionContainer from "@/Components/SectionContainer";
import UserLayout from "@/Layouts/UserLayout";
import React, { useEffect, useRef, useState } from "react";
// import Star from '../../../assets/Star';
import { formateDate } from "@/app";
import Button from "@/Components/Button";
import Heart from "@/../assets/Heart";
import Comment from "@/../assets/Comment";
import MangaCard from "@/Components/MangaCard";
import Tags from "@/Components/Tags";
import Comments from "@/Components/Comments";
import CommentForm from "@/Components/CommentForm";
import { Link, router, usePage } from "@inertiajs/react";
import Rating from "@/Components/Rating";
import Liked from "@/../assets/Liked";
import axios from "axios";
import DownArrow from "@/../assets/DownArrow";
import useOnClickOutside from "use-onclickoutside";

const MangaDetail = ({ manga, recommendedMangas, seasons }) => {
    const {
        auth: { user },
    } = usePage().props;
    const likeManga = () => {
        router.post(window.route("group.manga.like", { manga }), {
            preserveScroll: true,
            preserveState: true,
        });
    };
    const [isSeasonBoxOpen, setIsSeasonBoxOpen] = useState(false);
    const seasonBoxRef = useRef(null);
    useOnClickOutside(seasonBoxRef, function (e) {
        if (e.target.parentElement.classList.contains("seasonbox-toggle"))
            return;
        setIsSeasonBoxOpen(false);
    });
    const ratingHandler = (rating) => {
        router.post(
            window.route("group.manga.rating", { manga }),
            { rating },
            {
                preserveScroll: true,
            }
        );
    };
    const saveToCollection = () => {
        router.post(
            window.route("group.item.save", {
                collection: user.collections[0],
            }),
            {
                id: manga.id,
                type: "manga",
            }
        );
    };

    useEffect(() => {
        const createView = async () => {
            await axios.post(window.route("group.views.store"), {
                viewable_type: "manga",
                viewable_id: manga.id,
            });
        };
        createView();
    }, []);
    return (
        <>
            <SectionContainer className={"bg-black text-white"}>
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 py-10">
                    {/* Cover Image Section */}
                    <div className="md:w-[30%] shrink-0">
                        <div className="sticky top-24">
                            <div className="relative group rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
                                <img
                                    src={manga.thumbnail}
                                    className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={manga.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-[70%] space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                    {manga.name}
                                </h1>
                                <span className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/50 text-primary font-bold text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(237,100,0,0.3)]">
                                    {manga.status.name}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                <Tags tags={manga?.tags} />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="flex flex-col items-center justify-center gap-1 p-2">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Rating
                                </span>
                                <div className="flex items-center gap-1.5 text-white">
                                    <svg
                                        className="w-5 h-5 text-yellow-500 fill-yellow-500"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                    <span className="text-xl font-black">
                                        {manga?.rating}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-1 p-2 border-l border-white/10">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Views
                                </span>
                                <div className="flex items-center gap-1.5 text-white">
                                    <svg
                                        className="w-5 h-5 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    <span className="text-xl font-black">
                                        {manga?.views_count}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-1 p-2 border-l border-white/10">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Likes
                                </span>
                                <div className="flex items-center gap-1.5 text-white">
                                    <svg
                                        className="w-5 h-5 text-pink-500 fill-pink-500"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span className="text-xl font-black">
                                        {manga?.likes_count}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-1 p-2 border-l border-white/10">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Uploaded
                                </span>
                                <span className="text-sm font-bold text-white text-center">
                                    {formateDate(manga?.created_at, {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Rating */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="font-bold text-zinc-400">
                                Your Rating
                            </span>
                            <Rating ratingHandler={ratingHandler} />
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Synopsis
                            </h3>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light">
                                {manga?.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 my-8">
                    {manga?.chapters[0] && (
                        <a
                            href={manga.chapters[0].chapter_link}
                            className="flex-1 sm:flex-none"
                        >
                            <Button
                                className="!bg-primary hover:!bg-primary/90 !px-8 !py-4 !rounded-xl w-full !gap-3 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
                                text={
                                    manga?.latestWatchedChapter
                                        ? `Continue Reading Ep ${manga?.latestWatchedChapter.chapter_number}`
                                        : "Start Reading"
                                }
                                type="button"
                                Icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"
                                        />
                                    </svg>
                                }
                            />
                        </a>
                    )}

                    <Button
                        text={
                            manga.isSaveByCurrentUser
                                ? "Saved"
                                : "Add to Collection"
                        }
                        type={"button"}
                        onClick={saveToCollection}
                        className={`!px-8 !py-4 !rounded-xl !gap-2 border transition-all hover:-translate-y-1 ${
                            manga.isSaveByCurrentUser
                                ? "!bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20"
                                : "!bg-white/5 border-white/10 text-white hover:!bg-white hover:!text-black"
                        }`}
                        Icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M5 21V5q0-.825.588-1.412T7 3h6v2H7v12.95l5-2.15l5 2.15V11h2v10l-7-3zM7 5h6zm10 4V7h-2V5h2V3h2v2h2v2h-2v2z"
                                />
                            </svg>
                        }
                    />

                    <Button
                        text={manga.isLikeByCurrentUser ? "Liked" : "Like"}
                        type={"button"}
                        onClick={() => likeManga()}
                        className={`!px-8 !py-4 !rounded-xl !gap-2 border transition-all hover:-translate-y-1 ${
                            manga.isLikeByCurrentUser
                                ? "!bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20"
                                : "!bg-white/5 border-white/10 text-white hover:!bg-white hover:!text-black"
                        }`}
                        Icon={
                            <Liked
                                className={`w-5 h-5 ${
                                    manga.isLikeByCurrentUser
                                        ? "text-white"
                                        : "fill-current"
                                }`}
                            />
                        }
                    />

                    <Button
                        text={"Share"}
                        className="!bg-white/5 !px-8 !py-4 !rounded-xl !gap-2 border border-white/10 text-white hover:!bg-white hover:!text-black transition-all hover:-translate-y-1"
                        Icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363t.075-.337l-7.05-4.1q-.425.375-.95.588T6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.213t.95.587l7.05-4.1q-.05-.15-.075-.337T15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.212t-.95-.588L8.9 11.3q.05.15.075.338T9 12q0 .175-.025.363T8.9 12.7l7.05 4.1q.425-.375.95-.587T18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22"
                                />
                            </svg>
                        }
                    />
                </div>
                <div className="w-full h-px bg-white/10 my-12"></div>

                <div className="space-y-8">
                    {/* Season Selector / Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative">
                            {seasons.length ? (
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setIsSeasonBoxOpen((prev) => !prev)
                                        }
                                        className="seasonbox-toggle w-full flex items-center justify-between gap-4 px-6 py-4 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-primary/50 rounded-2xl transition-all duration-300 group shadow-lg shadow-black/20"
                                    >
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                                                Select Season
                                            </span>
                                            <div className="flex items-center gap-3 flex-wrap text-left">
                                                <span className="text-xl font-black text-white uppercase tracking-tight">
                                                    {manga?.name}
                                                </span>
                                                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                                                <span className="text-xl font-bold text-primary">
                                                    {manga.chapters.length
                                                        ? manga.chapters[0]
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
                                                            "group.manga.detail",
                                                            {
                                                                manga: manga,
                                                                season: season.season_number,
                                                            }
                                                        )}
                                                        preserveScroll={true}
                                                        className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors group/item"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-white group-hover/item:text-primary transition-colors">
                                                                {season.title}
                                                            </span>
                                                            <span className="text-xs text-zinc-500">
                                                                {manga.name}
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
                                    Chapters
                                </h2>
                            )}
                        </div>

                        {/* Chapter Count Badge */}
                        {manga?.chapters.length > 0 && (
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-zinc-400">
                                {manga.chapters.length} Chapters Available
                            </div>
                        )}
                    </div>

                    {/* Chapters Grid */}
                    <div id="chapters">
                        {manga?.chapters.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {manga?.chapters.map((chapter, i) => (
                                    <a
                                        key={i}
                                        href={
                                            user && user?.type === "free"
                                                ? chapter.ouo_chapter_link
                                                : chapter.chapter_link ||
                                                  chapter.ouo_chapter_link
                                        }
                                        className="group relative flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-zinc-500 transition-colors font-black text-sm">
                                            {chapter.chapter_number || i + 1}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">
                                                {chapter?.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                <span>
                                                    {formateDate(
                                                        chapter?.created_at
                                                    )}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    <span>
                                                        {chapter?.like_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-[#1a1a1a]/30 border border-white/5 border-dashed">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line
                                            x1="12"
                                            y1="18"
                                            x2="12"
                                            y2="18"
                                        ></line>
                                        <line
                                            x1="8"
                                            y1="12"
                                            x2="16"
                                            y2="12"
                                        ></line>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    No Chapters Yet
                                </h3>
                                <p className="text-zinc-500 text-sm">
                                    Check back later for new uploads.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer className={"bg-[#0D0D0D]"}>
                <div className="pt-16" id="comments">
                    <div className="bg-[#1a1a1a]/50 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/5 shadow-2xl shadow-black/50">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                            <h2 className="text-2xl font-black text-white tracking-wide">
                                Comments
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-bold text-zinc-400 border border-white/5">
                                {manga?.comments_count || 0}
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
                                        manga={manga}
                                        className="dark-form"
                                    />
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-8">
                                <Comments
                                    manga={manga}
                                    comments={manga?.comments}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <div>
                {recommendedMangas?.data.length > 0 && (
                    <SectionContainer
                        className=" bg-[#0D0D0D] px-10 pb-20 pt-20"
                        padding={false}
                    >
                        <h1 className="text-3xl font-extrabold text-white pb-5">
                            Recommended For You
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-8">
                            {recommendedMangas?.data.map((manga, i) => (
                                <MangaCard
                                    key={i}
                                    manga={manga}
                                    className="h-full"
                                />
                            ))}
                        </div>
                    </SectionContainer>
                )}
            </div>
        </>
    );
};

export default MangaDetail;
MangaDetail.layout = (page) => <UserLayout>{page}</UserLayout>;
