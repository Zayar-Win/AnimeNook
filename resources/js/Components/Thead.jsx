import React from "react";
import TableRow from "./TableRow";

const Thead = ({ theadClasses, columns }) => {
    return (
        <thead
            className={`${theadClasses} text-xs font-bold text-zinc-400 uppercase bg-white/5 border-b border-white/10`}
        >
            <TableRow className="!bg-transparent hover:!bg-transparent border-none">
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
                                className="w-4 h-4 text-primary bg-[#1a1a1a] border-white/10 rounded focus:ring-primary focus:ring-2"
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
                        className={`font-bold text-[13px] px-6 py-4 capitalize text-zinc-300 text-left tracking-wide ${
                            column.minWidth
                                ? `min-w-[${column.minWidth}]`
                                : "min-w-[150px]"
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
