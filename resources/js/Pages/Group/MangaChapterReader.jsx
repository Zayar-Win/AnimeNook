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
        <SectionContainer className="min-h-screen bg-white pb-16 text-zinc-900 dark:bg-black dark:text-white">
            <div className="sticky top-20 z-40 mb-8 border-b border-zinc-200 bg-white/90 py-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/90">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href={window.route("group.manga.detail", {
                            manga: manga.slug,
                        })}
                        className="text-sm font-bold text-zinc-600 transition-colors hover:text-primary dark:text-zinc-400"
                    >
                        ← {manga.name}
                    </Link>
                    <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
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
                            className="w-full min-w-0 cursor-pointer appearance-none rounded-xl border border-zinc-300 bg-white bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat py-2.5 pl-3 pr-10 text-sm font-bold text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:flex-1 dark:border-white/15 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-primary"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
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
                                className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-900 transition-all hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                            >
                                Prev
                            </Link>
                        ) : (
                            <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-400 dark:border-white/5 dark:bg-white/5 dark:text-zinc-600">
                                Prev
                            </span>
                        )}
                        {nextChapterId ? (
                            <Link
                                href={chapterHref(nextChapterId)}
                                className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-black transition-all hover:bg-primary/90"
                            >
                                Next
                            </Link>
                        ) : (
                            <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-400 dark:border-white/5 dark:bg-white/5 dark:text-zinc-600">
                                Next
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mb-5 sm:mb-6">
                <h1 className="break-words text-lg font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                    {chapterHeading}
                </h1>
                {chapter?.description ? (
                    <div
                        className="mt-2 break-words text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 [&_a]:text-primary [&_a]:underline [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_mark]:rounded [&_mark]:bg-yellow-300/60 [&_mark]:px-0.5"
                        dangerouslySetInnerHTML={{
                            __html: chapter.description,
                        }}
                    />
                ) : null}
            </div>

            {!readerMode && (
                <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-20 text-center dark:border-white/10 dark:bg-white/5">
                    <p className="font-medium text-zinc-600 dark:text-zinc-300">
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
                <div className="mx-auto max-w-4xl space-y-2 md:space-y-4">
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-[#0a0a0a]"
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
                <div className="mx-auto min-h-[80vh] max-w-6xl overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-[#0a0a0a]">
                    <iframe
                        title={chapter.title}
                        src={chapter.pdf_path}
                        className="min-h-[85vh] w-full bg-zinc-100 dark:bg-zinc-900"
                    />
                </div>
            )}
        </SectionContainer>
    );
};

export default MangaChapterReader;
MangaChapterReader.layout = (page) => <UserLayout>{page}</UserLayout>;
