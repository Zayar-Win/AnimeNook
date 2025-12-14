import { formateDate } from "@/app";
import React from "react";

const NewEpisodeCard = ({ episode }) => {
    return (
        <a
            href={episode.chapter_link}
            target="_blank"
            rel="noreferrer"
            className="group block relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#222] transition-colors duration-300 border border-white/5 hover:border-primary/30"
        >
            <div className="flex gap-4 p-3">
                {/* Image Container */}
                <div className="shrink-0 w-[100px] sm:w-[120px] aspect-video relative rounded-lg overflow-hidden bg-zinc-800">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={episode?.chapterable?.thumbnail}
                        alt="Anime Thumbnail"
                        loading="lazy"
                    />
                    
                    {/* Episode Number Overlay */}
                    <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        EP {episode?.chapter_number}
                    </div>

                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                        <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {episode?.chapterable?.name}
                    </h3>
                    
                    <p className="text-zinc-400 text-xs sm:text-sm line-clamp-1 font-medium">
                        {episode?.title || `Episode ${episode?.chapter_number}`}
                    </p>

                    <div className="flex items-center gap-3 mt-1 text-[11px] sm:text-xs font-medium text-zinc-500">
                        <span className="text-primary">{formateDate(episode?.created_at)}</span>
                        {episode?.chapterable?.type && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                <span>{episode?.chapterable?.type}</span>
                            </>
                        )}
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            {episode?.comments_count || 0}
                        </span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default NewEpisodeCard;
