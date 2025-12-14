import Button from "@/Components/Button";
import MangaCard from "@/Components/MangaCard";
import MovieCard from "@/Components/MovieCard";
import NewEpisodeCard from "@/Components/NewEpisodeCard";
import SectionContainer from "@/Components/SectionContainer";
// import Tag from '@/Components/Tag'
import { Link, router, useForm } from "@inertiajs/react";
import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import Carousel from "@/Components/Carousel/Index";
import { SwiperSlide } from "swiper/react";
import Tag from "@/Components/Tag";
import Pause from "@/../assets/Pause";
import { usePage } from "@inertiajs/react";

function Index({
    banners,
    newAnimes,
    recommendedAnime,
    continueWatchingAnimes,
    popularAnimes,
    popularMangas,
    newEpisodes,
    trendAnimes,
}) {
    const {
        auth: { user },
    } = usePage().props;
    const saveToWatchList = (anime) => {
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

    const { data, setData, post, reset } = useForm({
        email: "",
    });
    return (
        <>
            <SectionContainer>
                <div className="flex mt-[30px] xl:flex-row flex-col items-stretch">
                    <div className="xl:w-[70%] w-full">
                        <div className="flex items-center mb-4 text-yellow-400 gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 20 20"
                            >
                                <g fill="none">
                                    <path
                                        stroke="currentColor"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6.999 7.57L9 1l2.002 6.571L17 9.764l-5.952 2.364L9 19l-2.048-6.872L1 9.764L6.999 7.57Z"
                                    />
                                    <path
                                        fill="currentColor"
                                        stroke="currentColor"
                                        d="M17.085 13.574A.084.084 0 0 0 17 13.5a.084.084 0 0 0-.085.074c-.199 1.994-.345 2.577-2.338 2.765a.083.083 0 0 0-.077.082c0 .043.033.078.077.082c1.965.185 2.136.896 2.338 2.923A.085.085 0 0 0 17 19.5c.044 0 .08-.032.085-.074c.202-2.027.372-2.738 2.338-2.923a.083.083 0 0 0 .077-.082a.083.083 0 0 0-.077-.082c-1.993-.188-2.14-.77-2.338-2.765Z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M9 20c-.44 0-.83-.29-.96-.71l-1.91-6.41l-5.5-2.19c-.38-.15-.63-.52-.63-.94c0-.42.27-.78.66-.93L6.19 6.8L8.04.71C8.17.29 8.56 0 9 0c.44 0 .83.29.96.71l1.86 6.09l5.53 2.02c.39.14.65.51.66.93c.01.42-.25.79-.63.94l-5.5 2.18l-1.91 6.41c-.13.42-.52.71-.96.71L9 20ZM3.81 9.8l3.51 1.4c.28.11.5.35.59.64L9 15.5l1.09-3.66c.09-.29.3-.53.59-.64l3.51-1.4l-3.54-1.29c-.29-.11-.52-.35-.61-.65L9 4.43L7.96 7.86c-.09.3-.32.54-.61.65L3.81 9.8ZM17 20c-.3 0-.55-.23-.58-.53c-.2-1.95-.28-2.32-1.89-2.47a.585.585 0 0 1-.53-.58c0-.3.23-.55.53-.58c1.61-.15 1.7-.4 1.89-2.32a.585.585 0 0 1 1.16 0c.19 1.92.28 2.17 1.89 2.32c.3.03.53.28.53.58c0 .3-.22.55-.52.58c-1.61.15-1.7.52-1.9 2.47c-.03.3-.28.52-.58.52V20Z"
                                    />
                                </g>
                            </svg>
                            <p className="font-semibold">News</p>
                        </div>
                        <div className="h-[500px] lg:h-[650px] relative group rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                            <Carousel id={"banner-swiper"}>
                                {banners?.map((banner, i) => (
                                    <SwiperSlide
                                        key={i}
                                        className="w-full h-full"
                                    >
                                        <div className="relative w-full h-full">
                                            {/* Background Image */}
                                            <div className="absolute inset-0">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={
                                                        banner?.bannerable
                                                            ?.background_image
                                                    }
                                                    alt={
                                                        banner?.bannerable?.name
                                                    }
                                                />
                                                {/* Modern Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-4xl">
                                                <div className="space-y-6 animate-fade-in-up">
                                                    {/* Tags */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg shadow-primary/20">
                                                            Featured
                                                        </span>
                                                        {banner?.bannerable?.tags
                                                            ?.slice(0, 3)
                                                            .map((tag, i) => (
                                                                <Tag
                                                                    key={i}
                                                                    tag={tag}
                                                                    className="!bg-white/10 !border-white/10 !text-zinc-200 hover:!bg-white/20 transition-colors"
                                                                />
                                                            ))}
                                                    </div>

                                                    {/* Title */}
                                                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight drop-shadow-lg line-clamp-2">
                                                        {
                                                            banner?.bannerable
                                                                ?.name
                                                        }
                                                    </h1>

                                                    {/* Info Row */}
                                                    <div className="flex items-center gap-6 text-sm sm:text-base font-medium text-zinc-300">
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                className="text-primary"
                                                            >
                                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                                                            </svg>
                                                            <span className="text-white">
                                                                {
                                                                    banner
                                                                        ?.bannerable
                                                                        ?.totalChaptersCount
                                                                }{" "}
                                                                Episodes
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                className="text-yellow-400"
                                                            >
                                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
                                                            </svg>
                                                            <span>
                                                                {banner
                                                                    ?.bannerable
                                                                    ?.rating ||
                                                                    "4.8"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-zinc-400 text-base sm:text-lg leading-relaxed line-clamp-3 max-w-2xl">
                                                        {
                                                            banner?.bannerable
                                                                .description
                                                        }
                                                    </p>

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap gap-4 pt-4">
                                                        <Button
                                                            text="Watch Now"
                                                            className="!bg-primary hover:!bg-primary/90 !text-white !px-8 !py-4 !rounded-xl !text-base !font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                                                            href={window.route(
                                                                "group.anime.detail",
                                                                {
                                                                    anime: banner?.bannerable,
                                                                }
                                                            )}
                                                            Icon={
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                >
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            }
                                                        />
                                                        <Link
                                                            href={window.route(
                                                                "group.anime.detail",
                                                                {
                                                                    anime: banner?.bannerable,
                                                                }
                                                            )}
                                                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold backdrop-blur-sm transition-all hover:-translate-y-1"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                ></circle>
                                                                <line
                                                                    x1="12"
                                                                    y1="16"
                                                                    x2="12"
                                                                    y2="12"
                                                                ></line>
                                                                <line
                                                                    x1="12"
                                                                    y1="8"
                                                                    x2="12.01"
                                                                    y2="8"
                                                                ></line>
                                                            </svg>
                                                            <span>
                                                                More Info
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                    <div className="xl:w-[30%] w-full xl:ml-4 xl:mt-0 mt-10 flex flex-col">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                                <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wide">
                                    Top Airing
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                            </div>
                        </div>
                        <div className="bg-[#0D0D0D] rounded-xl flex flex-col gap-2 p-3 text-white overflow-y-auto custom-scrollbar flex-1 h-[500px] xl:h-auto">
                            {newAnimes?.map((anime, i) => (
                                <Link
                                    key={i}
                                    href={window.route("group.anime.detail", {
                                        anime,
                                    })}
                                    className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
                                >
                                    {/* Ranking Number */}
                                    <span
                                        className={`text-3xl font-black italic w-8 shrink-0 transition-colors ${
                                            i < 3
                                                ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                                                : "text-zinc-700 group-hover:text-zinc-500"
                                        }`}
                                    >
                                        {i + 1}
                                    </span>

                                    {/* Image Container */}
                                    <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/50 transition-all shadow-md">
                                        <img
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            src={anime?.thumbnail}
                                            alt={anime?.name}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow min-w-0 justify-center">
                                        <h3 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-primary transition-colors">
                                            {anime?.name}
                                        </h3>

                                        <div className="flex items-center gap-4 mt-1 text-[11px] font-medium text-gray-500">
                                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    className="text-gray-400"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z"
                                                    />
                                                </svg>
                                                <span>
                                                    {anime?.views_count}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="10"
                                                    height="10"
                                                    viewBox="0 0 24 24"
                                                    className="text-primary"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.688T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3Zm0-6.825Z"
                                                    />
                                                </svg>
                                                <span>
                                                    {anime?.likes_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow Action */}
                                    <div className="text-gray-600 group-hover:text-white transition-colors">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                {recommendedAnime ? (
                    <div className="relative overflow-hidden rounded-3xl my-6 md:my-20 group">
                        {/* Background with Gradient */}
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 100%), url(${recommendedAnime?.background_image})`,
                            }}
                        />

                        <div className="relative z-10 flex md:flex-row flex-col-reverse items-center justify-between p-6 md:p-12 lg:p-16 gap-6 md:gap-10">
                            {/* Left Content */}
                            <div className="flex-1 max-w-2xl text-white space-y-4 md:space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Recommended
                                </div>

                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-2xl">
                                    {recommendedAnime?.name}
                                </h1>

                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    {recommendedAnime?.tags.map((tag, i) => (
                                        <Link
                                            key={i}
                                            href={window.route("group.animes", {
                                                tags: tag.name,
                                            })}
                                            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all hover:scale-105"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                                    <Button
                                        text="Watch Now"
                                        className="!bg-primary hover:!bg-primary/90 !px-8 !py-3 !rounded-xl !text-white !font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all"
                                        href={window.route(
                                            "group.anime.detail",
                                            {
                                                anime: recommendedAnime,
                                            }
                                        )}
                                        Icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        }
                                    />
                                    <Link
                                        href={window.route(
                                            "group.anime.detail",
                                            {
                                                anime: recommendedAnime,
                                            }
                                        )}
                                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold backdrop-blur-sm transition-all hover:-translate-y-1"
                                    >
                                        <span>Details</span>
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
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Right Character Image */}
                            <div className="relative w-full max-w-[300px] md:max-w-[400px] h-[250px] md:h-[400px] flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
                                <img
                                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float"
                                    src={
                                        recommendedAnime?.transparent_background
                                    }
                                    alt={recommendedAnime?.name}
                                />
                            </div>
                        </div>
                    </div>
                ) : null}
            </SectionContainer>
            <SectionContainer>
                <div className="mt-5">
                    <div className="flex items-center gap-4 text-yellow-400 font-semibold">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 15 15"
                        >
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M0 7.5a7.5 7.5 0 1 1 6.965 7.481l.053-.998l.49.017a6.5 6.5 0 1 0-4.65-1.951l.006.007l.136.15V10h1v4H0v-1h2.37l-.234-.258A7.477 7.477 0 0 1 0 7.5Zm7 0V3h1v4.293l2.854 2.853l-.708.708l-3-3A.5.5 0 0 1 7 7.5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-lg">Continue Watching</span>
                    </div>
                    <div className="mt-4">
                        <Carousel
                            breakpoints={{
                                0: {
                                    slidesPerView: 3,
                                    spaceBetween: 10,
                                },
                                640: {
                                    slidesPerView: 4,
                                    spaceBetween: 15,
                                },
                                1024: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                                1280: {
                                    slidesPerView: 6,
                                    spaceBetween: 20,
                                },
                            }}
                            pagination={false}
                            navigation={true}
                        >
                            {continueWatchingAnimes?.map((anime) => (
                                <SwiperSlide key={anime.id}>
                                    <MovieCard key={anime.id} anime={anime} />
                                </SwiperSlide>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                {recommendedAnime ? (
                    <div className="relative w-full rounded-3xl overflow-hidden mt-16 group bg-[#0D0D0D] border border-white/5">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-60"></div>
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px]"></div>

                        <div className="relative z-10 flex lg:flex-row flex-col items-center gap-10 lg:gap-20 p-8 md:p-12">
                            {/* Left Visuals - Composition of Poster and Character */}
                            <div className="lg:w-5/12 w-full flex justify-center items-center relative min-h-[300px] md:min-h-[400px]">
                                {/* Back Glow */}
                                <div className="absolute w-64 h-64 bg-primary/30 rounded-full blur-[80px] center"></div>

                                {/* Poster Image (Tilted) */}
                                <div className="relative w-40 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 rotate-[-12deg] group-hover:rotate-[-6deg] transition-all duration-700 z-10 border-[6px] border-[#1a1a1a]">
                                    <img
                                        src={recommendedAnime?.thumbnail}
                                        className="w-full h-full object-cover"
                                        alt={recommendedAnime?.name}
                                    />
                                </div>

                                {/* Character Image (Overlapping) */}
                                <div className="absolute bottom-0 -right-4 lg:-right-12 w-48 md:w-80 h-auto z-20 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float">
                                    <img
                                        src={
                                            recommendedAnime?.transparent_background
                                        }
                                        className="w-full h-full object-contain transform scale-110 lg:scale-125"
                                        alt=""
                                    />
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="lg:w-7/12 w-full text-white text-center lg:text-left space-y-6">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>
                                        Editor's Choice
                                    </div>
                                    <Link
                                        href={window.route(
                                            "group.anime.detail",
                                            { anime: recommendedAnime }
                                        )}
                                        className="block group-hover:text-primary transition-colors duration-300"
                                    >
                                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tight">
                                            {recommendedAnime?.name}
                                        </h2>
                                    </Link>
                                </div>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm font-medium text-zinc-400">
                                    <span className="text-white">Series</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                    <span>
                                        {recommendedAnime?.created_at
                                            ? new Date(
                                                  recommendedAnime.created_at
                                              ).getFullYear()
                                            : new Date().getFullYear()}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                    <div className="flex gap-2">
                                        {recommendedAnime?.tags
                                            .slice(0, 4)
                                            .map((tag, i) => (
                                                <Link
                                                    key={i}
                                                    href={window.route(
                                                        "group.animes",
                                                        { tags: tag.name }
                                                    )}
                                                    className="hover:text-white transition-colors"
                                                >
                                                    #{tag.name}
                                                </Link>
                                            ))}
                                    </div>
                                </div>

                                <p className="text-zinc-400 text-base leading-relaxed line-clamp-3 md:line-clamp-4 max-w-2xl mx-auto lg:mx-0">
                                    {recommendedAnime?.description}
                                </p>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                                    <Button
                                        text="Start Watching"
                                        className="!bg-primary hover:!bg-primary/90 !text-white !px-8 !py-4 !rounded-xl !text-base !font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                                        href={window.route(
                                            "group.anime.detail",
                                            {
                                                anime: recommendedAnime,
                                                scrollTo: "chapters",
                                            }
                                        )}
                                        Icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        }
                                    />

                                    <Button
                                        outline
                                        text={
                                            recommendedAnime.isSavedByCurrentUser
                                                ? "Saved"
                                                : "Watchlist"
                                        }
                                        className="!px-8 !py-4 !rounded-xl !text-base !font-bold !border-zinc-700 hover:!border-white hover:!bg-white hover:!text-black transition-all hover:-translate-y-1"
                                        onClick={() =>
                                            saveToWatchList(recommendedAnime)
                                        }
                                        type="button"
                                        Icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill={
                                                    recommendedAnime.isSavedByCurrentUser
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                            </svg>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </SectionContainer>
            <SectionContainer
                className={"bg-[#0a0a0a] mt-12 py-12"}
                padding={false}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                                New Episodes
                            </h2>
                            <p className="text-zinc-400 text-sm font-medium">
                                Freshly uploaded content for you
                            </p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Today Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <h3 className="text-lg font-bold text-white">
                                    Today
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
                            </div>

                            {newEpisodes?.today.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {newEpisodes?.today?.map((episode) => (
                                        <NewEpisodeCard
                                            key={episode?.id}
                                            episode={episode}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center rounded-2xl bg-zinc-900/50 border border-zinc-800 border-dashed">
                                    <p className="text-zinc-500 font-medium">
                                        No new episodes uploaded today.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Yesterday Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                                <h3 className="text-lg font-bold text-zinc-300">
                                    Yesterday
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
                            </div>

                            {newEpisodes?.yesterday.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {newEpisodes?.yesterday?.map((episode) => (
                                        <NewEpisodeCard
                                            episode={episode}
                                            key={episode?.id}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center rounded-2xl bg-zinc-900/50 border border-zinc-800 border-dashed">
                                    <p className="text-zinc-500 font-medium">
                                        No episodes from yesterday.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                <div className="mt-5">
                    <div className="flex items-center gap-4 text-yellow-400 font-semibold">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 15 15"
                        >
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M0 7.5a7.5 7.5 0 1 1 6.965 7.481l.053-.998l.49.017a6.5 6.5 0 1 0-4.65-1.951l.006.007l.136.15V10h1v4H0v-1h2.37l-.234-.258A7.477 7.477 0 0 1 0 7.5Zm7 0V3h1v4.293l2.854 2.853l-.708.708l-3-3A.5.5 0 0 1 7 7.5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-lg">Popular Series</span>
                    </div>
                    <Carousel
                        breakpoints={{
                            0: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 4,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 6,
                                spaceBetween: 20,
                            },
                        }}
                        id="popular-series"
                        pagination={false}
                        navigation={true}
                    >
                        {popularAnimes?.map((anime) => (
                            <SwiperSlide key={anime.id}>
                                <MovieCard key={anime?.id} anime={anime} />
                            </SwiperSlide>
                        ))}
                    </Carousel>
                </div>
            </SectionContainer>
            <SectionContainer className={"bg-black mt-8"} padding={false}>
                <div className="mt-5 sm:px-10 px-3 py-10">
                    <div className="flex items-center gap-4 text-yellow-400 font-semibold">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 15 15"
                        >
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M0 7.5a7.5 7.5 0 1 1 6.965 7.481l.053-.998l.49.017a6.5 6.5 0 1 0-4.65-1.951l.006.007l.136.15V10h1v4H0v-1h2.37l-.234-.258A7.477 7.477 0 0 1 0 7.5Zm7 0V3h1v4.293l2.854 2.853l-.708.708l-3-3A.5.5 0 0 1 7 7.5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-lg">Popular Manga</span>
                    </div>
                    <Carousel
                        id="popular-manga"
                        breakpoints={{
                            0: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 4,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 6,
                                spaceBetween: 20,
                            },
                        }}
                        loop={false}
                        pagination={false}
                        navigation={true}
                    >
                        {popularMangas?.map((manga) => (
                            <SwiperSlide key={manga.id}>
                                <MangaCard key={manga?.id} manga={manga} />
                            </SwiperSlide>
                        ))}
                    </Carousel>
                </div>
            </SectionContainer>
            <SectionContainer
                padding={false}
                style={{
                    backgroundImage:
                        "linear-gradient(55deg, rgba(223,136,28,1) 13%, rgba(249,198,45,1) 42%, rgba(216,119,23,1) 91%)",
                }}
            >
                <div className="py-20 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10 pl-4 sm:pl-0">
                        <div className="p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-wide drop-shadow-sm">
                                Trending Now
                            </h2>
                            <p className="text-white/80 text-sm font-medium">
                                Most watched this week
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* New Animes (Top Item) */}
                        {newAnimes?.length > 0 && (
                            <div className="relative group overflow-hidden rounded-3xl bg-[#0D0D0D] border border-white/10 shadow-2xl">
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={newAnimes[0]?.background_image}
                                        className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
                                </div>

                                <div className="relative z-10 flex lg:flex-row flex-col items-center gap-8 lg:gap-16 p-6 md:p-12">
                                    {/* Left Content */}
                                    <div className="lg:w-7/12 w-full space-y-4 md:space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25">
                                                #1 Trending
                                            </span>
                                            <span className="text-zinc-400 font-medium text-sm flex items-center gap-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="text-yellow-400"
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                                {newAnimes[0]?.rating || "N/A"}
                                            </span>
                                        </div>

                                        <Link
                                            href="#"
                                            className="block group-hover:text-primary transition-colors"
                                        >
                                            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight">
                                                {newAnimes[0]?.name}
                                            </h1>
                                        </Link>

                                        <div className="flex flex-wrap gap-2">
                                            {newAnimes[0]?.tags.map(
                                                (tag, i) => (
                                                    <Tag
                                                        key={tag.id}
                                                        className="!bg-white/5 !border-white/10 !text-zinc-300 hover:!bg-white/10 transition-colors"
                                                        tag={tag}
                                                    />
                                                )
                                            )}
                                        </div>

                                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3 max-w-2xl">
                                            {newAnimes[0]?.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <Button
                                                className="!bg-primary hover:!bg-primary/90 !text-white !px-6 !py-3 !rounded-xl !text-sm !font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                                                text="Start Watching"
                                                href={window.route(
                                                    "group.anime.detail",
                                                    {
                                                        anime: newAnimes[0],
                                                        scrollTo: "chapters",
                                                    }
                                                )}
                                                Icon={
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                }
                                            />
                                            <Button
                                                outline
                                                text={
                                                    newAnimes[0]
                                                        .isSavedByCurrentUser
                                                        ? "Saved"
                                                        : "Watchlist"
                                                }
                                                className="!px-6 !py-3 !rounded-xl !text-sm !font-bold !border-zinc-700 hover:!border-white hover:!bg-white hover:!text-black transition-all hover:-translate-y-1 text-white"
                                                type="button"
                                                onClick={() =>
                                                    saveToWatchList(
                                                        newAnimes[0]
                                                    )
                                                }
                                                Icon={
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill={
                                                            newAnimes[0]
                                                                .isSavedByCurrentUser
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                                    </svg>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Right Visuals */}
                                    <div className="lg:w-5/12 w-full flex justify-center lg:justify-end relative mt-6 lg:mt-0">
                                        <div className="relative w-48 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-[4px] border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                            <img
                                                src={newAnimes[0]?.thumbnail}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        </div>
                                        {newAnimes[0]
                                            ?.transparent_background && (
                                            <div className="absolute -bottom-6 -right-6 w-56 md:w-96 z-20 pointer-events-none">
                                                <img
                                                    src={
                                                        newAnimes[0]
                                                            ?.transparent_background
                                                    }
                                                    className="w-full h-full object-contain drop-shadow-2xl"
                                                    alt=""
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trend Animes (Secondary Item) */}
                        {trendAnimes?.length > 0 && (
                            <div className="relative group overflow-hidden rounded-3xl bg-[#0D0D0D] border border-white/10 shadow-2xl">
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={
                                            trendAnimes[0]?.background_image ||
                                            trendAnimes[0]?.thumbnail
                                        }
                                        className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-black via-black/90 to-transparent"></div>
                                </div>

                                <div className="relative z-10 flex lg:flex-row-reverse flex-col items-center gap-8 lg:gap-16 p-6 md:p-12">
                                    {/* Content (Right Side) */}
                                    <div className="lg:w-7/12 w-full space-y-4 md:space-y-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="text-zinc-400 font-medium text-sm flex items-center gap-1">
                                                {trendAnimes[0]?.rating ||
                                                    "N/A"}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="text-yellow-400"
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-600/25">
                                                Rising Star
                                            </span>
                                        </div>

                                        <Link
                                            href={window.route(
                                                "group.anime.detail",
                                                {
                                                    anime: trendAnimes[0],
                                                }
                                            )}
                                            className="block group-hover:text-purple-500 transition-colors"
                                        >
                                            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight">
                                                {trendAnimes[0].name}
                                            </h1>
                                        </Link>

                                        <div className="flex flex-wrap justify-end gap-2">
                                            {trendAnimes[0]?.tags.map(
                                                (tag, i) => (
                                                    <Tag
                                                        key={tag.id}
                                                        className="!bg-white/5 !border-white/10 !text-zinc-300 hover:!bg-white/10 transition-colors"
                                                        tag={tag}
                                                    />
                                                )
                                            )}
                                        </div>

                                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3 max-w-2xl ml-auto">
                                            {trendAnimes[0].description}
                                        </p>

                                        <div className="flex flex-wrap justify-end gap-4 pt-2">
                                            <Button
                                                className="!bg-purple-600 hover:!bg-purple-700 !text-white !px-6 !py-3 !rounded-xl !text-sm !font-bold shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-1 transition-all"
                                                href={window.route(
                                                    "group.anime.detail",
                                                    {
                                                        anime: trendAnimes[0],
                                                        scrollTo: "chapters",
                                                    }
                                                )}
                                                text="Start Watching"
                                                Icon={
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                }
                                            />
                                            <Button
                                                outline
                                                text={
                                                    trendAnimes[0]
                                                        .isSavedByCurrentUser
                                                        ? "Saved"
                                                        : "Watchlist"
                                                }
                                                className="!px-6 !py-3 !rounded-xl !text-sm !font-bold !border-zinc-700 hover:!border-white hover:!bg-white hover:!text-black transition-all hover:-translate-y-1 text-white"
                                                type="button"
                                                onClick={() =>
                                                    saveToWatchList(
                                                        trendAnimes[0]
                                                    )
                                                }
                                                Icon={
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill={
                                                            trendAnimes[0]
                                                                .isSavedByCurrentUser
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                                    </svg>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Left Visuals */}
                                    <div className="lg:w-5/12 w-full flex justify-center lg:justify-start relative mt-6 lg:mt-0">
                                        <div className="relative w-48 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-[4px] border-white/10 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                            <img
                                                src={trendAnimes[0].thumbnail}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        </div>
                                        {trendAnimes[0]
                                            .transparent_background && (
                                            <div className="absolute -bottom-6 -left-6 w-56 md:w-96 z-20 pointer-events-none">
                                                <img
                                                    src={
                                                        trendAnimes[0]
                                                            .transparent_background
                                                    }
                                                    className="w-full h-full object-contain drop-shadow-2xl"
                                                    alt=""
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer padding={false}>
                <div className="relative mt-8 w-full overflow-hidden group">
                    {/* Background Image with Parallax-like effect */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105 group-hover:scale-110 transition-transform duration-[20s]"
                        style={{
                            backgroundImage:
                                "url('https://4kwallpapers.com/images/wallpapers/demon-slayer-1024x768-10716.jpg')",
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />

                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
                            Unlock the Full{" "}
                            <span className="text-primary">Experience</span>
                        </h2>

                        <p className="max-w-2xl mx-auto text-zinc-300 text-lg md:text-xl font-medium leading-relaxed mb-10 drop-shadow-md">
                            Sign in or register to access exclusive features,
                            track your watching progress, and join the
                            conversation with our growing community.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Button
                                text="Sign In"
                                className="!bg-primary hover:!bg-primary/90 !text-white !px-10 !py-4 !rounded-xl !text-lg !font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                                href={window.route("group.login")}
                                Icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line
                                            x1="15"
                                            y1="12"
                                            x2="3"
                                            y2="12"
                                        ></line>
                                    </svg>
                                }
                            />
                            <Button
                                text="Create Account"
                                outline
                                className="!bg-white/10 hover:!bg-white !text-white hover:!text-black !border-white/20 hover:!border-white !px-10 !py-4 !rounded-xl !text-lg !font-bold backdrop-blur-sm transition-all hover:-translate-y-1"
                                href={window.route("group.register")}
                                Icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <line
                                            x1="20"
                                            y1="8"
                                            x2="20"
                                            y2="14"
                                        ></line>
                                        <line
                                            x1="23"
                                            y1="11"
                                            x2="17"
                                            y2="11"
                                        ></line>
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer className="py-20" padding={false}>
                <div className="relative rounded-3xl overflow-hidden bg-[#0D0D0D] border border-white/5 p-8 md:p-20 text-center">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 border border-white/10 text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                class="text-white"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Subscribe for{" "}
                            <span className="text-primary">Latest Updates</span>
                        </h2>

                        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                            Be the first to know about new anime releases,
                            exclusive content, and community events. Join our
                            newsletter today!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <input
                                    placeholder="Enter your email address"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    post(
                                        window.route("group.subscriber.store"),
                                        {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                reset();
                                            },
                                        }
                                    );
                                }}
                                className="group relative px-8 py-4 bg-white text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 whitespace-nowrap overflow-hidden"
                            >
                                <div className="relative z-10 flex items-center  justify-center gap-2">
                                    <span>Subscribe Now</span>
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
                                        className="text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                    >
                                        <line
                                            x1="22"
                                            y1="2"
                                            x2="11"
                                            y2="13"
                                        ></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </div>
                            </button>
                        </div>

                        <p className="mt-6 text-xs text-zinc-500 font-medium">
                            We respect your privacy. No spam, ever.
                        </p>
                    </div>
                </div>
            </SectionContainer>
        </>
    );
}

export default Index;
Index.layout = (page) => <UserLayout>{page}</UserLayout>;
