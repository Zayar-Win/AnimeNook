import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    {
        field: "Group",
    },
    {
        field: "Type",
    },
    {
        field: "Chapter Title",
    },
    {
        field: "View Count",
    },
    {
        field: "Link",
    },
    {
        field: "Action",
    },
];

const Index = ({ failLinks }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFailLink, setSelectedFailLink] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("admin.ouo.fail.links.delete", { failLink: selectedFailLink }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
            }
        );
    };
    const runFailLink = (failLink) => {
        router.post(
            window.route("admin.ouo.fail.links.rerun", { failLink }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
            }
        );
    }
    const runAllFailLinks = () => {
        router.post(window.route('admin.ouo.fail.links.rerunAll'));
    }
    return (
        <div>
            <h1 className="text-center text-xl font-bold my-10">
                Ouo Fail Links Management
            </h1>
            <div className="flex justify-end">
                <Button
                    text={'Run All Fail Links'}
                    type={'button'}
                    onClick={() => {
                        runAllFailLinks()
                    }}
                    className={"!bg-blue-500 my-8 mr-5"}
                />
            </div>
            <Table datas={failLinks} columns={columns}>
                <TableData>{(failLink) => <p>{failLink.group.name}</p>}</TableData>
                <TableData>{(failLink) => <p className="capitalize">{failLink.chapter.type}</p>}</TableData>
                <TableData className={'min-w-[250px] line-clamp-1'}>
                    {(failLink) => <p>{failLink.chapter.title}</p>}
                </TableData>
                <TableData>
                    {(failLink) => <p>{failLink.chapter.view_count}</p>}
                </TableData>
                <TableData className={'min-w-[250px] line-clamp-1'}>
                    {(failLink) => <a className="hover:underline" href={failLink.chapter.chapter_link || '#'}> {failLink.chapter.chapter_link || 'No Link'}</a>}
                </TableData>
                <TableData>
                    {(failLink) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <div
                                onClick={() => {
                                    runFailLink(failLink)
                                }}
                                className="hover:underline cursor-pointer"
                            >
                                Run Fail Link
                            </div>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedFailLink(failLink);
                                }}
                                className="hover:underline cursor-pointer"
                            >
                                Delete
                            </div>
                        </div>
                    )}
                </TableData>
            </Table>
            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure want to delete this fail link."}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
