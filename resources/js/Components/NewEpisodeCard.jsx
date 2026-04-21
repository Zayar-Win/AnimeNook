import { formateDate } from "@/app";
import { Link } from "@inertiajs/react";
import React from "react";

const NewEpisodeCard = ({ episode }) => {
    const isMangaChapter = episode?.type === "manga";
    const internalHref =
        isMangaChapter &&
        episode?.chapterable?.slug &&
        episode?.id != null
            ? window.route("group.manga.chapter.read", {
                  manga: episode.chapterable.slug,
                  chapter: episode.id,
              })
            : null;
    const externalHref = episode?.chapter_link || "#";
    const numberLabel = isMangaChapter ? "Ch" : "EP";
    const subtitleFallback = isMangaChapter
        ? `Chapter ${episode?.chapter_number}`
        : `Episode ${episode?.chapter_number}`;

    const cardClassName =
        "group block relative rounded-xl overflow-hidden transition-colors duration-300 border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-primary/40 dark:border-white/5 dark:bg-[#1a1a1a] dark:hover:bg-[#222] dark:hover:border-primary/30";

    const inner = (
        <>
            <div className="flex gap-4 p-3">
                <div className="shrink-0 w-[100px] sm:w-[120px] aspect-video relative rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={episode?.chapterable?.thumbnail}
                        alt=""
                        loading="lazy"
                    />

                    <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {numberLabel} {episode?.chapter_number}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                        <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-1 text-zinc-900 transition-colors group-hover:text-primary dark:text-white">
                        {episode?.chapterable?.name}
                    </h3>

                    <p className="text-xs sm:text-sm line-clamp-1 font-medium text-zinc-600 dark:text-zinc-400">
                        {episode?.title || subtitleFallback}
                    </p>

                    <div className="mt-1 flex items-center gap-3 text-[11px] font-medium text-zinc-500 sm:text-xs">
                        <span className="text-primary">
                            {formateDate(episode?.created_at)}
                        </span>
                        {episode?.chapterable?.type && (
                            <>
                                <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                                <span>{episode?.chapterable?.type}</span>
                            </>
                        )}
                        <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                        <span className="flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            {episode?.comments_count || 0}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );

    if (internalHref) {
        return (
            <Link href={internalHref} className={cardClassName}>
                {inner}
            </Link>
        );
    }

    return (
        <a
            href={externalHref}
            target="_blank"
            rel="noreferrer"
            className={cardClassName}
        >
            {inner}
        </a>
    );
};

export default NewEpisodeCard;
