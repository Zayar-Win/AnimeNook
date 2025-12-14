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
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={manga?.thumbnail}
                        alt={manga?.name}
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                        <div className="bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                            Ch {manga?.chapters_count || "?"}
                        </div>
                        {manga?.latestWatchedChapter && (
                            <div className="bg-green-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                                Read:{" "}
                                {manga?.latestWatchedChapter?.chapter_number}
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
                <div className="mt-3 space-y-1">
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {manga?.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="truncate max-w-[70%]">
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

export default MangaCard;
