import React from "react";

const TableRow = ({ className, children }) => {
    return (
        <tr
            className={`border-b bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 ${className}`}
        >
            {children}
        </tr>
    );
};

export default TableRow;
