import React from "react";
import { mangaThumbnailUrl } from "@/app";
import Tags from "./Tags";
import Delete from "@/../assets/Delete";
import { router } from "@inertiajs/react";

const SaveItemCard = ({ item, type, itemId, collectionId }) => {
    const removeCollectionItem = () => {
        router.post(
            window.route("group.remove.save.item", {
                collection: collectionId,
                item: itemId,
            }),
            {},
            {
                preserveScroll: true,
            }
        );
    };
    return (
        <div
            className="group relative cursor-pointer h-full"
            onClick={() => {
                type === "anime"
                    ? router.get(
                          window.route("group.anime.detail", { anime: item })
                      )
                    : router.get(
                          window.route("group.manga.detail", { manga: item })
                      );
            }}
        >
            <div className="flex h-full flex-row gap-3 overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/10 dark:border-white/5 dark:bg-[#1a1a1a] dark:hover:border-white/10 dark:hover:shadow-black/50 md:flex-col md:gap-0 md:p-0 md:hover:-translate-y-1 md:hover:shadow-xl">
                {/* Thumbnail — compact portrait on mobile, wide strip on md+ */}
                <div className="relative h-[5.25rem] w-[3.5rem] shrink-0 overflow-hidden rounded-md sm:h-[6rem] sm:w-16 md:h-auto md:w-full md:rounded-none md:aspect-video">
                    <img
                        src={
                            type === "manga"
                                ? item.thumbnail || mangaThumbnailUrl
                                : item.thumbnail
                        }
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={item.name}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 md:from-black/80 md:opacity-60"></div>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            removeCollectionItem();
                        }}
                        className="absolute right-0.5 top-0.5 rounded-full bg-black/55 p-1.5 text-white/90 backdrop-blur-sm transition-all hover:bg-red-500 hover:text-white md:right-2 md:top-2 md:p-2 md:opacity-0 md:translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    >
                        <Delete className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 md:grow md:p-4 md:gap-0">
                    <div className="min-w-0 md:mb-2">
                        <h1 className="line-clamp-2 text-sm font-bold leading-snug text-zinc-900 transition-colors group-hover:text-primary sm:line-clamp-1 md:text-lg dark:text-white">
                            {item.name}
                        </h1>
                    </div>

                    <p className="line-clamp-1 text-xs leading-snug text-zinc-600 dark:text-zinc-400 sm:line-clamp-2 md:mb-4 md:grow md:text-sm md:line-clamp-2">
                        {item.description}
                    </p>

                    <div className="mt-auto space-y-1.5 border-t border-zinc-100 pt-2 dark:border-white/5 md:space-y-3 md:pt-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-primary sm:text-xs md:tracking-wider">
                                {type === "anime"
                                    ? "Start Watching"
                                    : "Start Reading"}
                            </span>
                            <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-white/5 dark:text-zinc-500 md:px-2 md:py-1 md:text-xs">
                                Ep 1
                            </span>
                        </div>

                        <div className="hidden flex-wrap gap-1 sm:flex">
                            <Tags
                                tags={item.tags?.slice(0, 2)}
                                className="!text-[10px] !px-2 !py-0.5"
                            />
                            {item.tags?.length > 2 && (
                                <span className="self-center pl-1 text-[10px] font-medium text-zinc-500">
                                    +{item.tags.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaveItemCard;
