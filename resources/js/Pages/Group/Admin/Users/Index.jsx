import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

const columns = [
    { field: "Name" },
    { field: "Profile", minWidth: "50px" },
    { field: "Email" },
    { field: "Role" },
    { field: "Type" },
    { field: "Action" },
];

function UserRowActions({ user, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link
                href={window.route("group.admin.users.edit", { user })}
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

function UserAvatar({ user, large = false }) {
    const initial = (user?.name || "?").trim().charAt(0).toUpperCase() || "?";
    const size = large ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
    if (user?.profile_picture) {
        return (
            <img
                className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white/10`}
                src={user.profile_picture}
                alt=""
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

function UserFiltersToolbar({
    search,
    setSearch,
    searchInputRef,
    roleId,
    setRoleId,
    typeVal,
    setTypeVal,
    roles,
    onClear,
    hasActiveFilters,
}) {
    return (
        <div className="mb-5 rounded-2xl border border-white/5 bg-[#1a1a1a]/80 p-4 shadow-inner sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-4">
                <div className="lg:col-span-5">
                    <label
                        htmlFor="user-search"
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
                            id="user-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name or email…"
                            autoComplete="off"
                            className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                        />
                    </div>
                </div>
                <div className="sm:col-span-1 lg:col-span-3">
                    <label
                        htmlFor="user-role-filter"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Role
                    </label>
                    <select
                        id="user-role-filter"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 py-2.5 text-sm text-white outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="">All roles</option>
                        {roles?.map((role) => (
                            <option key={role.id} value={String(role.id)}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="sm:col-span-1 lg:col-span-2">
                    <label
                        htmlFor="user-type-filter"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                        Type
                    </label>
                    <select
                        id="user-type-filter"
                        value={typeVal}
                        onChange={(e) => setTypeVal(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 py-2.5 text-sm text-white outline-none ring-primary/30 transition focus:border-zinc-500 focus:ring-2"
                    >
                        <option value="">All types</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
                <div className="flex items-end gap-2 lg:col-span-2">
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasActiveFilters}
                        className="h-[42px] flex-1 rounded-xl border border-white/10 px-3 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

const Index = ({ users, filters = {}, roles = [] }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isBulkDeletePending, setIsBulkDeletePending] = useState(false);
    const [search, setSearch] = useState(filters?.search ?? "");
    const [roleId, setRoleId] = useState(
        filters?.role_id != null ? String(filters.role_id) : ""
    );
    const [typeVal, setTypeVal] = useState(filters?.type ?? "");
    const searchInputRef = useRef(null);
    const filtersSkipRoleType = useRef(true);
    const userRows = users?.data ?? [];

    const buildQuery = (page = 1) => ({
        page,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(roleId ? { role_id: roleId } : {}),
        ...(typeVal ? { type: typeVal } : {}),
    });

    const fetchUsers = (page = 1) => {
        router.get(
            window.route("group.admin.users"),
            buildQuery(page),
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            }
        );
    };

    useEffect(() => {
        setRoleId(filters?.role_id != null ? String(filters.role_id) : "");
        setTypeVal(filters?.type ?? "");
    }, [filters?.role_id, filters?.type]);

    useEffect(() => {
        if (document.activeElement === searchInputRef.current) return;
        setSearch(filters?.search ?? "");
    }, [filters?.search]);

    useEffect(() => {
        const id = setTimeout(() => {
            const applied = (filters?.search ?? "").trim();
            if (search.trim() === applied) return;
            fetchUsers(1);
        }, 420);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only debounce search text
    }, [search]);

    useEffect(() => {
        if (filtersSkipRoleType.current) {
            filtersSkipRoleType.current = false;
            return;
        }
        fetchUsers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleId, typeVal]);

    const hasActiveFilters =
        Boolean(search.trim()) || Boolean(roleId) || Boolean(typeVal);

    const clearFilters = () => {
        filtersSkipRoleType.current = true;
        setSearch("");
        setRoleId("");
        setTypeVal("");
        router.get(
            window.route("group.admin.users"),
            { page: 1 },
            { preserveState: true, replace: true, preserveScroll: true }
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

    const deleteHandler = () => {
        if (!selectedUser) return;

        router.post(
            window.route("group.admin.users.delete", { user: selectedUser }),
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

    const bulkDeleteHandler = () => {
        if (!selectedUserIds.length) return;

        setIsBulkDeletePending(true);
        router.post(
            window.route("group.admin.users.bulk-delete"),
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

    const emptyMessage = hasActiveFilters
        ? "No users match your filters."
        : "There are no records to display.";

    return (
        <div className="px-4 pb-8 pt-4 sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2">
                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                    <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-white shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
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
                        <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                            User management
                        </h1>
                        <p className="mt-1 text-xs font-medium leading-snug text-zinc-400 sm:text-sm">
                            Manage members, roles, and permissions
                        </p>
                    </div>
                </div>
                <Link
                    href={window.route("group.admin.users.create")}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-black shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:py-3 sm:pl-5 sm:pr-6"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        aria-hidden
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add user
                </Link>
            </div>

            <UserFiltersToolbar
                search={search}
                setSearch={setSearch}
                searchInputRef={searchInputRef}
                roleId={roleId}
                setRoleId={setRoleId}
                typeVal={typeVal}
                setTypeVal={setTypeVal}
                roles={roles}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

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
                            {emptyMessage}
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
                    <TableData>{(user) => <p>{user.name}</p>}</TableData>
                    <TableData>
                        {(user) => <UserAvatar user={user} />}
                    </TableData>
                    <TableData>{(user) => <p>{user.email}</p>}</TableData>
                    <TableData>
                        {(user) => (
                            <p className="capitalize">{user.role?.name}</p>
                        )}
                    </TableData>
                    <TableData>
                        {(user) => (
                            <p className="capitalize">{user.type}</p>
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
                            ? "Are you sure want to delete this user."
                            : `Are you sure you want to delete ${selectedUserIds.length} users?`
                    }
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
