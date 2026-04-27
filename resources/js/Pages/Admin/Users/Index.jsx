import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    { field: "Name" },
    { field: "Profile", minWidth: "50px" },
    { field: "Email" },
    { field: "Role" },
    { field: "Type" },
    { field: "Action" },
];

function UserAvatar({ user, large = false }) {
    const initial = (user?.name || "?").trim().charAt(0).toUpperCase() || "?";
    const size = large ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
    if (user?.profile_picture) {
        return (
            <img
                className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white/10`}
                src={user.profile_picture}
                alt={user.name}
            />
        );
    }
    return (
        <div
            className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 font-bold text-white ring-2 ring-white/10`}
        >
            {initial}
        </div>
    );
}

function UserRowActions({ user, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link
                href={window.route("admin.users.edit", { user })}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:h-auto sm:w-auto sm:p-2"
                title="Edit user"
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
                onClick={() => onDelete(user)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 sm:h-auto sm:w-auto sm:p-2"
                title="Delete user"
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

const Index = ({ users }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);
    const userRows = users?.data ?? [];

    const deleteHandler = () => {
        if (!selectedUser) return;
        router.post(
            window.route("admin.users.delete", { user: selectedUser }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                },
            }
        );
    };

    const openDelete = (user) => {
        setSelectedUserIds([]);
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const openBulkDelete = () => {
        if (!selectedUserIds.length) return;
        setSelectedUser(null);
        setIsDeleteModalOpen(true);
    };

    const bulkDeleteHandler = () => {
        if (!selectedUserIds.length) return;

        setIsBulkDeletePending(true);
        router.post(
            window.route("admin.users.bulk-delete"),
            { user_ids: selectedUserIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedUserIds([]);
                },
                onFinish: () => {
                    setIsBulkDeletePending(false);
                },
            }
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
                            fill="currentColor"
                            aria-hidden
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                            User Management
                        </h1>
                        <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                            Manage platform users and access levels
                        </p>
                    </div>
                </div>
                <div className="w-full shrink-0 sm:w-auto">
                    <Button
                        text="Create User"
                        type="link"
                        href={window.route("admin.users.create")}
                        className="!block !w-full !rounded-xl !bg-primary !px-4 !py-3 !text-center !text-sm !font-bold !text-white shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!inline-block sm:!w-auto sm:!px-6"
                    />
                </div>
            </div>

            {users?.total != null && users.total > 0 && (
                <p className="mb-3 text-center text-xs text-zinc-500 sm:text-left sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-zinc-300">
                        {users.from ?? 0}–{users.to ?? 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-zinc-300">
                        {users.total}
                    </span>
                </p>
            )}

            <div className="space-y-3 md:hidden">
                {userRows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a1a1a]/80 px-4 py-12 text-center">
                        <p className="text-base font-bold text-zinc-400">
                            No users yet
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            There are no records to display.
                        </p>
                    </div>
                ) : (
                    userRows.map((user) => (
                        <article
                            key={user.id}
                            className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30"
                        >
                            <div className="flex gap-3">
                                <UserAvatar user={user} large />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-bold text-white">
                                        {user.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-sm text-zinc-400">
                                        {user.email}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-zinc-300 ring-1 ring-white/10">
                                            {user.role?.name ?? "—"}
                                        </span>
                                        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-primary ring-1 ring-primary/25">
                                            {user.type ?? "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                    Actions
                                </span>
                                <UserRowActions user={user} onDelete={openDelete} />
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="hidden md:block">
                {selectedUserIds.length > 0 && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                            {selectedUserIds.length} users selected
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
                    datas={users}
                    columns={columns}
                    onSelectionChange={setSelectedUserIds}
                >
                    <TableData>
                        {(user) => <p className="font-semibold">{user.name}</p>}
                    </TableData>
                    <TableData>
                        {(user) => <UserAvatar user={user} />}
                    </TableData>
                    <TableData>
                        {(user) => <p className="text-zinc-400">{user.email}</p>}
                    </TableData>
                    <TableData>
                        {(user) => (
                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold capitalize text-blue-400">
                                {user.role?.name ?? "—"}
                            </span>
                        )}
                    </TableData>
                    <TableData>
                        {(user) => (
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold capitalize text-primary">
                                {user.type ?? "—"}
                            </span>
                        )}
                    </TableData>
                    <TableData>
                        {(user) => (
                            <UserRowActions user={user} onDelete={openDelete} />
                        )}
                    </TableData>
                </Table>
            </div>

            <AdminPagination meta={users} />

            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={selectedUser ? deleteHandler : bulkDeleteHandler}
                    title={
                        selectedUser
                            ? "Are you sure you want to delete this user?"
                            : `Are you sure you want to delete ${selectedUserIds.length} users?`
                    }
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
