import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";

function formatNumber(value) {
    return new Intl.NumberFormat().format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function percentChange(current, previous) {
    const cur = Number(current || 0);
    const prev = Number(previous || 0);
    if (prev === 0) return cur > 0 ? 100 : 0;
    return ((cur - prev) / prev) * 100;
}

function TrendChart({ trend = [] }) {
    const width = 900;
    const height = 280;
    const padX = 36;
    const padTop = 16;
    const padBottom = 28;
    const plotHeight = height - padTop - padBottom;
    const plotWidth = width - padX * 2;

    const maxValue = Math.max(
        1,
        ...trend.map((item) => Math.max(item.users ?? 0, item.groups ?? 0))
    );

    const xFor = (i) =>
        padX + (trend.length <= 1 ? 0 : (i / (trend.length - 1)) * plotWidth);
    const yFor = (v) => padTop + (1 - (v || 0) / maxValue) * plotHeight;

    const usersPoints = trend.map((item, i) => `${xFor(i)},${yFor(item.users)}`).join(" ");
    const groupsPoints = trend.map((item, i) => `${xFor(i)},${yFor(item.groups)}`).join(" ");
    const usersAreaPoints = `${padX},${padTop + plotHeight} ${usersPoints} ${
        padX + plotWidth
    },${padTop + plotHeight}`;
    const groupsAreaPoints = `${padX},${padTop + plotHeight} ${groupsPoints} ${
        padX + plotWidth
    },${padTop + plotHeight}`;
    const tickIndexes = [0, Math.floor((trend.length - 1) / 2), trend.length - 1]
        .filter((v, i, a) => a.indexOf(v) === i && v >= 0);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-xl shadow-black/40 sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(237,100,0,0.18),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.16),transparent_42%)]" />
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-black text-white sm:text-xl">
                        Growth trend (Last 30 days)
                    </h2>
                    <p className="text-xs text-zinc-500 sm:text-sm">
                        Daily new users and groups
                    </p>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        Users
                    </span>
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        Groups
                    </span>
                </div>
            </div>

            {trend.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-12 text-center text-zinc-500">
                    No trend data available.
                </div>
            ) : (
                <div className="relative overflow-x-auto rounded-xl border border-white/10 bg-[#131313]/90 p-2">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="min-w-[680px]"
                        role="img"
                        aria-label="Growth trend chart"
                    >
                        <defs>
                            <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ed6400" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#ed6400" stopOpacity="0.02" />
                            </linearGradient>
                            <linearGradient id="groupsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                            </linearGradient>
                        </defs>
                        <line
                            x1={padX}
                            y1={padTop + plotHeight}
                            x2={padX + plotWidth}
                            y2={padTop + plotHeight}
                            stroke="#3f3f46"
                            strokeWidth="1"
                        />
                        <line
                            x1={padX}
                            y1={padTop}
                            x2={padX}
                            y2={padTop + plotHeight}
                            stroke="#3f3f46"
                            strokeWidth="1"
                        />
                        <polygon points={usersAreaPoints} fill="url(#usersGradient)" />
                        <polygon points={groupsAreaPoints} fill="url(#groupsGradient)" />
                        <polyline
                            fill="none"
                            stroke="#ed6400"
                            strokeWidth="3"
                            points={usersPoints}
                        />
                        <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            points={groupsPoints}
                        />
                        {tickIndexes.map((idx) => (
                            <text
                                key={idx}
                                x={xFor(idx)}
                                y={height - 8}
                                textAnchor="middle"
                                fill="#71717a"
                                fontSize="12"
                            >
                                {trend[idx]?.label}
                            </text>
                        ))}
                    </svg>
                </div>
            )}
        </div>
    );
}

