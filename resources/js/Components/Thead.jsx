import React from "react";
import TableRow from "./TableRow";

const Thead = ({ theadClasses, columns }) => {
    return (
        <thead
            className={`${theadClasses} className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"`}
        >
            <TableRow>
                <th>
                    <th scope="col" className="p-4">
                        <div className="flex items-center">
                            <input
                                id="checkbox-all-search"
                                type="checkbox"
                                // checked={
                                //     selectedRows.length ===
                                //     (datas.data.length || datas.length)
                                // }
                                // onChange={selectAllOrCancel}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
                            />
                            <label
                                htmlFor="checkbox-all-search"
                                className="sr-only"
                            >
                                checkbox
                            </label>
                        </div>
                    </th>
                </th>
                {columns.map((column) => (
                    <th
                        key={column.field}
                        className={`font-bolder text-[15px] px-6 py-3 capitalize text-black text-left ${
                            column.minWidth ?? "min-w-[180px]"
                        }`}
                    >
                        {column.field}
                    </th>
                ))}
            </TableRow>
        </thead>
    );
};

export default Thead;
