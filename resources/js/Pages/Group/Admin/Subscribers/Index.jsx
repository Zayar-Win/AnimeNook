import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

const columns = [{ field: "Email" }, { field: "Actions" }];

function SubscriberRowActions({ subscriber, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link
                href={window.route("group.admin.subscribers.edit", {
                    subscriber,
                })}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:h-auto sm:w-auto sm:p-2"
                title="Edit subscriber"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </Link>
            <button
                type="button"
                onClick={() => onDelete(subscriber)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 sm:h-auto sm:w-auto sm:p-2"
                title="Delete subscriber"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
    );
}

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
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        className="inline-flex"
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}

function SubscriberFiltersToolbar({
    search,
    setSearch,
    searchInputRef,
    period,
    setPeriod,
    onClear,
    hasActiveFilters,
}) {
    return (
        <div className="mb-5 rounded-2xl border border-white/5 bg-[#1a1a1a]/80 p-4 shadow-inner sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-4">
                <div className="lg:col-span-6">
                    <label
                        htmlFor="subscriber-search"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </span>
                        <input
                            ref={searchInputRef}
                            id="subscriber-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by email…"
                            autoComplete="off"
                            className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                        />
                    </div>
                </div>
                <div className="sm:col-span-1 lg:col-span-4">
                    <label
                        htmlFor="subscriber-period"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Subscribed
                    </label>
                    <select
                        id="subscriber-period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 py-2.5 text-sm text-white outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="">All time</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                </div>
                <div className="flex items-end lg:col-span-2">
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasActiveFilters}
                        className="h-[42px] w-full rounded-xl border border-white/10 px-3 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

function formatSubscribedAt(iso) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "—";
    }
}

const Index = ({ subscribers, filters = {} }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const [selectedSubscriberIds, setSelectedSubscriberIds] = useState([]);
    const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);
    const [search, setSearch] = useState(filters?.search ?? "");
    const [period, setPeriod] = useState(filters?.period ?? "");
    const searchInputRef = useRef(null);
    const periodSkipRef = useRef(true);
    const rows = subscribers?.data ?? [];

    const buildQuery = (page = 1) => ({
        page,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(period ? { period } : {}),
    });

    const fetchSubscribers = (page = 1) => {
        router.get(
            window.route("group.admin.subscribers"),
            buildQuery(page),
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            }
        );
    };

    useEffect(() => {
        if (document.activeElement === searchInputRef.current) return;
        setSearch(filters?.search ?? "");
    }, [filters?.search]);

    useEffect(() => {
        setPeriod(filters?.period ?? "");
    }, [filters?.period]);

    useEffect(() => {
        const id = setTimeout(() => {
            const applied = (filters?.search ?? "").trim();
            if (search.trim() === applied) return;
            fetchSubscribers(1);
        }, 420);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        if (periodSkipRef.current) {
            periodSkipRef.current = false;
            return;
        }
        fetchSubscribers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    const hasActiveFilters = Boolean(search.trim()) || Boolean(period);

    const clearFilters = () => {
        periodSkipRef.current = true;
        setSearch("");
        setPeriod("");
        router.get(
            window.route("group.admin.subscribers"),
            { page: 1 },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const openDelete = (subscriber) => {
        setSelectedSubscriberIds([]);
        setSelectedSubscriber(subscriber);
        setIsDeleteModalOpen(true);
    };

    const openBulkDelete = () => {
        if (!selectedSubscriberIds.length) return;
        setSelectedSubscriber(null);
        setIsDeleteModalOpen(true);
    };

    const deleteHandler = () => {
        if (!selectedSubscriber) return;

        router.post(
            window.route("group.admin.subscribers.delete", {
                subscriber: selectedSubscriber,
            }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedSubscriber(null);
                },
            }
        );
    };

    const bulkDeleteHandler = () => {
        if (!selectedSubscriberIds.length) return;

        setIsBulkDeletePending(true);
        router.post(
            window.route("group.admin.subscribers.bulk-delete"),
            { subscriber_ids: selectedSubscriberIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedSubscriberIds([]);
                },
                onFinish: () => {
                    setIsBulkDeletePending(false);
                },
            }
        );
    };

    const emptyMessage = hasActiveFilters
        ? "No subscribers match your filters."
        : "There are no newsletter subscribers yet.";

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                    <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                        >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                            Subscribers
                        </h1>
                        <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                            Newsletter emails for this group
                        </p>
                    </div>
                </div>
            </div>

            <SubscriberFiltersToolbar
                search={search}
                setSearch={setSearch}
                searchInputRef={searchInputRef}
                period={period}
                setPeriod={setPeriod}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {subscribers?.total != null && subscribers.total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {subscribers.from ?? 0}–{subscribers.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {subscribers.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">
                            No subscribers
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    rows.map((subscriber) => (
                        <article
                            key={subscriber.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <p className="break-all font-semibold text-white">
                                {subscriber.email}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Subscribed{" "}
                                <span className="text-zinc-400">
                                    {formatSubscribedAt(
                                        subscriber.created_at
                                    )}
                                </span>
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                    Actions
                                </span>
                                <SubscriberRowActions
                                    subscriber={subscriber}
                                    onDelete={openDelete}
                                />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden md:block">
                {selectedSubscriberIds.length > 0 && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                            {selectedSubscriberIds.length} subscribers selected
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
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] shadow-xl shadow-black/50">
                    <Table
                        datas={subscribers}
                        columns={columns}
                        onSelectionChange={setSelectedSubscriberIds}
                    >
                        <TableData>
                            {(subscriber) => (
                                <p className="font-medium text-zinc-300">
                                    {subscriber.email}
                                </p>
                            )}
                        </TableData>
                        <TableData>
                            {(subscriber) => (
                                <SubscriberRowActions
                                    subscriber={subscriber}
                                    onDelete={openDelete}
                                />
                            )}
                        </TableData>
                    </Table>
                </div>
            </div>

            <AdminPagination meta={subscribers} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={
                        selectedSubscriber ? deleteHandler : bulkDeleteHandler
                    }
                    title={
                        selectedSubscriber
                            ? "Are you sure you want to delete this subscriber?"
                            : `Are you sure you want to delete ${selectedSubscriberIds.length} subscribers?`
                    }
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
