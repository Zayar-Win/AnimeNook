import React, { cloneElement } from "react";
import Thead from "./Thead";
import TableRow from "./TableRow";
import TableData from "./TableData";

const Table = ({ columns, datas, children, theadClasses }) => {
    return (
        <div>
            <div className="relative overflow-x-auto shadow-xl shadow-black/50 rounded-2xl border border-white/5 bg-[#1a1a1a]">
                <table className="w-full text-sm text-left text-white">
                    <Thead
                        columns={columns}
                        datas={datas}
                        // setSelectedRows={setSelectedRows}
                        // selectedRows={selectedRows}
                        theadClasses={theadClasses}
                    />
                    <tbody className="divide-y divide-white/5">
                        {datas?.data ? (
                            datas.data.map((data, i) => (
                                <TableRow
                                    // className={`cy-table-row ${
                                    //     position == i + 1 ? "active-row" : ""
                                    // }`}
                                    key={data.id}
                                >
                                    <TableData>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2"
                                            // onChange={() => {
                                            //     if (
                                            //         selectedRows.includes(data.id)
                                            //     ) {
                                            //         setSelectedRows(
                                            //             selectedRows.filter(
                                            //                 (id) => id !== data.id
                                            //             )
                                            //         );
                                            //     } else {
                                            //         setSelectedRows((prev) => [
                                            //             ...prev,
                                            //             data.id,
                                            //         ]);
                                            //     }
                                            // }}
                                            // checked={selectedRows.includes(data.id)}
                                        />
                                    </TableData>
                                    {React.Children.map(children, (child) => {
                                        return cloneElement(child, { data, i });
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <>
                                <TableRow key={datas.id}>
                                    <TableData>
                                        <input type="checkbox" name="" id="" />
                                    </TableData>
                                    {React.Children.map(children, (child) => {
                                        return cloneElement(child, { datas });
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
