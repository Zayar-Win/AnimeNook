import React from "react";

const TableData = ({ className = "", children, data, i }) => {
    return (
        <td
            className={`relative text-sm font-medium text-white p-4 px-6 ${className}`}
        >
            <div className="flex items-center gap-4">
                {typeof children === "function" ? children(data, i) : children}
            </div>
        </td>
    );
};

export default TableData;
