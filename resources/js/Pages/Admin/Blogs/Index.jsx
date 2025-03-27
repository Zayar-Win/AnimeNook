import Button from "@/Components/Button";
import DeleteModal from "@/Components/DeleteModal";
import Table from "@/Components/Table";
import TableData from "@/Components/TableData";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const columns = [
    {
        field: "Title",
    },
    {
        field: "Image",
        minWidth: "100px",
    },
    {
        field: "Content",
        minWidth: "200px",
    },
    {
        field: "Author",
    },
    {
        field: "Tags",
        minWidth: "300px",
    },
    {
        field: "Action",
    },
];

const Index = ({ blogs }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("admin.blogs.delete", { blog: selectedBlog }),
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
                Blog Management
            </h1>
            <div className="flex justify-end">
                <Button
                    text={"Create Blog"}
                    type={"link"}
                    href={window.route("admin.blogs.create")}
                    className={"!bg-blue-500 my-8 mr-5"}
                />
            </div>
            <Table datas={blogs} columns={columns}>
                <TableData>
                    {(blog) => <p className="line-clamp-1">{blog.title}</p>}
                </TableData>
                <TableData>
                    {(blog) => (
                        <img
                            className="w-[100px] h-auto object-cover "
                            src={blog.image}
                            alt="blog image"
                        ></img>
                    )}
                </TableData>
                <TableData className="min-w-[400px]">
                    {(blog) => (
                        <div
                            className="line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        ></div>
                    )}
                </TableData>
                <TableData>{(blog) => <p>{blog.author?.name}</p>}</TableData>
                <TableData>
                    {(blog) => (
                        <div className="flex items-center w-full gap-2 flex-wrap">
                            {blog.tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="border-[1px] border-black/30 rounded-md px-2 py-1 text-sm cursor-pointer hover:bg-transparent/10"
                                >
                                    {tag.name}
                                </div>
                            ))}
                        </div>
                    )}
                </TableData>
                <TableData>
                    {(blog) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route("admin.blogs.edit", {
                                    blog,
                                })}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedBlog(blog);
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
                    title={"Are you sure want to delete this user."}
                />
            )}
        </div>
    );
};

export default Index;
Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
