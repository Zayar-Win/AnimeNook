import SectionContainer from "@/Components/SectionContainer";
import UserLayout from "@/Layouts/UserLayout";
import React, { useEffect, useRef, useState } from "react";
// import Star from '../../../assets/Star';
import { formateDate, mangaThumbnailUrl } from "@/app";
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
    const [synopsisExpanded, setSynopsisExpanded] = useState(false);
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
            },
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
            },
        );
    };

    const shareManga = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: manga.name, url });
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
            }
        } catch {
            /* dismissed share sheet or clipboard denied */
        }
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

    const chapterReaderHref = (chapterId) =>
        window.route("group.manga.chapter.read", {
            manga: manga.slug,
            chapter: chapterId,
        });

    const continueChapterId =
        manga?.latestWatchedChapter?.id ?? manga?.chapters?.[0]?.id;

    const synopsisText = (manga?.description ?? "").trim();
    const synopsisNeedsToggle = synopsisText.length > 200;

    const continueEp = manga?.latestWatchedChapter?.chapter_number;
    const continueReadingLabel =
        continueEp != null ? `Resume Ep ${continueEp}` : "Start Reading";
    const continueReadingTitle =
        continueEp != null
            ? `Continue reading episode ${continueEp}`
            : undefined;

    return (
        <>
            <SectionContainer className="bg-white text-zinc-900 dark:bg-black dark:text-white">
                <div className="flex flex-col gap-5 py-6 md:flex-row md:gap-8 md:py-10 lg:gap-12">
                    {/* Cover Image Section — narrow max width on mobile so 2/3 aspect does not dominate the viewport */}
                    <div className="flex w-full shrink-0 justify-center md:block md:w-[30%] md:justify-start">
                        <div className="sticky top-24 w-full max-w-[11.5rem] sm:max-w-[13.5rem] md:max-w-none">
                            <div className="relative group overflow-hidden rounded-xl shadow-2xl shadow-primary/20">
                                <img
                                    src={manga?.thumbnail || mangaThumbnailUrl}
                                    className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={manga.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-[70%] space-y-4 md:space-y-8">
                        {/* Header */}
                        <div className="space-y-2 md:space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4">
                                <h1 className="text-2xl font-black leading-tight text-zinc-900 sm:text-3xl md:text-5xl dark:text-white">
                                    {manga.name}
                                </h1>
                                <span className="shrink-0 rounded-full border border-primary/50 bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-[0_0_15px_rgba(237,100,0,0.3)] sm:px-4 sm:py-1.5 sm:text-sm">
                                    {manga.status.name}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                <Tags tags={manga?.tags} />
                            </div>
                        </div>

                        {/* Stats: one compact row on mobile; roomier from sm */}
                        <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 backdrop-blur-sm sm:gap-3 sm:rounded-2xl sm:p-5 dark:border-white/10 dark:bg-white/5">
                            <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-1 sm:gap-1 sm:p-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 sm:text-xs">
                                    Rating
                                </span>
                                <div className="flex items-center gap-1 text-zinc-900 sm:gap-1.5 dark:text-white">
                                    <svg
                                        className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500 sm:h-5 sm:w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                    <span className="text-sm font-black tabular-nums sm:text-xl">
                                        {manga?.rating}
                                    </span>
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 border-l border-zinc-200 px-0.5 py-1 sm:gap-1 sm:p-2 dark:border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 sm:text-xs">
                                    Views
                                </span>
                                <div className="flex items-center gap-1 text-zinc-900 sm:gap-1.5 dark:text-white">
                                    <svg
                                        className="h-3.5 w-3.5 shrink-0 text-blue-500 sm:h-5 sm:w-5"
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
                                    <span className="text-sm font-black tabular-nums sm:text-xl">
                                        {manga?.views_count}
                                    </span>
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 border-l border-zinc-200 px-0.5 py-1 sm:gap-1 sm:p-2 dark:border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 sm:text-xs">
                                    Likes
                                </span>
                                <div className="flex items-center gap-1 text-zinc-900 sm:gap-1.5 dark:text-white">
                                    <svg
                                        className="h-3.5 w-3.5 shrink-0 fill-pink-500 text-pink-500 sm:h-5 sm:w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span className="text-sm font-black tabular-nums sm:text-xl">
                                        {manga?.likes_count}
                                    </span>
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 border-l border-zinc-200 px-0.5 py-1 sm:gap-1 sm:p-2 dark:border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 sm:text-xs">
                                    Uploaded
                                </span>
                                <span className="text-center text-[11px] font-bold leading-tight text-zinc-900 sm:text-sm dark:text-white">
                                    {formateDate(manga?.created_at, {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Rating */}
                        <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 sm:rounded-xl sm:p-4 dark:border-white/10 dark:bg-white/5">
                            <span className="shrink-0 text-xs font-bold text-zinc-600 sm:text-base dark:text-zinc-400">
                                Your Rating
                            </span>
                            <div className="min-w-0 origin-right scale-[0.78] sm:scale-100">
                                <Rating ratingHandler={ratingHandler} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 sm:text-lg dark:text-white">
                                <span className="h-5 w-1 shrink-0 rounded-full bg-primary sm:h-6"></span>
                                Synopsis
                            </h3>
                            <p
                                className={`text-sm font-light leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300 ${
                                    synopsisNeedsToggle && !synopsisExpanded
                                        ? "line-clamp-4 sm:line-clamp-5"
                                        : ""
                                }`}
                            >
                                {synopsisText || "—"}
                            </p>
                            {synopsisNeedsToggle && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSynopsisExpanded((v) => !v)
                                    }
                                    className="text-sm font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                                >
                                    {synopsisExpanded
                                        ? "See less"
                                        : "See more…"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className={`my-6 grid gap-3 sm:my-8 sm:flex sm:flex-wrap sm:items-stretch sm:gap-4 ${
                        continueChapterId ? "grid-cols-2" : "grid-cols-3"
                    }`}
                >
                    {continueChapterId && (
                        <Button
                            href={chapterReaderHref(continueChapterId)}
                            title={continueReadingTitle}
                            className="!flex !h-full !min-h-[3rem] w-full !items-center !justify-center !gap-2 !rounded-xl !px-3 !py-3 text-sm !font-semibold !whitespace-nowrap shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 sm:!min-h-0 sm:!gap-3 sm:!px-8 sm:!py-4 sm:text-base !bg-primary hover:!bg-primary/90 sm:w-auto"
                            text={continueReadingLabel}
                            Icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 shrink-0 sm:h-6 sm:w-6"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"
                                    />
                                </svg>
                            }
                        />
                    )}

                    <Button
                        text={manga.isSavedByCurrentUser ? "Saved" : "Save"}
                        title={
                            manga.isSavedByCurrentUser
                                ? undefined
                                : "Add to your collection"
                        }
                        type={"button"}
                        onClick={saveToCollection}
                        className={`!h-full !min-h-[3rem] w-full !gap-2 !whitespace-nowrap !rounded-xl !px-3 !py-3 text-sm !font-semibold transition-all hover:-translate-y-1 sm:!px-8 sm:!py-4 sm:text-base ${
                            manga.isSavedByCurrentUser
                                ? "!bg-green-600 border border-green-500 text-white shadow-lg shadow-green-600/20"
                                : "!border !border-zinc-300 !bg-white !text-zinc-900 hover:!bg-zinc-100 dark:!border-white/10 dark:!bg-white/5 dark:!text-white dark:hover:!bg-white dark:hover:!text-black"
                        }`}
                        Icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 shrink-0"
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
                        className={`!h-full !min-h-[3rem] w-full !gap-2 !whitespace-nowrap !rounded-xl !px-3 !py-3 text-sm !font-semibold transition-all hover:-translate-y-1 sm:!px-8 sm:!py-4 sm:text-base ${
                            manga.isLikeByCurrentUser
                                ? "!bg-pink-600 border border-pink-500 text-white shadow-lg shadow-pink-600/20"
                                : "!border !border-zinc-300 !bg-white !text-zinc-900 hover:!bg-zinc-100 dark:!border-white/10 dark:!bg-white/5 dark:!text-white dark:hover:!bg-white dark:hover:!text-black"
                        }`}
                        Icon={
                            <Liked
                                className={`h-5 w-5 shrink-0 ${
                                    manga.isLikeByCurrentUser
                                        ? "text-white"
                                        : "fill-current text-zinc-700 dark:text-white"
                                }`}
                            />
                        }
                    />

                    <Button
                        text={"Share"}
                        type="button"
                        onClick={shareManga}
                        className="!h-full !min-h-[3rem] w-full !gap-2 !whitespace-nowrap !rounded-xl !border !border-zinc-300 !bg-white !px-3 !py-3 text-sm !font-semibold !text-zinc-900 transition-all hover:-translate-y-1 hover:!bg-zinc-100 sm:!px-8 sm:!py-4 sm:text-base dark:!border-white/10 dark:!bg-white/5 dark:!text-white dark:hover:!bg-white dark:hover:!text-black"
                        Icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 shrink-0"
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
                <div className="my-12 h-px w-full bg-zinc-200 dark:bg-white/10"></div>

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
                                        className="seasonbox-toggle group flex w-full items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4 shadow-lg shadow-zinc-900/5 transition-all duration-300 hover:border-primary/50 hover:bg-zinc-100 dark:border-white/10 dark:bg-[#1a1a1a] dark:shadow-black/20 dark:hover:bg-[#252525]"
                                    >
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                                                Select Season
                                            </span>
                                            <div className="flex items-center gap-3 flex-wrap text-left">
                                                <span className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                                    {manga?.name}
                                                </span>
                                                <span className="hidden h-1.5 w-1.5 rounded-full bg-zinc-300 sm:block dark:bg-zinc-700"></span>
                                                <span className="text-xl font-bold text-primary">
                                                    {manga.chapters.length
                                                        ? manga.chapters[0]
                                                              .season.title
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`shrink-0 rounded-full bg-zinc-200 p-2.5 text-zinc-600 transition-all duration-300 group-hover:bg-primary group-hover:text-white dark:bg-white/5 dark:text-zinc-400 ${
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
                                        className={`absolute left-0 top-[calc(100%+10px)] z-30 min-w-[320px] max-w-[90vw] origin-top-left overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#1a1a1a] ${
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
                                                            },
                                                        )}
                                                        preserveScroll={true}
                                                        className="group/item flex items-center justify-between px-5 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-zinc-900 transition-colors group-hover/item:text-primary dark:text-white">
                                                                {season.title}
                                                            </span>
                                                            <span className="text-xs text-zinc-500">
                                                                {manga.name}
                                                            </span>
                                                        </div>
                                                        <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
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
                                <h2 className="text-2xl font-black uppercase tracking-wide text-zinc-900 dark:text-white">
                                    Chapters
                                </h2>
                            )}
                        </div>

                        {/* Chapter Count Badge */}
                        {manga?.chapters.length > 0 && (
                            <div className="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-1.5 text-sm font-bold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                                {manga.chapters.length} Chapters Available
                            </div>
                        )}
                    </div>

                    {/* Chapters Grid */}
                    <div id="chapters">
                        {manga?.chapters.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {manga?.chapters.map((chapter, i) => (
                                    <Link
                                        key={i}
                                        href={chapterReaderHref(chapter.id)}
                                        className="group relative flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-zinc-50 dark:border-white/5 dark:bg-[#1a1a1a] dark:hover:bg-[#252525]"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-black text-zinc-600 transition-colors group-hover:bg-primary group-hover:text-white dark:bg-white/5 dark:text-zinc-500">
                                            {chapter.chapter_number || i + 1}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <h3 className="truncate font-bold text-zinc-900 transition-colors group-hover:text-primary dark:text-white">
                                                {chapter?.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                <span>
                                                    {formateDate(
                                                        chapter?.created_at,
                                                    )}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
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
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-white/5 dark:bg-[#1a1a1a]/30">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-white/5">
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
                                <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">
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
            <SectionContainer className="bg-white dark:bg-[#0D0D0D]">
                <div className="pt-16" id="comments">
                    <div className="rounded-3xl border border-zinc-200 bg-zinc-50/80 py-5 px-2 shadow-xl shadow-zinc-900/5 backdrop-blur-md md:p-5 dark:border-white/5 dark:bg-[#1a1a1a]/50 dark:shadow-black/50">
                        {/* Header */}
                        <div className="mb-10 flex items-center gap-4 border-b border-zinc-200 pb-6 dark:border-white/5">
                            <h2 className="text-2xl font-black tracking-wide text-zinc-900 dark:text-white">
                                Comments
                            </h2>
                            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-600 dark:border-white/5 dark:bg-white/10 dark:text-zinc-400">
                                {manga?.comments_count || 0}
                            </span>
                        </div>

                        <div className="lg:w-[90%] w-full mx-auto">
                            {/* Comment Form Area */}
                            <div className="flex gap-6 mb-12">
                                <div className="shrink-0 hidden sm:block">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-zinc-200 dark:ring-white/10"
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
                                        className="comment-quill"
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
                        className="bg-white px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-20 dark:bg-[#0D0D0D]"
                        padding={false}
                    >
                        <h1 className="pb-5 text-3xl font-extrabold text-zinc-900 dark:text-white">
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
