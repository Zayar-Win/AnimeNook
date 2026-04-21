import SectionContainer from "@/Components/SectionContainer";
import UserLayout from "@/Layouts/UserLayout";
import { Link, router } from "@inertiajs/react";
import React from "react";

const MangaChapterReader = ({
    manga,
    chapter,
    images,
    readerMode,
    prevChapterId,
    nextChapterId,
    chapterOptions = [],
}) => {
    const chapterHref = (chapterId) =>
        window.route("group.manga.chapter.read", {
            manga: manga.slug,
            chapter: chapterId,
        });

    const chapterHeading = (() => {
        const n = chapter.chapter_number;
        const t = (chapter.title ?? "").trim();
        if (t && n != null && n !== "") {
            return `Ch. ${n} — ${t}`;
        }
        if (t) return t;
        if (n != null && n !== "") return `Chapter ${n}`;
        return "Chapter";
    })();

    return (
        <SectionContainer className="bg-black text-white min-h-screen pb-16">
            <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/10 py-4 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href={window.route("group.manga.detail", {
                            manga: manga.slug,
                        })}
                        className="text-sm font-bold text-zinc-400 hover:text-primary transition-colors"
                    >
                        ← {manga.name}
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 max-w-2xl mx-auto w-full">
                        <label className="sr-only" htmlFor="reader-chapter-select">
                            Jump to chapter
                        </label>
                        <select
                            id="reader-chapter-select"
                            value={chapter.id}
                            onChange={(e) => {
                                const id = parseInt(e.target.value, 10);
                                if (
                                    id &&
                                    id !== chapter.id &&
                                    !Number.isNaN(id)
                                ) {
                                    router.visit(chapterHref(id), {
                                        preserveScroll: false,
                                    });
                                }
                            }}
                            className="w-full sm:flex-1 min-w-0 rounded-xl border border-white/15 bg-[#1a1a1a] text-white text-sm font-bold py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            }}
                        >
                            {chapterOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        {prevChapterId ? (
                            <Link
                                href={chapterHref(prevChapterId)}
                                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold hover:border-primary/50 hover:text-primary transition-all"
                            >
                                Prev
                            </Link>
                        ) : (
                            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm font-bold text-zinc-600">
                                Prev
                            </span>
                        )}
                        {nextChapterId ? (
                            <Link
                                href={chapterHref(nextChapterId)}
                                className="px-3 py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-all"
                            >
                                Next
                            </Link>
                        ) : (
                            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm font-bold text-zinc-600">
                                Next
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mb-5 sm:mb-6">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight break-words">
                    {chapterHeading}
                </h1>
            </div>

            {!readerMode && (
                <div className="max-w-xl mx-auto text-center py-20 px-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-zinc-300 font-medium">
                        This chapter has no uploaded pages yet. Check back after
                        the group adds images or a PDF.
                    </p>
                    <Link
                        href={window.route("group.manga.detail", {
                            manga: manga.slug,
                        })}
                        className="inline-block mt-6 text-primary font-bold hover:underline"
                    >
                        Back to series
                    </Link>
                </div>
            )}

            {readerMode === "images" && (
                <div className="max-w-4xl mx-auto space-y-2 md:space-y-4">
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className="rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0a]"
                        >
                            <img
                                src={src}
                                alt={`Page ${i + 1}`}
                                className="w-full h-auto block"
                                loading={i < 3 ? "eager" : "lazy"}
                            />
                        </div>
                    ))}
                </div>
            )}

            {readerMode === "pdf" && chapter.pdf_path && (
                <div className="max-w-6xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] min-h-[80vh]">
                    <iframe
                        title={chapter.title}
                        src={chapter.pdf_path}
                        className="w-full min-h-[85vh] bg-zinc-900"
                    />
                </div>
            )}
        </SectionContainer>
    );
};

export default MangaChapterReader;
MangaChapterReader.layout = (page) => <UserLayout>{page}</UserLayout>;
