import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    {
        field: "Name",
    },
    {
        field: "Slug",
        minWidth: "50px",
    },
    {
        field: "Action",
    },
];

const Index = ({ tags }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.tags.delete", { tag: selectedTag }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
            }
        );
    };
    return (
        <div>
            <h1 className="text-center text-xl font-bold my-10">
                Tags Management
            </h1>
            <div className="flex justify-end">
                <Button
                    href={window.route("group.admin.tags.create")}
                    text={"Create Tag"}
                    className={"!bg-blue-500 my-8 mr-5"}
                />
            </div>
            <Table datas={tags} columns={columns}>
                <TableData>{(tag) => <p>{tag.name}</p>}</TableData>
                <TableData>{(tag) => <p>{tag.slug}</p>}</TableData>
                <TableData>
                    {(tag) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route("group.admin.tags.edit", {
                                    tag,
                                })}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedTag(tag);
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
                    title={"Are you sure want to delete this tag."}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
