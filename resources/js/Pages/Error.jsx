import React from "react";
import { Link } from "@inertiajs/react";

const statusMap = {
    403: {
        title: "Access denied",
        message: "You do not have permission to access this page.",
    },
    404: {
        title: "Page not found",
        message: "The page you are looking for could not be found.",
    },
    500: {
        title: "Something went wrong",
        message: "An unexpected error happened. Please try again shortly.",
    },
    503: {
        title: "Service unavailable",
        message: "The app is currently in maintenance mode.",
    },
};

const ErrorPage = ({ status = 500 }) => {
    const content = statusMap[status] ?? statusMap[500];

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-white">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#141414] p-8 text-center shadow-2xl shadow-black/40">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Error {status}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">
                    {content.title}
                </h1>
                <p className="mt-3 text-sm text-zinc-400">{content.message}</p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        Go home
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-bold text-zinc-200 transition hover:border-white/30 hover:bg-white/5"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
