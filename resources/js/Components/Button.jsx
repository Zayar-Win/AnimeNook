import { Link } from "@inertiajs/react";
import React from "react";

function ButtonSpinner({ className = "" }) {
    return (
        <svg
            className={`h-4 w-4 shrink-0 animate-spin text-current ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

const Button = ({
    href,
    text,
    className,
    onClick,
    outline,
    Icon,
    type,
    title,
    disabled = false,
    loading = false,
}) => {
    const isDisabled = Boolean(disabled || loading);

    return (
        <>
            {type === "button" || type === "submit" ? (
                <button
                    onClick={onClick}
                    type={type}
                    title={title}
                    disabled={isDisabled}
                    aria-busy={loading || undefined}
                    className={`flex items-center justify-center flex-grow-0 gap-2 ${
                        outline
                            ? "border-2 border-black bg-transparent"
                            : "bg-white"
                    } text-white px-4 py-2 rounded-lg font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
                >
                    {loading ? (
                        <ButtonSpinner />
                    ) : (
                        Icon && <span className="shrink-0">{Icon}</span>
                    )}
                    <span>{text}</span>
                </button>
            ) : (
                <Link
                    href={href}
                    title={title}
                    className="inline-block w-full sm:w-auto"
                >
                    <div
                        className={` cursor-pointer flex items-center gap-2 justify-center flex-grow-0 text-white px-4 py-2 rounded-lg font-semibold ${className} ${
                            outline
                                ? "border-2 border-black bg-transparent"
                                : ""
                        }`}
                    >
                        {Icon && <span className="shrink-0">{Icon}</span>}
                        <span>{text}</span>
                    </div>
                </Link>
            )}
        </>
    );
};

export default Button;
