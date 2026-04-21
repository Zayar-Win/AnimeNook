import React from "react";
import { useUserTheme } from "@/contexts/UserThemeContext";

const btnClass =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300/80 bg-white/80 text-zinc-800 shadow-sm transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10";

/**
 * Sun / moon toggle for group pages. Requires UserThemeProvider (UserLayout, GroupAuthLayout, etc.).
 */
export default function UserThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useUserTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`${btnClass} ${className}`.trim()}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
        >
            {isDark ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
}
