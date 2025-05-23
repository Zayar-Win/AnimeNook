import React from "react";

const DownArrow = ({ className }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="m12 15l-5-5h10z" />
        </svg>
    );
};

export default DownArrow;
