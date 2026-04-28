import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { router } from "@inertiajs/react";
import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
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

function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
}

function formatNumber(value) {
    return new Intl.NumberFormat().format(Number(value || 0));
}

const AdsenseDashboard = ({
    summary = {},
    dailyNetEarnings = [],
    latestReports = [],
    selectedStartDate = "",
    selectedEndDate = "",
    selectedRangeLabel = "Last 30 days",
    selectedRangeKey = "last_30_days",
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
            window.route("group.admin.adsense.dashboard"),
            {
                start_date: formatDateValue(rangeStart),
                end_date: formatDateValue(rangeEnd),
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const applyQuickRange = (rangeKey) => {
        router.get(
            window.route("group.admin.adsense.dashboard"),
            { range: rangeKey },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const resetDateFilter = () => {
        setDateRange([null, null]);
        router.get(
            window.route("group.admin.adsense.dashboard"),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const chartData = {
        labels: dailyNetEarnings.map((item) => item.label),
        datasets: [
            {
                label: "Net earnings (70%)",
                data: dailyNetEarnings.map((item) => Number(item.earnings || 0)),
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.18)",
                fill: true,
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 0,
                pointHoverRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(18,18,20,0.95)",
                borderColor: "rgba(255,255,255,0.12)",
                borderWidth: 1,
                callbacks: {
                    label: (ctx) => ` ${formatCurrency(ctx.parsed.y)}`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: "rgba(255,255,255,0.05)" },
                ticks: { color: "#71717a", maxTicksLimit: 5 },
                border: { color: "rgba(255,255,255,0.12)" },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255,255,255,0.05)" },
                ticks: {
                    color: "#71717a",
                    callback: (val) => formatCurrency(val),
                },
                border: { color: "rgba(255,255,255,0.12)" },
            },
        },
    };

    const cards = [
        {
            label: "Net Profit (70%)",
            value: formatCurrency(summary.net_earnings),
            hint: "What the group receives",
        },
        {
            label: "Raw AdSense Revenue",
            value: formatCurrency(summary.raw_earnings),
            hint: "Before 30% owner share",
        },
        {
            label: "Average Daily Net",
            value: formatCurrency(summary.avg_daily_net),
            hint: selectedRangeLabel,
        },
        {
            label: "Total Clicks",
            value: formatNumber(summary.clicks),
            hint: "Synced from AdSense API",
        },
    ];

    return (
        <div className="min-h-full bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mb-6 rounded-2xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,197,94,0.12),rgba(24,24,27,0.75)_35%,rgba(59,130,246,0.1))] p-4 sm:mb-8 sm:p-5">
                <h1 className="text-2xl font-black sm:text-3xl">Google AdSense Dashboard</h1>
                <p className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                    All revenue shown as 70% net share for this subdomain.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 shadow-xl shadow-black/40">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Filter by date
                        </p>
                        <p className="text-sm font-semibold text-zinc-200">{selectedRangeLabel}</p>
                    </div>
                    <div className="flex w-full flex-wrap items-end gap-2 sm:w-auto">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: "today", label: "Today" },
                                { key: "last_7_days", label: "Last 7 days" },
                                { key: "last_30_days", label: "Last 30 days" },
                            ].map((range) => {
                                const isActive = selectedRangeKey === range.key;
                                return (
                                    <button
                                        key={range.key}
                                        type="button"
                                        onClick={() => applyQuickRange(range.key)}
                                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                            isActive
                                                ? "border-primary/70 bg-primary/20 text-primary"
                                                : "border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10"
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="min-w-[280px]">
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

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-zinc-400">
                    AdSense data is synced automatically every night at 12:00 AM via API.
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <article
                        key={card.label}
                        className="rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-lg shadow-black/30"
                    >
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            {card.label}
                        </p>
                        <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
                        <p className="mt-1 text-xs text-zinc-500">{card.hint}</p>
                    </article>
                ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-xl shadow-black/40 sm:p-6">
                <h2 className="text-lg font-black text-white sm:text-xl">
                    Net Earnings Trend (70%)
                </h2>
                <div className="mt-3 h-[320px] rounded-xl border border-white/10 bg-[#131313]/90 p-2">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-xl shadow-black/40 sm:p-6">
                <h2 className="text-lg font-black text-white sm:text-xl">Latest Synced Rows</h2>
                {latestReports.length === 0 ? (
                    <div className="mt-3 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center text-zinc-500">
                        No synced AdSense data yet.
                    </div>
                ) : (
                    <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full min-w-[760px] text-sm">
                            <thead className="bg-white/5 text-zinc-400">
                                <tr>
                                    <th className="px-3 py-2 text-left">Date</th>
                                    <th className="px-3 py-2 text-left">Net (70%)</th>
                                    <th className="px-3 py-2 text-left">Impressions</th>
                                    <th className="px-3 py-2 text-left">Clicks</th>
                                    <th className="px-3 py-2 text-left">Page Views</th>
                                    <th className="px-3 py-2 text-left">CTR</th>
                                    <th className="px-3 py-2 text-left">RPM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestReports.map((row) => (
                                    <tr key={row.id} className="border-t border-white/10 text-zinc-200">
                                        <td className="px-3 py-2">{row.report_date}</td>
                                        <td className="px-3 py-2">{formatCurrency(row.net_earnings)}</td>
                                        <td className="px-3 py-2">{formatNumber(row.impressions)}</td>
                                        <td className="px-3 py-2">{formatNumber(row.clicks)}</td>
                                        <td className="px-3 py-2">{formatNumber(row.page_views)}</td>
                                        <td className="px-3 py-2">{row.ctr}</td>
                                        <td className="px-3 py-2">{row.rpm}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsenseDashboard;
AdsenseDashboard.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;

