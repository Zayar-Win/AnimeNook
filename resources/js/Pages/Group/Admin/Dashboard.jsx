import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import React from "react";

const Dashboard = () => {
    return (
        <div className="flex min-h-full flex-1 flex-col bg-[#0a0a0a] px-4 pb-8 pt-4 text-white sm:px-5 sm:pt-6 lg:px-8">
            <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col items-center justify-center py-10 text-center sm:max-w-xl sm:py-16">
                <div className="w-full rounded-2xl border border-white/10 bg-[#141414] px-6 py-10 shadow-xl shadow-black/40 ring-1 ring-white/5 sm:px-10 sm:py-12">
                    <div
                        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(237,100,0,0.15)]"
                        aria-hidden
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                    </div>
                    <h1 className="text-balance text-2xl font-black tracking-tight sm:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
                        The group admin dashboard will be available later.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
Dashboard.layout = (page) => (
    <GroupAdminLayout>{page}</GroupAdminLayout>
);