const Dashboard = ({ kpis = {}, trend = [], latestUsers = [], latestGroups = [] }) => {
    const usersChange = percentChange(
        kpis.new_users_this_month,
        kpis.new_users_last_month
    );
    const groupsChange = percentChange(
        kpis.new_groups_this_month,
        kpis.new_groups_last_month
    );

    const cards = [
        {
            label: "Total Users",
            value: formatNumber(kpis.users_total),
            hint: "All-time registered users",
            tone: "from-fuchsia-500/20 via-purple-500/10 to-transparent",
            ring: "ring-fuchsia-500/20",
        },
        {
            label: "Total Groups",
            value: formatNumber(kpis.groups_total),
            hint: "All-time created groups",
            tone: "from-sky-500/20 via-blue-500/10 to-transparent",
            ring: "ring-sky-500/20",
        },
        {
            label: "New Users (This Month)",
            value: formatNumber(kpis.new_users_this_month),
            hint: `${usersChange >= 0 ? "+" : ""}${usersChange.toFixed(1)}% vs last month`,
            tone: "from-amber-500/20 via-orange-500/10 to-transparent",
            ring: "ring-amber-500/20",
        },
        {
            label: "New Groups (This Month)",
            value: formatNumber(kpis.new_groups_this_month),
            hint: `${groupsChange >= 0 ? "+" : ""}${groupsChange.toFixed(1)}% vs last month`,
            tone: "from-emerald-500/20 via-teal-500/10 to-transparent",
            ring: "ring-emerald-500/20",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 rounded-2xl border border-white/5 bg-[linear-gradient(135deg,rgba(237,100,0,0.14),rgba(24,24,27,0.75)_35%,rgba(59,130,246,0.12))] p-4 sm:mb-8 sm:p-5">
                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                    <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M3 3v18h18" />
                            <path d="m7 12 3-3 3 2 4-5" />
                            <circle cx="7" cy="12" r="1" />
                            <circle cx="10" cy="9" r="1" />
                            <circle cx="13" cy="11" r="1" />
                            <circle cx="17" cy="6" r="1" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                            Superadmin Dashboard
                        </h1>
                        <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                            Platform growth, recent activity, and operational insights
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <article
                        key={card.label}
                        className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 shadow-lg shadow-black/30 ring-1 ${card.ring}`}
                    >
                        <div
                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.tone}`}
                        />
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            {card.label}
                        </p>
                        <p className="mt-2 text-3xl font-black text-white drop-shadow-sm">
                            {card.value}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">{card.hint}</p>
                    </article>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 to-transparent px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        New users today
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                        {formatNumber(kpis.new_users_today)}
                    </p>
                </article>
                <article className="rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/15 to-transparent px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        New groups today
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                        {formatNumber(kpis.new_groups_today)}
                    </p>
                </article>
            </div>

            <div className="mt-5">
                <TrendChart trend={trend} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(217,70,239,0.06),rgba(12,12,13,0.96)_25%)] p-4 shadow-xl shadow-black/40 backdrop-blur sm:p-6">
                    <h2 className="text-lg font-black text-white sm:text-xl">
                        Latest Users
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                        Most recently registered accounts
                    </p>
                    <div className="mt-4 space-y-2">
                        {latestUsers.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-zinc-500">
                                No users yet.
                            </div>
                        ) : (
                            latestUsers.map((user, index) => (
                                <article key={user.id}>
                                    <div className="flex items-start justify-between gap-3 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-white/[0.03]">
                                        <div className="min-w-0 flex items-start gap-3">
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-fuchsia-400/80" />
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-white">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-sm text-zinc-400">
                                                    {user.email}
                                                </p>
                                                <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
                                                    <span className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 font-semibold capitalize text-fuchsia-300">
                                                        {user.role?.name ?? "—"}
                                                    </span>
                                                    <span className="text-zinc-600">•</span>
                                                    <span>{formatDate(user.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold capitalize text-zinc-200">
                                            {user.type ?? "—"}
                                        </span>
                                    </div>
                                    {index !== latestUsers.length - 1 && (
                                        <div className="mx-1.5 border-t border-white/5" />
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,165,233,0.06),rgba(12,12,13,0.96)_25%)] p-4 shadow-xl shadow-black/40 backdrop-blur sm:p-6">
                    <h2 className="text-lg font-black text-white sm:text-xl">
                        Latest Groups
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                        Newly created communities
                    </p>
                    <div className="mt-4 space-y-2">
                        {latestGroups.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-zinc-500">
                                No groups yet.
                            </div>
                        ) : (
                            latestGroups.map((group, index) => (
                                <article key={group.id}>
                                    <div className="flex items-start justify-between gap-3 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-white/[0.03]">
                                        <div className="min-w-0 flex items-start gap-3">
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-400/80" />
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-white">
                                                    {group.name}
                                                </p>
                                                <p className="truncate text-sm text-zinc-400">
                                                    {group.subdomain}
                                                </p>
                                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                                    <span>
                                                        Expire {formatDate(group.expire_date)}
                                                    </span>
                                                    <span className="text-zinc-600">•</span>
                                                    <span>
                                                        Created {formatDate(group.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="shrink-0 rounded-full border border-sky-400/20 bg-sky-500/12 px-2.5 py-0.5 text-xs font-semibold capitalize text-sky-300">
                                            {group.plan?.name ?? "—"}
                                        </span>
                                    </div>
                                    {index !== latestGroups.length - 1 && (
                                        <div className="mx-1.5 border-t border-white/5" />
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default Dashboard;
