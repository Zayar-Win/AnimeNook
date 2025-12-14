import React from "react";
import { usePage, router, Link } from "@inertiajs/react";
import Button from "./Button";

const MovieCard = ({ anime }) => {
    const {
        auth: { user },
    } = usePage().props;

    const addToWatchList = (e) => {
        e.preventDefault();
        e.stopPropagation();

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
        <div className="group relative w-full">
            <Link href={window.route("group.anime.detail", { anime })}>
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={anime?.thumbnail}
                        alt={anime?.name}
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                        <div className="bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                            Ep {anime?.chapters_count || "?"}
                        </div>
                        {anime?.latestWatchedChapter && (
                            <div className="bg-green-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                                Watched:{" "}
                                {anime?.latestWatchedChapter?.chapter_number}
                            </div>
                        )}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-yellow-400"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        {anime?.rating
                            ? parseFloat(anime?.rating).toFixed(1)
                            : "N/A"}
                    </div>

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-3 space-y-1">
                    <h3 className="text-zinc-900 font-bold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {anime?.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="truncate max-w-[70%]">
                            {anime?.type || "Anime"} •{" "}
                            {new Date(anime?.created_at).getFullYear()}
                        </span>

                        <button
                            onClick={addToWatchList}
                            className={`transition-colors hover:text-primary ${
                                anime?.isSavedByCurrentUser
                                    ? "text-primary"
                                    : "text-zinc-400"
                            }`}
                        >
                            {anime?.isSavedByCurrentUser ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M5 21V3h14v18l-7-3l-7 3Z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;
