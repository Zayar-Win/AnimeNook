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
                    <div className="flex lg:flex-row flex-col items-start gap-4">
                        <div className="basis-[70%]">
                            <div className="flex items-center justify-between">
                                <h1 className="md:text-3xl text-xl font-bold">
                                    {anime?.name}
                                </h1>
                                <Share />
                            </div>
                            <div className="w-full mt-3">
                                <Tags tags={anime?.tags} />
                            </div>
                            <div className="flex md:flex-nowrap flex-wrap items-center gap-2 mt-6">
                                <Rating ratingHandler={ratingHandler} />
                                <span className="inline-block h-6 mx-1 border-l-2 border-gray-500"></span>
                                <div>
                                    <div className="font-medium text-gray-400">
                                        Average Rating:{" "}
                                        <span className="text-white font-bold">
                                            {anime?.rating}(
                                            {anime?.ratings_count})
                                        </span>
                                    </div>
                                </div>
                                <span className="inline-block h-6 mx-1 border-l-2 border-gray-500"></span>
                                <div className="text-gray-400 font-medium">
                                    {anime?.views_count} Views
                                </div>
                                <div className="text-gray-400 font-medium">
                                    {anime?.likes_count} Likes
                                </div>
                            </div>
                            <div className="flex md:flex-row flex-col md:items-center md:gap-3 ">
                                <Button
                                    text={
                                        anime.isSavedByCurrentUser
                                            ? "Added to WatchList"
                                            : "Add to WatchList"
                                    }
                                    type={"button"}
                                    onClick={() => saveToWatchList()}
                                    outline
                                    className={
                                        "border-primary rounded-none !text-primary uppercase my-5"
                                    }
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
                                    outline
                                    type={"button"}
                                    onClick={() => likeAnime()}
                                    className={
                                        "border-primary !px-8 md:w-[140px] py-3 rounded-none !gap-1"
                                    }
                                    Icon={
                                        <Liked
                                            className={`w-6 h-6 ${
                                                anime?.isLikeByCurrentUser
                                                    ? "text-primary"
                                                    : "text-white"
                                            }`}
                                        />
                                    }
                                />
                            </div>
                            <p className="my-5">{anime?.description}</p>
                        </div>
                        <div className="md:basis-[30%] w-full">
                            {anime?.chapters[0] && (
                                <div>
                                    <div className="relative">
                                        <div className="w-12 cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-12 rounded-full flex items-center justify-center bg-[#0006]">
                                            <Pause />
                                        </div>
                                        <img
                                            src={
                                                anime?.chapters[0]?.thumbnail ??
                                                anime?.thumbnail
                                            }
                                            className="w-full lg:h-[180px] h-[230px] object-cover"
                                            alt="Epsodie 1 Thumbnail"
                                        />
                                    </div>
                                    <Button
                                        text={`Start Watching Episode 1`}
                                        className={
                                            "bg-primary rounded-none mt-3 justify-center"
                                        }
                                        href={anime?.chapters[0]?.chapter_link}
                                        Icon={<Pause />}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        {seasons.length ? (
                            <div className="relative">
                                <div
                                    onClick={() =>
                                        setIsSeasonBoxOpen((prev) => !prev)
                                    }
                                    className="flex seasonbox-toggle items-center gap-2 cursor-pointer mt-6"
                                >
                                    <DownArrow />
                                    <h1 className="text-2xl font-bold">
                                        {anime?.name}{" "}
                                        {anime.chapters.length
                                            ? ` : ${anime.chapters[0].season.title}`
                                            : ""}
                                    </h1>
                                </div>
                                <div
                                    ref={seasonBoxRef}
                                    className={`absolute ${
                                        isSeasonBoxOpen
                                            ? "opacity-1 visible"
                                            : "opacity-0 invisible"
                                    } top-[100%] bg-gray-600 z-[10] py-[10px] w-[500px] transition-all`}
                                >
                                    <ul>
                                        {seasons.map((season) => {
                                            return (
                                                <Link
                                                    key={season.id}
                                                    href={window.route(
                                                        "group.anime.detail",
                                                        {
                                                            anime: anime,
                                                            season: season.season_number,
                                                        }
                                                    )}
                                                    preserveScroll={true}
                                                >
                                                    <li className="px-[15px] gap-3 py-[10px] flex justify-between !cursor-pointer hover:bg-gray-900">
                                                        <div className="line-clamp-1">
                                                            {anime.name} :{" "}
                                                            {season.title}
                                                        </div>
                                                        <p className="shrink-0">
                                                            {
                                                                season.chapters_count
                                                            }{" "}
                                                            episodes
                                                        </p>
                                                    </li>
                                                </Link>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <h1 className="text-2xl font-bold mt-6">
                                {anime?.name}
                            </h1>
                        )}
                    </div>

                    <div id="chapters" className="mt-4">
                        {anime?.chapters.length > 0 ? (
                            <div className="grid lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 gap-5">
                                {anime?.chapters?.map((chapter, i) => (
                                    <a
                                        href={
                                            user &&  user?.type === "free"
                                                ? chapter.ouo_chapter_link
                                                : chapter.chapter_link || chapter.ouo_chapter_link
                                        }
                                        key={i}
                                    >
                                        <div>
                                            <div className="md:h-[150px] xs:h-[100px] h-[140px] object-cover relative">
                                                <img
                                                    src={
                                                        chapter?.thumbnail ??
                                                        anime?.thumbnail
                                                    }
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                                <div className="absolute top-[50%] left-[50%] w-12 h-12 flex items-center justify-center bg-[#0006] rounded-full translate-x-[-50%]  translate-y-[-50%]">
                                                    <Pause />
                                                </div>
                                            </div>
                                            <h1 className="text-xs font-semibold text-gray-400 uppercase pt-3">
                                                {anime?.name}
                                            </h1>
                                            <h1 className="my-2 line-clamp-2 text-lg font-medium">
                                                {chapter?.title}
                                            </h1>
                                            <div>
                                                <Tags tags={anime?.tags} />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[400px] flex items-center justify-center">
                                <h1 className="font-bold text-2xl">
                                    No Eposides are current uploaded.
                                </h1>
                            </div>
                        )}
                    </div>
                    <div className="mt-10" id="comments">
                        <div>
                            <h1 className="text-xl font-bold">
                                {anime?.comments_count}{" "}
                                {anime?.comments_count > 1
                                    ? "Comments"
                                    : "Comment"}
                            </h1>
                        </div>
                        <div className="w-full h-[1px] bg-gray-500 my-6"></div>
                        <div className="lg:w-[70%] w-full mb-10">
                            <div className="flex items-start gap-5 mb-16">
                                <div className="md:w-[60px] shrink-0 sm:block hidden w-[40px]">
                                    <img
                                        className="object-cover w-full md:h-[60px] h-[40px] rounded-full"
                                        src={anime?.thumbnail}
                                        alt=""
                                    />
                                </div>
                                <CommentForm anime={anime} />
                            </div>
                            <Comments
                                anime={anime}
                                comments={anime?.comments}
                            />
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </>
    );
};

export default VideoDetail;

VideoDetail.layout = (page) => <UserLayout>{page}</UserLayout>;
