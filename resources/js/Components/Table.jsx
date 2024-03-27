import React, { cloneElement } from "react";
import Thead from "./Thead";
import TableRow from "./TableRow";
import TableData from "./TableData";

const Table = ({ columns, datas, children, theadClasses }) => {
    return (
        <div>
            <div className="relative overflow-x-auto shadow-md mb-5 sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <Thead
                        columns={columns}
                        datas={datas}
                        // setSelectedRows={setSelectedRows}
                        // selectedRows={selectedRows}
                        theadClasses={theadClasses}
                    />
                    <tbody>
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
                            <tr
                                key={datas?.data?.length}
                                className="text-center "
                            >
                                <td
                                    className="py-8 px-2 bg-slate-50"
                                    colSpan={columns.length + 1}
                                >
                                    No Table Data
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
