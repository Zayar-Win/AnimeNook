import { Link } from "@inertiajs/react";
import React from "react";

const Button = ({ href, text, className, onClick, outline, Icon, type }) => {
    return (
        <>
            {type === "button" || type === "submit" ? (
                <button
                    onClick={onClick}
                    type={type}
                    className={`flex items-center justify-center flex-grow-0 gap-3 ${
                        outline
                            ? "border-2 border-black bg-transparent"
                            : "bg-white"
                    } text-white px-4 py-2 rounded-lg font-semibold ${className}`}
                >
                    {Icon && <span>{Icon}</span>}
                    <span>{text}</span>
                </button>
            ) : (
                <Link href={href} className="inline-block">
                    <div
                        className={` cursor-pointer flex items-center gap-3 justify-center flex-grow-0 text-white px-4 py-2 rounded-lg font-semibold ${className} ${
                            outline
                                ? "border-2 border-black bg-transparent"
                                : ""
                        }`}
                    >
                        {Icon && <span>{Icon}</span>}
                        <span>{text}</span>
                    </div>
                </Link>
            )}
        </>
    );
};

export default Button;
