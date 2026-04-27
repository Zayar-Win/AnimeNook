import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
);

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

function TrendChart({
    title,
    subtitle,
    trend = [],
    firstKey,
    firstLabel,
    firstColor,
    secondKey,
    secondLabel,
    secondColor,
    gradientIdPrefix = "series",
}) {
    const labels = trend.map((item) => item?.label || "");
    const firstSeries = trend.map((item) => Number(item?.[firstKey] || 0));
    const secondSeries = trend.map((item) => Number(item?.[secondKey] || 0));

    const data = {
        labels,
        datasets: [
            {
                label: firstLabel,
                data: firstSeries,
                borderColor: firstColor,
                backgroundColor: `${firstColor}33`,
                fill: true,
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 0,
                pointHoverRadius: 4,
            },
            {
                label: secondLabel,
                data: secondSeries,
                borderColor: secondColor,
                backgroundColor: `${secondColor}2b`,
                fill: true,
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 0,
                pointHoverRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(18,18,20,0.95)",
                borderColor: "rgba(255,255,255,0.12)",
                borderWidth: 1,
                titleColor: "#fafafa",
                bodyColor: "#e4e4e7",
            },
        },
        scales: {
            x: {
                grid: {
                    color: "rgba(255,255,255,0.05)",
                },
                ticks: {
                    color: "#71717a",
                    maxTicksLimit: 4,
                },
                border: {
                    color: "rgba(255,255,255,0.12)",
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255,255,255,0.05)",
                },
                ticks: {
                    color: "#71717a",
                    precision: 0,
                },
                border: {
                    color: "rgba(255,255,255,0.12)",
                },
            },
        },
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#171717] p-4 shadow-xl shadow-black/40 sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(237,100,0,0.16),transparent_42%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.14),transparent_40%)]" />
            <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-black text-white sm:text-xl">
                        {title}
                    </h2>
                    <p className="text-xs text-zinc-500 sm:text-sm">
                        {subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: firstColor }}
                        />
                        {firstLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: secondColor }}
                        />
                        {secondLabel}
                    </span>
                </div>
            </div>

            <div className="relative h-[280px] rounded-xl border border-white/10 bg-[#131313]/90 p-2">
                <Line
                    datasetIdKey={`${gradientIdPrefix}-chart`}
                    data={data}
                    options={options}
                />
            </div>
        </div>
    );
}

