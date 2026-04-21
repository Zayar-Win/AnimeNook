import { mangaThumbnailUrl } from "@/app";
import React from "react";
import { Link, router, usePage } from "@inertiajs/react";

const MangaCard = ({ manga }) => {
    const {
        auth: { user },
    } = usePage().props;

    const saveToCollection = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            return router.get(window.route("group.login"));
        }
        router.post(
            window.route("group.item.save", {
                collection: user.collections[0],
            }),
            {
                id: manga.id,
                type: "manga",
            },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="group relative w-full">
            <Link href={window.route("group.manga.detail", manga)}>
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-900 sm:aspect-[3/4] sm:rounded-xl">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={manga?.thumbnail || mangaThumbnailUrl}
                        alt={manga?.name}
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Top Badges */}
                    <div className="absolute left-1 top-1 flex flex-col gap-1 sm:left-2 sm:top-2 sm:gap-1.5">
                        <div className="rounded bg-purple-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-sm sm:rounded-md sm:px-2 sm:text-[10px]">
                            Ch {manga?.chapters_count || "?"}
                        </div>
                        {manga?.latestWatchedChapter && (
                            <div className="rounded bg-green-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-sm sm:rounded-md sm:px-2 sm:text-[10px]">
                                Read:{" "}
                                {manga?.latestWatchedChapter?.chapter_number}
                            </div>
                        )}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute right-1 top-1 flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm sm:right-2 sm:top-2 sm:gap-1 sm:rounded-md sm:px-2 sm:text-[10px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-2.5 w-2.5 shrink-0 text-yellow-400 sm:h-3 sm:w-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        {manga?.rating
                            ? parseFloat(manga?.rating).toFixed(1)
                            : "N/A"}
                    </div>

                    {/* Hover Read Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20">
                        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
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
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-1.5 space-y-0.5 sm:mt-3 sm:space-y-1">
                    <h3 className="line-clamp-2 text-[11px] font-bold leading-snug text-white transition-colors group-hover:text-purple-600 sm:line-clamp-1 sm:text-sm sm:leading-tight">
                        {manga?.name}
                    </h3>

                    <div className="flex items-center justify-between gap-1 text-[10px] text-zinc-500 sm:text-xs">
                        <span className="max-w-[65%] truncate sm:max-w-[70%]">
                            Manga •{" "}
                            {new Date(
                                manga?.updated_at || Date.now()
                            ).getFullYear()}
                        </span>

                        <button
                            onClick={saveToCollection}
                            className={`transition-colors hover:text-purple-600 ${
                                manga?.isSavedByCurrentUser
                                    ? "text-purple-600"
                                    : "text-zinc-400"
                            }`}
                        >
                            {manga?.isSavedByCurrentUser ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M5 21V3h14v18l-7-3l-7 3Z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
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

export default MangaCard;
