import React, { useState } from "react";
import Table from "@/Components/Table.jsx";
import TableData from "@/Components/TableData.jsx";
import { Link, router } from "@inertiajs/react";
import DeleteModal from "@/Components/DeleteModal";
import AdminLayout from "../../../../Layouts/AdminLayout";

const columns = [
    {
        field: "Email",
    },
    {
        field: "Actions",
    },
];
const Index = ({ subscribers }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("group.admin.subscribers.delete", {
                subscriber: selectedSubscriber,
            }),
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
                Subscribers Management
            </h1>
            <Table datas={subscribers} columns={columns}>
                <TableData>
                    {(subscriber) => <p>{subscriber.email}</p>}
                </TableData>
                <TableData>
                    {(subscriber) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route(
                                    "group.admin.subscribers.edit",
                                    { subscriber }
                                )}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedSubscriber(subscriber);
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
                    title={"Are you sure want to delete this subscriber."}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
