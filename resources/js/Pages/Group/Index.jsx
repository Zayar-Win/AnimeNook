import Button from "@/Components/Button";
import MangaCard from "@/Components/MangaCard";
import MovieCard from "@/Components/MovieCard";
import NewEpisodeCard from "@/Components/NewEpisodeCard";
import SectionContainer from "@/Components/SectionContainer";
// import Tag from '@/Components/Tag'
import { Link, router } from "@inertiajs/react";
import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import Carousel from "@/Components/Carousel/Index";
import { SwiperSlide } from "swiper/react";
import Tag from "@/Components/Tag";
import Pause from "@/../assets/Pause";
import { usePage } from "@inertiajs/react";

function Index({
    trendAnimes,
    newAnimes,
    recommendedAnime,
    continueWatchingAnimes,
    popularAnimes,
    popularMangas,
    newEpisodes,
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
    return (
        <>
            <SectionContainer>
                <div className="flex mt-[30px] xl:flex-row flex-col">
                    <div className="xl:w-[70%] w-full h-full">
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
                        <div className="h-[500px]">
                            <Carousel>
                                {trendAnimes?.map((anime, i) => (
                                    <SwiperSlide
                                        key={i}
                                        className="w-full h-full"
                                    >
                                        <div className="relative w-full h-full  overflow-hidden text-white">
                                            <img
                                                className="absolute z-10 top-0 left-0  right-0 bottom-0 w-full h-full object-cover"
                                                src={anime?.background_image}
                                                alt=""
                                            />
                                            <div className="relative z-20 pt-40 sm:pl-10 p-4 pb-12">
                                                <p className="font-semibold flex items-center">
                                                    Home{" "}
                                                    <span className="inline-block h-4 mx-1 border-l-2 border-white"></span>
                                                    TV
                                                </p>
                                                <h1 className="text-4xl font-extrabold mt-4">
                                                    {anime.name}
                                                </h1>
                                                <p className="flex items-center mt-3 mb-3">
                                                    Ep 24{" "}
                                                    <span className="block w-1 h-1 rounded-full bg-white mx-1"></span>
                                                    24m
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {anime?.tags.map(
                                                        (tag, i) => (
                                                            <Tag
                                                                key={i}
                                                                tag={tag}
                                                                className="bg-[#47BE71]"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <p className="lg:w-[40%] sm:w-[70%] w-full mt-3 font-semibold">
                                                    Lorem ipsum dolor sit, amet
                                                    consectetur adipisicing
                                                    elit. Aspernatur,
                                                    repudiandae quas nam
                                                    pariatur ullam optio
                                                    provident, esse at quam sunt
                                                    eum voluptates nisi quis
                                                    autem velit harum, voluptate
                                                    hic voluptatem.
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                    <div className="xl:w-[30%] w-full xl:ml-4 xl:mt-0 mt-10">
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
                            <p>News</p>
                        </div>
                        <div className="bg-[#0D0D0D] rounded-md flex self-stretch xl:flex-col flex-row flex-wrap  xl:gap-5 gap-14 px-6 py-12 text-white">
                            {newAnimes?.map((anime, i) => (
                                <Link
                                    key={i}
                                    href={window.route("group.anime.detail", {
                                        anime,
                                    })}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-4">
                                            <p className="font-bold xl:block hidden text-lg">
                                                0{i + 1}
                                            </p>
                                            <img
                                                className="sm:w-10 sm:h-16 h-28 w-20 object-cover"
                                                src={anime?.thumbnail}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex flex-col flex-grow ml-3">
                                            <h1 className="pb-2 font-semibold">
                                                {anime?.name}
                                            </h1>
                                            <div className="flex items-center gap-4">
                                                <div className=" flex items-center gap-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
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
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
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
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                {recommendedAnime ? (
                    <div
                        className="rounded-lg mb-20 mt-20 relative overflow-hidden px-5 py-8"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(203,177,48,0.6285364487591911) 0%, rgba(249,181,45,1) 42%)",
                        }}
                    >
                        <div className="w-[400px] h-[400px] sm:block hidden z-10 lg:right-28 right-10 bottom-0 translate-y-[30%] rounded-full bg-[rgba(230,216,142,0.63)] absolute"></div>
                        <div className="w-[340px] h-[340px] sm:block hidden z-20 lg:right-36 right-16 bottom-0 translate-y-[27%] rounded-full bg-[#caab79] absolute"></div>
                        <div className="w-[280px] h-[280px] sm:block hidden z-30 lg:right-44 right-24 bottom-0 translate-y-[22%] rounded-full bg-[#FFF2DE] absolute"></div>
                        <img
                            className="absolute w-[280px] sm:block hidden z-40 object-contain bottom-0 lg:right-40 right-24 h-[210px]"
                            src={recommendedAnime?.transparent_background}
                            alt=""
                        />
                        <h1 className="sm:text-3xl text-xl font-extrabold uppercase">
                            Watch {recommendedAnime?.name}
                        </h1>
                        <div className="flex gap-2 flex-wrap items-center my-5 mb-7 sm:text-base text-sm font-semibold">
                            {recommendedAnime?.tags.map((tag, i) => (
                                <>
                                    <Link
                                        href={window.route("group.animes", {
                                            tags: tag.name,
                                        })}
                                    >
                                        {tag.name}
                                    </Link>
                                    {i + 1 !==
                                        recommendedAnime?.tags.length && (
                                        <div className="border-l-[3px] mx-1 border-black h-5"></div>
                                    )}
                                </>
                            ))}
                        </div>
                        <div className="flex items-center gap-9">
                            <Button
                                text={"Watch Now"}
                                className={"!bg-black"}
                                href={window.route("group.anime.detail", {
                                    anime: recommendedAnime,
                                })}
                            />
                            <Link
                                href={window.route("group.anime.detail", {
                                    anime: recommendedAnime,
                                })}
                                className="underline"
                            >
                                Go to Website
                            </Link>
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
                    <div className="grid mt-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xl:gap-4 gap-2">
                        {continueWatchingAnimes?.map((anime) => (
                            <MovieCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                {recommendedAnime ? (
                    <div className="flex lg:p-0 p-10 items-center gap-8 bg-[#0D0D0D] rounded-md mt-8">
                        <div className="basis-[40%] lg:flex  hidden items-center">
                            <img
                                className="xl:w-[60%] w-full object-cover h-full"
                                src={recommendedAnime?.transparent_background}
                                alt=""
                            />
                            <div className="w-[40%] xl:block hidden h-full">
                                <img
                                    className="w-full h-full object-cover"
                                    src={recommendedAnime?.thumbnail}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="lg:basis-[60%] w-full text-white">
                            <Link href="#" className="hover:underline">
                                <h1 className="text-2xl font-bold">
                                    {recommendedAnime?.name}
                                </h1>
                            </Link>
                            <div className="flex items-center gap-1 my-3">
                                <span className="text-[#40ecf8] sm:block hidden">
                                    Series
                                </span>
                                <svg
                                    className="sm:block hidden"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M12 .5L16 8l7.5 4l-7.5 4l-4 7.5L8 16L.5 12L8 8l4-7.5Z"
                                    />
                                </svg>
                                <div className="flex flex-wrap gap-x-3">
                                    {recommendedAnime?.tags.map((tag, i) => (
                                        <Tag
                                            key={tag.id}
                                            className={`${
                                                recommendedAnime?.tags
                                                    .length === 1 &&
                                                i ===
                                                    recommendedAnime.tags
                                                        .length -
                                                        1
                                                    ? "border-left border-white"
                                                    : ""
                                            } sm:px-3 !px-0`}
                                            tag={tag}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="sm:w-[95%] w-full sm:text-base text-sm">
                                {recommendedAnime?.description}
                            </p>
                            <div className="mt-4 flex items-center flex-wrap sm:gap-8 gap-4">
                                <Button
                                    className={
                                        "!bg-primary !px-8 rounded-none !gap-1"
                                    }
                                    text={"Start Watching S1 Ep1"}
                                    href={window.route("group.anime.detail", {
                                        anime: recommendedAnime,
                                        scrollTo: "chapters",
                                    })}
                                    Icon={<Pause />}
                                />
                                <Button
                                    outline
                                    text={
                                        recommendedAnime.isSavedByCurrentUser
                                            ? "Saved"
                                            : "Add To WatchList"
                                    }
                                    className={
                                        "!px-8 rounded-none !gap-1 border-primary text-primary"
                                    }
                                    onClick={() =>
                                        saveToWatchList(recommendedAnime)
                                    }
                                    type={"button"}
                                    Icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"
                                            />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ) : null}
            </SectionContainer>
            <SectionContainer className={"bg-black mt-8"} padding={false}>
                <div className="px-10 text-white py-20">
                    <div className="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="m10 14l6-4l-6-4v8Zm-8 8V2h20v16H6l-4 4Zm2-6h16V4H4v12Zm0 0V4v12Z"
                            />
                        </svg>
                        <span className="text-xl font-bold">New Episodes</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold border-b-2 broder-white py-3 mb-5">
                            Today
                        </h1>
                        {newEpisodes?.today.length > 0 ? (
                            <div>
                                <div className="grid grid-cols-3 gap-10">
                                    {newEpisodes?.today?.map((episode) => (
                                        <NewEpisodeCard
                                            key={episode?.id}
                                            episode={episode}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="pt-6 text-primary">
                                No new episodes are uploaded today.
                            </p>
                        )}
                        <h1 className="text-lg font-bold border-b-2 broder-white py-3 mt-5 mb-5">
                            Yesterday
                        </h1>
                        {newEpisodes?.yesterday.length > 0 ? (
                            <div>
                                <div className="grid grid-cols-3 gap-10">
                                    {newEpisodes?.yesterday?.map((episode) => (
                                        <NewEpisodeCard
                                            episode={episode}
                                            key={episode?.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="pt-6 text-primary">
                                No new episodes are uploaded today.
                            </p>
                        )}
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
                    <div className="grid mt-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xl:gap-4 gap-2">
                        {popularAnimes?.map((anime) => (
                            <MovieCard key={anime?.id} anime={anime} />
                        ))}
                    </div>
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
                    <div className="grid mt-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-4">
                        {popularMangas?.map((manga) => (
                            <MangaCard key={manga?.id} manga={manga} />
                        ))}
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer
                padding={false}
                style={{
                    backgroundImage:
                        "linear-gradient(55deg, rgba(223,136,28,1) 13%, rgba(249,198,45,1) 42%, rgba(216,119,23,1) 91%)",
                }}
            >
                <div className="sm:px-10 px-3 py-10">
                    {newAnimes?.length > 0 && (
                        <div className="flex lg:p-0 p-10 items-center gap-8 bg-[#0D0D0D] rounded-md">
                            <div className="basis-[40%] lg:flex hidden items-center">
                                <img
                                    className="xl:w-[60%] w-full object-cover h-[350px]"
                                    src={newAnimes[0]?.transparent_background}
                                    alt=""
                                />
                                <div className="w-[40%] xl:block hidden h-[320px]">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={newAnimes[0]?.thumbnail}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="lg:basis-[60%] w-full text-white">
                                <Link href="#" className="hover:underline">
                                    <h1 className="text-2xl font-bold">
                                        {newAnimes[0]?.name}
                                    </h1>
                                </Link>
                                <div className="flex items-center gap-1 my-3">
                                    <span className="text-[#40ecf8] sm:block hidden">
                                        Series
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sm:block hidden"
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12 .5L16 8l7.5 4l-7.5 4l-4 7.5L8 16L.5 12L8 8l4-7.5Z"
                                        />
                                    </svg>
                                    <div className="flex items-center flex-wrap gap-x-3">
                                        {newAnimes[0]?.tags.map((tag, i) => (
                                            <Tag
                                                key={tag.id}
                                                className={`${
                                                    recommendedAnime?.tags
                                                        .length === 1 &&
                                                    i ===
                                                        recommendedAnime.tags
                                                            .length -
                                                            1
                                                        ? "border-left border-white"
                                                        : ""
                                                } sm:px-3 !px-0`}
                                                tag={tag}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="sm:w-[95%] w-full sm:text-base text-sm">
                                    {newAnimes[0]?.description}
                                </p>
                                <div className="mt-4 flex items-center flex-wrap sm:gap-8 gap-4">
                                    <Button
                                        className={
                                            "!bg-primary !px-8 rounded-none !gap-1"
                                        }
                                        text={"Start Watching S1 Ep1"}
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
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"
                                                />
                                            </svg>
                                        }
                                    />
                                    <Button
                                        outline
                                        text={
                                            newAnimes[0].isSavedByCurrentUser
                                                ? "Saved"
                                                : "Add To WatchList"
                                        }
                                        className={
                                            "!px-8 rounded-none !gap-1 !border-primary text-primary"
                                        }
                                        type={"button"}
                                        onClick={() =>
                                            saveToWatchList(newAnimes[0])
                                        }
                                        Icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"
                                                />
                                            </svg>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {trendAnimes?.length > 0 && (
                        <div className="flex lg:p-0 p-10 items-center gap-8 bg-[#0D0D0D] rounded-md mt-8">
                            <div className="basis-[40%] lg:flex hidden items-center">
                                <img
                                    className="xl:w-[60%] w-full object-cover h-[350px]"
                                    src={trendAnimes[0].transparent_background}
                                    alt=""
                                />
                                <div className="w-[40%] xl:block hidden h-[320px]">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={trendAnimes[0].thumbnail}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="lg:basis-[60%] w-full text-white">
                                <Link
                                    href={window.route("group.anime.detail", {
                                        anime: trendAnimes[0],
                                    })}
                                    className="hover:underline"
                                >
                                    <h1 className="text-2xl font-bold">
                                        {trendAnimes[0].name}
                                    </h1>
                                </Link>
                                <div className="flex items-center gap-1 my-3">
                                    <span className="text-[#40ecf8] sm:block hidden">
                                        Series
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sm:block hidden"
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12 .5L16 8l7.5 4l-7.5 4l-4 7.5L8 16L.5 12L8 8l4-7.5Z"
                                        />
                                    </svg>
                                    <div className="flex items-center flex-wrap gap-x-3">
                                        {trendAnimes[0]?.tags.map((tag, i) => (
                                            <Tag
                                                key={tag.id}
                                                className={`${
                                                    recommendedAnime?.tags
                                                        .length === 1 &&
                                                    i ===
                                                        recommendedAnime.tags
                                                            .length -
                                                            1
                                                        ? "border-left border-white"
                                                        : ""
                                                } sm:px-3 px-0`}
                                                tag={tag}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="sm:w-[95%] w-full sm:text-base text-sm">
                                    {trendAnimes[0].description}
                                </p>
                                <div className="mt-4 flex items-center flex-wrap sm:gap-8 gap-4">
                                    <Button
                                        className={
                                            "!bg-primary !px-8 rounded-none !gap-1"
                                        }
                                        href={window.route(
                                            "group.anime.detail",
                                            {
                                                anime: trendAnimes[0],
                                                scrollTo: "chapters",
                                            }
                                        )}
                                        text={"Start Watching S1 Ep1"}
                                        Icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"
                                                />
                                            </svg>
                                        }
                                    />
                                    <Button
                                        outline
                                        text={
                                            trendAnimes[0].isSavedByCurrentUser
                                                ? "Saved"
                                                : "Add To WatchList"
                                        }
                                        className={
                                            "!px-8 rounded-none !gap-1 !border-primary text-primary"
                                        }
                                        type={"button"}
                                        onClick={() =>
                                            saveToWatchList(trendAnimes[0])
                                        }
                                        Icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"
                                                />
                                            </svg>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SectionContainer>
            <SectionContainer padding={false}>
                <div
                    className="xxs:min-h-[50vh] min-h-[70vh]  relative mt-8 bg-fixed bg-no-repeat bg-cover bg-top"
                    style={{
                        backgroundImage:
                            "url('https://4kwallpapers.com/images/wallpapers/demon-slayer-1024x768-10716.jpg')",
                    }}
                >
                    <div className="absolute text-white flex items-center flex-col justify-center top-0 left-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.6)]">
                        <h1 className="sm:text-4xl text-3xl font-bold text-center">
                            Signin Or Register Here
                        </h1>
                        <p className="text-center pt-4 lg:w-[50%] sm:w-[70%] w-[90%] font-semibold sm:text-lg text-base">
                            Signin Or Register to get better experience and to
                            get more permission. Lorem ipsum dolor sit amet
                            consectetur adipisicing elit. Ipsam, optio.
                        </p>
                        <div className="mt-6 flex items-center w-full justify-center flex-wrap gap-8">
                            <Button
                                text={"Sign In"}
                                className={"!bg-primary !px-12 !gap-1"}
                                href={window.route("group.login")}
                            />
                            <Button
                                text={"Sign Up"}
                                className={
                                    "!border-primary !px-12 !gap-1 !text-primary"
                                }
                                outline
                                href={window.route("group.register")}
                            />
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </>
    );
}

export default Index;
Index.layout = (page) => <UserLayout>{page}</UserLayout>;
