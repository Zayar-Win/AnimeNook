import React from "react";

const TableRow = ({ className, children }) => {
    return (
        <tr
            className={`bg-transparent hover:bg-white/5 transition-colors border-white/5 ${className}`}
        >
            {children}
        </tr>
    );
};

export default TableRow;
