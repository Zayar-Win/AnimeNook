import React from "react";
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
            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={item.thumbnail}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={item.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                    {/* Floating Action Button */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            removeCollectionItem();
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white/70 hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                        <Delete className="w-4 h-4" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col grow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h1 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                            {item.name}
                        </h1>
                    </div>

                    <p className="text-zinc-400 text-sm leading-snug line-clamp-2 mb-4 grow">
                        {item.description}
                    </p>

                    <div className="space-y-3 mt-auto border-t border-white/5 pt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                {type === "anime"
                                    ? "Start Watching"
                                    : "Start Reading"}
                            </span>
                            <span className="text-xs font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded">
                                Ep 1
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            <Tags
                                tags={item.tags?.slice(0, 2)}
                                className="!text-[10px] !px-2 !py-0.5"
                            />
                            {item.tags?.length > 2 && (
                                <span className="text-[10px] text-zinc-500 self-center font-medium pl-1">
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
