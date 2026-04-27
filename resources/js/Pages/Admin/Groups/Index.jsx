import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import moment from "moment";
import React, { useState } from "react";

const columns = [
    { field: "Name" },
    { field: "SubDomain", minWidth: "50px" },
    { field: "Logo" },
    { field: "Plan" },
    { field: "Start Date" },
    { field: "Expire Date" },
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

function GroupRowActions({ group, onDelete, onAddOneMonth }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link
                href={window.route("admin.groups.edit", { group })}
                className="flex h-10 min-w-[4.2rem] items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-bold text-primary transition hover:bg-primary/10 sm:h-9"
            >
                Edit
            </Link>
            <button
                type="button"
                onClick={() => onDelete(group)}
                className="flex h-10 min-w-[4.2rem] items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-bold text-red-400 transition hover:bg-red-500/10 sm:h-9"
            >
                Delete
            </button>
            <button
                type="button"
                onClick={() => onAddOneMonth(group)}
                className="flex h-10 min-w-[7.5rem] items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-bold text-zinc-200 transition hover:bg-white/10 sm:h-9"
            >
                Add One Month
            </button>
        </div>
    );
}

const Index = ({ groups }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupIds, setSelectedGroupIds] = useState([]);
    const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);
    const groupRows = groups?.data ?? [];

    const deleteHandler = () => {
        if (!selectedGroup) return;

        router.post(
            window.route("admin.groups.delete", { group: selectedGroup }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedGroup(null);
                },
            },
        );
    };

    const openDelete = (group) => {
        setSelectedGroupIds([]);
        setSelectedGroup(group);
        setIsDeleteModalOpen(true);
    };

    const openBulkDelete = () => {
        if (!selectedGroupIds.length) return;
        setSelectedGroup(null);
        setIsDeleteModalOpen(true);
    };

    const bulkDeleteHandler = () => {
        if (!selectedGroupIds.length) return;

        setIsBulkDeletePending(true);
        router.post(
            window.route("admin.groups.bulk-delete"),
            { group_ids: selectedGroupIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedGroupIds([]);
                },
                onFinish: () => {
                    setIsBulkDeletePending(false);
                },
            }
        );
    };

    const addOneMonth = (group) => {
        router.post(
            window.route("admin.groups.updateSubscription", { group }),
            {},
            { preserveScroll: true },
        );
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
                            <path d="M3 21h18" />
                            <path d="M5 21V7l8-4v18" />
                            <path d="M19 21V11l-6-4" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                            Group Management
                        </h1>
                        <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                            Manage communities, subscriptions, and domain access
                        </p>
                    </div>
                </div>
                <div className="w-full shrink-0 sm:w-auto">
                    <Button
                        text="Create Group"
                        type="link"
                        href={window.route("admin.groups.create")}
                        className="!block !w-full !rounded-xl !bg-primary !px-4 !py-3 !text-center !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!inline-block sm:!w-auto sm:!px-6"
                    />
                </div>
            </div>

            {groups?.total != null && groups.total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {groups.from ?? 0}–{groups.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {groups.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {groupRows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">
                            No groups yet
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            There are no records to display.
                        </p>
                    </div>
                ) : (
                    groupRows.map((group) => (
                        <article
                            key={group.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <div className="flex gap-3">
                                <img
                                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/10"
                                    src={group.logo}
                                    alt={group.name}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-bold text-white">
                                        {group.name}
                                    </p>
                                    <Link
                                        className="mt-0.5 inline-block truncate text-sm font-medium text-primary hover:underline"
                                        href={window.route("group.home", {
                                            group,
                                        })}
                                    >
                                        {group.subdomain}
                                    </Link>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-zinc-300 ring-1 ring-white/10">
                                            {group.plan?.name ?? "No plan"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-1 gap-1 text-xs text-zinc-400">
                                <p>
                                    <span className="font-semibold text-zinc-300">
                                        Start:
                                    </span>{" "}
                                    {moment(group.start_date).format(
                                        "MMM DD, YYYY hh:mm",
                                    )}
                                </p>
                                <p>
                                    <span className="font-semibold text-zinc-300">
                                        Expire:
                                    </span>{" "}
                                    {moment(group.expire_date).format(
                                        "MMM DD, YYYY hh:mm",
                                    )}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                    Actions
                                </span>
                                <GroupRowActions
                                    group={group}
                                    onDelete={openDelete}
                                    onAddOneMonth={addOneMonth}
                                />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden md:block">
                {selectedGroupIds.length > 0 && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                            {selectedGroupIds.length} groups selected
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
                    datas={groups}
                    columns={columns}
                    onSelectionChange={setSelectedGroupIds}
                >
                    <TableData>
                        {(group) => (
                            <p className="text-sm font-bold text-white">
                                {group.name}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(group) => (
                            <Link
                                className="font-semibold text-primary hover:underline"
                                href={window.route("group.home", { group })}
                            >
                                {group.subdomain}
                            </Link>
                        )}
                    </TableData>
                    <TableData>
                        {(group) => (
                            <img
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                                src={group.logo}
                                alt={group.name}
                            />
                        )}
                    </TableData>
                    <TableData>
                        {(group) => (
                            <p className="font-semibold capitalize text-zinc-300">
                                {group.plan?.name ?? "No plan"}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(group) => (
                            <p className="text-xs text-zinc-400">
                                {moment(group.start_date).format(
                                    "MMM DD, YYYY hh:mm",
                                )}
                            </p>
                        )}
                    </TableData>
                    <TableData>
                        {(group) => (
                            <p className="text-xs text-zinc-400">
                                {moment(group.expire_date).format(
                                    "MMM DD, YYYY hh:mm",
                                )}
                            </p>
                        )}
                    </TableData>
                    <TableData className="min-w-[320px]">
                        {(group) => (
                            <GroupRowActions
                                group={group}
                                onDelete={openDelete}
                                onAddOneMonth={addOneMonth}
                            />
                        )}
                    </TableData>
                </Table>
            </div>

            <AdminPagination meta={groups} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={selectedGroup ? deleteHandler : bulkDeleteHandler}
                    title={
                        selectedGroup
                            ? "Are you sure want to delete this group."
                            : `Are you sure you want to delete ${selectedGroupIds.length} groups?`
                    }
                />
            )}
        </div>
    );
};

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Index;
