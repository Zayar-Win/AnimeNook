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
                <div className="flex items-start py-10 md:flex-row flex-col">
                    <div className="md:basis-[30%] w-full flex items-center justify-center">
                        <div className="md:w-[70%] w-full">
                            <img
                                src={manga.thumbnail}
                                className="w-full rounded-lg md:min-h-[400px] h-[300px] object-cover"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="basis-[70%] md:mt-0 mt-8">
                        <div className="flex items-center gap-6">
                            <h1 className={"text-2xl font-extrabold"}>
                                {manga.name}
                            </h1>
                            <div
                                className={
                                    "bg-primary px-3 py-1 text-sm font-semibold rounded-3xl text-white"
                                }
                            >
                                <span>{manga.status.name}</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Tags tags={manga?.tags} />
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="text-primary"
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
                                <span className="font-extrabold">
                                    {manga?.views_count}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg
                                    className="text-primary"
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
                                <span className="font-extrabold">
                                    {manga?.likes_count}
                                </span>
                            </div>
                        </div>
                        <div className="my-5">
                            <div className="flex items-center gap-3">
                                <Rating ratingHandler={ratingHandler} />
                                <span className="inline-block h-6 mx-1 border-l-2 border-gray-500"></span>
                                <div>
                                    <div className="font-medium text-white">
                                        Average Rating:{" "}
                                        <span className="text-white font-bold">
                                            {manga?.rating}(
                                            {manga?.ratings_count})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-white">{manga?.description}</p>
                        <div className="my-3">
                            <p className="text-sm font-bold text-white">
                                Uploaded at : {formateDate(manga?.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex sm:items-center sm:flex-row flex-col lg:flex-nowrap flex-wrap gap-5 my-4">
                    {manga?.chapters[0] && (
                        <a href={manga.chapters[0].chapter_link} className="">
                            <Button
                                className={
                                    "!bg-primary !px-8 rounded-none w-full !gap-1"
                                }
                                text={
                                    manga?.latestWatchedChapter
                                        ? `Continue Reading Ep${manga?.latestWatchedChapter.chapter_number}`
                                        : "Start Reading " +
                                          manga.chapters[0]?.name
                                }
                                type="button"
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
                        </a>
                    )}
                    <Button
                        text={
                            manga.isSaveByCurrentUser
                                ? "Saved To Collection"
                                : "Save To Collection"
                        }
                        type={"button"}
                        onClick={saveToCollection}
                        className={"!bg-primary !px-8 rounded-none !gap-1"}
                        Icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
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
                        className={"!bg-primary !px-8 rounded-none !gap-1"}
                        Icon={<Liked className={"text-white"} />}
                    />
                    <Button
                        text={"Share"}
                        className={"!bg-primary !px-8 rounded-none !gap-1"}
                        Icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
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
                <div className="w-full h-[1px] bg-gray-300 my-10"></div>
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
                                    {manga?.name}{" "}
                                    {manga.chapters.length
                                        ? ` : ${manga.chapters[0].season.title}`
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
                                                    "group.manga.detail",
                                                    {
                                                        manga: manga,
                                                        season: season.season_number,
                                                    }
                                                )}
                                                preserveScroll={true}
                                            >
                                                <li className="px-[15px] gap-3 py-[10px] flex justify-between !cursor-pointer hover:bg-gray-900">
                                                    <div className="line-clamp-1">
                                                        {manga.name} :{" "}
                                                        {season.title}
                                                    </div>
                                                    <p className="shrink-0">
                                                        {season.chapters_count}{" "}
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
                            {manga?.name}
                        </h1>
                    )}
                </div>
                <h1 className="text-2xl font-bold mt-3">Eposides</h1>
                <div>
                    {manga?.chapters.length > 0 ? (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 grid-cols-1 mt-4 gap-5 pb-5">
                            {manga?.chapters.map((chapter, i) => (
                                <a key={i} href={chapter.chapter_link}>
                                    <div className="bg-gray-100 cursor-pointer px-5 py-4 rounded-lg">
                                        <h3 className="text-md text-black font-semibold">
                                            {chapter?.title}
                                        </h3>
                                        <div className="flex sm:mt-0 mt-3 sm:flex-nowrap flex-wrap items-center gap-3 text-black">
                                            <span>
                                                {formateDate(
                                                    chapter?.created_at,
                                                    {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                    },
                                                    "-"
                                                )}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Heart className={"w-5 h-5"} />
                                                <span>
                                                    {chapter?.like_count}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Comment
                                                    className={"w-5 h-5"}
                                                />
                                                <span>
                                                    {chapter?.comments_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center h-[400px] flex items-center justify-center text-xl font-semibold text-whites">
                            <p>Currently No Eposides Are Uploaded.</p>
                        </div>
                    )}
                </div>
            </SectionContainer>
            <SectionContainer className={"bg-[#0D0D0D]"}>
                <div>
                    <div>
                        <h1 className="text-xl font-bold">100 Comments</h1>
                    </div>
                    <div className="w-full h-[1px] bg-gray-500 my-6"></div>
                    <div className="lg:w-[70%] w-full">
                        <div className="flex items-start gap-5 mb-16">
                            <div className="md:w-[60px] shrink-0 sm:block hidden w-[40px]">
                                <img
                                    className="object-cover md:w-[60px] w-full md:h-[60px] h-[40px] rounded-full"
                                    src={manga?.thumbnail}
                                    alt=""
                                />
                            </div>
                            <CommentForm manga={manga} />
                        </div>
                        <Comments comments={manga?.comments} manga={manga} />
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
                        <div className="grid mt-6 xl:grid-cols-4  lg:grid-cols-3 md:grid-cols-2 xl:gap-4 gap-2">
                            {recommendedMangas?.data.map((manga, i) => (
                                <MangaCard key={i} manga={manga} />
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
