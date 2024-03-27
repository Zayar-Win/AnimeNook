import React from "react";

const TableRow = ({ className, children }) => {
    return (
        <tr
            className={`border-b bg-white  hover:bg-gray-50  border-gray-200 ${className}`}
        >
            {children}
        </tr>
    );
};

export default TableRow;
