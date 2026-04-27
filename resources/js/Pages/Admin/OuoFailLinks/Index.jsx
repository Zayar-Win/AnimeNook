import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    { field: "Group" },
    { field: "Type" },
    { field: "Chapter Title" },
    { field: "View Count" },
    { field: "Link" },
    { field: "Action" },
];

function AdminPagination({ meta }) {
    if (!meta?.links?.length || (meta?.last_page ?? 1) <= 1) return null;

    return (
        <nav
            className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            aria-label="Pagination"
        >
            {meta.links.map((link, i) => {
                const isDisabled = !link.url;
                const active = link.active;
                const content = (
                    <span
                        className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-bold sm:min-h-10 sm:min-w-10 sm:px-3 sm:text-sm ${
                            active
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "border border-white/10 bg-[#1a1a1a] text-zinc-300 hover:border-white/20 hover:bg-white/5"
                        } ${isDisabled ? "pointer-events-none opacity-35" : ""}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
                if (isDisabled) {
                    return (
                        <span key={i} className="inline-flex">
                            {content}
                        </span>
                    );
                }
                return (
                    <a key={i} href={link.url} className="inline-flex">
                        {content}
                    </a>
                );
            })}
        </nav>
    );
}

function FailLinkActions({ failLink, onRun, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => onRun(failLink)}
                className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/15"
            >
                Rerun
            </button>
            <button
                type="button"
                onClick={() => onDelete(failLink)}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/15"
            >
                Delete
            </button>
        </div>
    );
}

const Index = ({ failLinks }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFailLink, setSelectedFailLink] = useState(null);
    const [selectedFailLinkIds, setSelectedFailLinkIds] = useState([]);
    const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);
    const rows = failLinks?.data ?? [];

    const deleteHandler = () => {
        if (!selectedFailLink) return;
        router.post(
            window.route("admin.ouo.fail.links.delete", {
                failLink: selectedFailLink,
            }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedFailLink(null);
                },
            }
        );
    };

    const openDelete = (failLink) => {
        setSelectedFailLinkIds([]);
        setSelectedFailLink(failLink);
        setIsDeleteModalOpen(true);
    };

    const openBulkDelete = () => {
        if (!selectedFailLinkIds.length) return;
        setSelectedFailLink(null);
        setIsDeleteModalOpen(true);
    };

    const bulkDeleteHandler = () => {
        if (!selectedFailLinkIds.length) return;

        setIsBulkDeletePending(true);
        router.post(
            window.route("admin.ouo.fail.links.bulk-delete"),
            { fail_link_ids: selectedFailLinkIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedFailLinkIds([]);
                },
                onFinish: () => {
                    setIsBulkDeletePending(false);
                },
            }
        );
    };

    const runFailLink = (failLink) => {
        router.post(
            window.route("admin.ouo.fail.links.rerun", { failLink }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
            }
        );
    };

    const runAllFailLinks = () => {
        router.post(window.route("admin.ouo.fail.links.rerunAll"), {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                    <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden
                        >
                            <path d="m10 13-2 2a5 5 0 0 1-7-7l2-2" />
                            <path d="m14 11 2-2a5 5 0 0 1 7 7l-2 2" />
                            <path d="M8 16 16 8" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                            Ouo Fail Links
                        </h1>
                        <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                            Monitor and rerun broken generated links
                        </p>
                    </div>
                </div>
                <div className="w-full shrink-0 sm:w-auto">
                    <Button
                        text="Run All Fail Links"
                        type="button"
                        onClick={runAllFailLinks}
                        className="!block !w-full !rounded-xl !bg-primary !px-4 !py-3 !text-center !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!inline-block sm:!w-auto sm:!px-6"
                    />
                </div>
            </div>

            {failLinks?.total != null && failLinks.total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {failLinks.from ?? 0}–{failLinks.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {failLinks.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">
                            No failed links
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            No records to process right now.
                        </p>
                    </div>
                ) : (
                    rows.map((failLink) => (
                        <article
                            key={failLink.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <p className="text-sm font-bold text-white">
                                {failLink.chapter?.title ?? "Untitled chapter"}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Group: {failLink.group?.name ?? "—"}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-zinc-300">
                                    {failLink.chapter?.type ?? "—"}
                                </span>
                                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                                    Views {failLink.chapter?.view_count ?? 0}
                                </span>
                            </div>
                            <a
                                className="mt-3 block line-clamp-2 text-xs text-sky-300 underline-offset-2 hover:underline"
                                href={failLink.chapter?.chapter_link || "#"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {failLink.chapter?.chapter_link || "No Link"}
                            </a>
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                    Actions
                                </span>
                                <FailLinkActions
                                    failLink={failLink}
                                    onRun={runFailLink}
                                    onDelete={openDelete}
                                />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden md:block">
                {selectedFailLinkIds.length > 0 && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                            {selectedFailLinkIds.length} fail links selected
                        </p>
                        <button
                            type="button"
                            onClick={openBulkDelete}
                            disabled={isBulkDeletePending}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isBulkDeletePending ? "Deleting..." : "Delete Selected"}
                        </button>
                    </div>
                )}
                <Table
                    datas={failLinks}
                    columns={columns}
                    onSelectionChange={setSelectedFailLinkIds}
                >
                    <TableData>
                        {(failLink) => (
                            <p className="font-medium text-zinc-200">
                                {failLink.group?.name ?? "—"}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(failLink) => (
                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-zinc-300">
                                {failLink.chapter?.type ?? "—"}
                            </span>
                        )}
                    </TableData>
                    <TableData className={"min-w-[250px]"}>
                        {(failLink) => (
                            <p className="line-clamp-1 text-zinc-100">
                                {failLink.chapter?.title ?? "—"}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(failLink) => (
                            <p className="font-semibold text-zinc-300">
                                {failLink.chapter?.view_count ?? 0}
                            </p>
                        )}
                    </TableData>
                    <TableData className={"min-w-[280px]"}>
                        {(failLink) => (
                            <a
                                className="line-clamp-1 text-sky-300 underline-offset-2 hover:underline"
                                href={failLink.chapter?.chapter_link || "#"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {failLink.chapter?.chapter_link || "No Link"}
                            </a>
                        )}
                    </TableData>
                    <TableData>
                        {(failLink) => (
                            <FailLinkActions
                                failLink={failLink}
                                onRun={runFailLink}
                                onDelete={openDelete}
                            />
                        )}
                    </TableData>
                </Table>
            </div>

            <AdminPagination meta={failLinks} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={
                        selectedFailLink ? deleteHandler : bulkDeleteHandler
                    }
                    title={
                        selectedFailLink
                            ? "Are you sure want to delete this fail link."
                            : `Are you sure you want to delete ${selectedFailLinkIds.length} fail links?`
                    }
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
