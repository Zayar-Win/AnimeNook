import React, { cloneElement, useEffect, useMemo, useState } from "react";
import Thead from "./Thead";
import TableRow from "./TableRow";
import TableData from "./TableData";

const Table = ({
    columns,
    datas,
    children,
    theadClasses,
    onSelectionChange,
}) => {
    const rows = useMemo(() => {
        if (Array.isArray(datas?.data)) return datas.data;
        if (Array.isArray(datas)) return datas;
        return [];
    }, [datas]);

    const rowIds = useMemo(
        () =>
            rows
                .map((row, index) => row?.id ?? `row-${index}`)
                .filter((id) => id !== null && id !== undefined),
        [rows]
    );

    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        setSelectedRows((prev) => prev.filter((id) => rowIds.includes(id)));
    }, [rowIds]);

    useEffect(() => {
        if (typeof onSelectionChange === "function") {
            onSelectionChange(selectedRows);
        }
    }, [onSelectionChange, selectedRows]);

    const allSelected = rowIds.length > 0 && selectedRows.length === rowIds.length;

    const toggleSelectAll = () => {
        setSelectedRows((prev) => (prev.length === rowIds.length ? [] : rowIds));
    };

    const toggleRowSelection = (rowId) => {
        setSelectedRows((prev) =>
            prev.includes(rowId)
                ? prev.filter((id) => id !== rowId)
                : [...prev, rowId]
        );
    };

    return (
        <div>
            <div className="relative overflow-x-auto shadow-xl shadow-black/50 rounded-2xl border border-white/5 bg-[#1a1a1a]">
                <table className="w-full text-sm text-left text-white">
                    <Thead
                        columns={columns}
                        theadClasses={theadClasses}
                        allSelected={allSelected}
                        onToggleAll={toggleSelectAll}
                        hasRows={rowIds.length > 0}
                    />
                    <tbody className="divide-y divide-white/5">
                        {Array.isArray(datas?.data) ? (
                            datas.data.map((data, i) => {
                                const rowId = data?.id ?? `row-${i}`;

                                return (
                                <TableRow
                                    key={rowId}
                                >
                                    <TableData>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2"
                                            onChange={() =>
                                                toggleRowSelection(rowId)
                                            }
                                            checked={selectedRows.includes(
                                                rowId
                                            )}
                                        />
                                    </TableData>
                                    {React.Children.map(children, (child) => {
                                        return cloneElement(child, {
                                            data,
                                            i,
                                            selectedRows,
                                        });
                                    })}
                                </TableRow>
                                );
                            })
                        ) : (
                            <>
                                <TableRow key={datas.id}>
                                    <TableData>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(
                                                datas.id
                                            )}
                                            onChange={() =>
                                                toggleRowSelection(datas.id)
                                            }
                                        />
                                    </TableData>
                                    {React.Children.map(children, (child) => {
                                        return cloneElement(child, {
                                            datas,
                                            selectedRows,
                                        });
                                    })}
                                </TableRow>
                            </>
                        )}
                        {datas?.data?.length === 0 && (
                            <tr key="no-data" className="text-center">
                                <td
                                    className="py-16 px-6"
                                    colSpan={columns.length + 1}
                                >
                                    <div className="flex flex-col items-center justify-center text-zinc-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-12 h-12 mb-3 opacity-50"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                            />
                                        </svg>
                                        <p className="text-lg font-bold text-zinc-400">
                                            No Data Available
                                        </p>
                                        <p className="text-sm mt-1">
                                            There are no records to display at
                                            this time.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