const Dashboard = ({
    kpis = {},
    trendUsersAndManga = [],
    trendViewsAndLikes = [],
    topViewedMangas = [],
    selectedStartDate = "",
    selectedEndDate = "",
    selectedRangeLabel = "Last 30 days",
}) => {
    const toDate = (value) => (value ? new Date(`${value}T00:00:00`) : null);
    const formatDateValue = (value) => {
        if (!value) return "";
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [dateRange, setDateRange] = useState([
        toDate(selectedStartDate),
        toDate(selectedEndDate),
    ]);
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        setDateRange([toDate(selectedStartDate), toDate(selectedEndDate)]);
    }, [selectedStartDate, selectedEndDate]);

    const applyDateFilter = (rangeStart, rangeEnd) => {
        if (!rangeStart || !rangeEnd) return;
        router.get(
            window.route("group.admin.dashboard"),
            {
                start_date: formatDateValue(rangeStart),
                end_date: formatDateValue(rangeEnd),
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: [
                    "trendUsersAndManga",
                    "trendViewsAndLikes",
                    "selectedStartDate",
                    "selectedEndDate",
                    "selectedRangeLabel",
                ],
            }
        );
    };

    const resetDateFilter = () => {
        setDateRange([null, null]);
        router.get(
            window.route("group.admin.dashboard"),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: [
                    "trendUsersAndManga",
                    "trendViewsAndLikes",
                    "selectedStartDate",
                    "selectedEndDate",
                    "selectedRangeLabel",
                ],
            }
        );
    };

    const cards = [
        {
            label: "Total Group Users",
            value: formatNumber(kpis.users_total),
            hint: "Members in this group",
            tone: "border-blue-500/25 bg-[#151b24]",
            ring: "ring-blue-500/15",
        },
        {
            label: "Total Mangas",
            value: formatNumber(kpis.mangas_total),
            hint: "Published manga entries",
            tone: "border-fuchsia-500/25 bg-[#1b1724]",
            ring: "ring-fuchsia-500/15",
        },
        {
            label: "Total Chapters",
            value: formatNumber(kpis.chapters_total),
            hint: "All manga chapters",
            tone: "border-emerald-500/25 bg-[#14201c]",
            ring: "ring-emerald-500/15",
        },
        {
            label: "New Users This Month",
            value: formatNumber(kpis.new_users_this_month),
            hint: "Fresh member growth",
            tone: "border-amber-500/25 bg-[#231a14]",
            ring: "ring-amber-500/15",
        },
    ];

    return (
        <div className="min-h-full bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 rounded-2xl border border-white/5 bg-[linear-gradient(135deg,rgba(59,130,246,0.14),rgba(24,24,27,0.75)_35%,rgba(237,100,0,0.12))] p-4 sm:mb-8 sm:p-5">
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
                            Group Admin Dashboard
                        </h1>
                        <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                            Member growth, manga performance, and content health
                            for this group
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <article
                        key={card.label}
                        className={`rounded-2xl border p-4 shadow-lg shadow-black/30 ring-1 ${card.tone} ${card.ring}`}
                    >
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            {card.label}
                        </p>
                        <p className="mt-2 text-3xl font-black text-white">
                            {card.value}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            {card.hint}
                        </p>
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
                <article className="rounded-xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/15 to-transparent px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        New mangas this month
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                        {formatNumber(kpis.new_mangas_this_month)}
                    </p>
                </article>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#141414] px-3 py-2.5 sm:px-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Chart date range
                    </p>
                    <p className="text-sm font-semibold text-zinc-200">{selectedRangeLabel}</p>
                </div>
                <div className="flex w-full flex-wrap items-end gap-2 sm:w-auto">
                    <div className="min-w-[280px]">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                            Select range
                        </p>
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                                const [nextStart, nextEnd] = update || [];
                                if (nextStart && nextEnd) {
                                    applyDateFilter(nextStart, nextEnd);
                                }
                            }}
                            maxDate={new Date()}
                            dateFormat="MMM dd, yyyy"
                            placeholderText="Pick date range"
                            popperClassName="dashboard-date-picker-popper"
                            calendarClassName="dashboard-date-picker"
                            className="w-full rounded-lg border border-white/10 bg-[#101010] px-3 py-2 text-sm font-medium text-zinc-200 outline-none transition focus:border-primary/60"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={resetDateFilter}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className="min-w-0">
                    <TrendChart
                        title={`Growth trend (${selectedRangeLabel})`}
                        subtitle="Daily new users and manga entries"
                        trend={trendUsersAndManga}
                        firstKey="users"
                        firstLabel="Users"
                        firstColor="#ed6400"
                        secondKey="mangas"
                        secondLabel="Mangas"
                        secondColor="#3b82f6"
                        gradientIdPrefix="growth"
                    />
                </div>

                <div className="min-w-0">
                    <TrendChart
                        title={`Engagement trend (${selectedRangeLabel})`}
                        subtitle="Daily manga views and likes"
                        trend={trendViewsAndLikes}
                        firstKey="views"
                        firstLabel="Views"
                        firstColor="#14b8a6"
                        secondKey="likes"
                        secondLabel="Likes"
                        secondColor="#ec4899"
                        gradientIdPrefix="engagement"
                    />
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(59,130,246,0.06),rgba(12,12,13,0.96)_20%)] p-4 shadow-xl shadow-black/40 backdrop-blur sm:p-6">
                <h2 className="text-lg font-black text-white sm:text-xl">
                    Most Viewed Manga (Last 30 Days)
                </h2>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    Top-performing titles by recent readership
                </p>

                {topViewedMangas.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center text-zinc-500">
                        No manga view activity in the last 30 days.
                    </div>
                ) : (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {topViewedMangas.map((manga, index) => (
                            <article
                                key={manga.id}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 hover:border-white/20"
                            >
                                <div className="relative h-32 overflow-hidden border-b border-white/10">
                                    <img
                                        src={
                                            manga.thumbnail ||
                                            "https://ui-avatars.com/api/?name=Manga&background=27272a&color=f4f4f5&size=640"
                                        }
                                        alt={manga.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15" />
                                    <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-primary/40 bg-black/50 px-2 py-0.5 text-xs font-bold text-primary backdrop-blur">
                                        #{index + 1}
                                    </div>
                                    <p className="absolute bottom-3 left-3 right-3 line-clamp-1 text-base font-bold text-white">
                                        {manga.name}
                                    </p>
                                </div>

                                <div className="space-y-3 p-3.5">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-200">
                                            {formatNumber(manga.views_last_30_days)} views (30d)
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-pink-400/20 bg-pink-500/10 px-2.5 py-1 text-xs font-semibold text-pink-200">
                                            {formatNumber(manga.likes_count)} likes
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                                            {formatNumber(manga.chapters_count)} chapters
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-zinc-500">
                                        <span>Total views: {formatNumber(manga.views_count)}</span>
                                        <span>Updated {formatDate(manga.updated_at)}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
Dashboard.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
