/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import FilePondUploader from "@/Components/FilePondUploader";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import TextEditor from "@/Components/TextEditor";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

const UserForm = ({ type, blog, tags }) => {
    const { data, setData, post, errors } = useForm({
        title: blog ? blog.title : "",
        content: blog ? blog.content : "",
        image: blog ? blog.image : null,
        tags: blog
            ? blog.tags.map((tag) => ({
                  label: tag.name,
                  value: tag.id,
              }))
            : [],
    });

    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
    }));

    return (
        <div>
            <div className="w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-6">
                    {type === "edit" ? "Edit" : "Create New"} Blog
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("admin.blogs.update", {
                                      blog,
                                  })
                                : window.route("admin.blogs.store"),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                >
                    <div className="grid grid-cols-2 gap-x-10 gap-y-8 ">
                        <div className="col-span-2">
                            <FilePondUploader
                                photos={data.image}
                                onUpload={(file) => setData("image", file)}
                            />
                        </div>
                        <Input
                            label="Title"
                            errorMessage={errors?.title}
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <Select
                            options={tagOptions}
                            isMulti
                            selected={data.tags}
                            label={"Tags"}
                            onChange={(tags) => {
                                setData("tags", tags);
                            }}
                        />
                        <div className="col-span-2">
                            <InputLabel value={"Content"} />
                            <div className="realtive">
                                <TextEditor
                                    value={data.content}
                                    setValue={(value) =>
                                        setData("content", value)
                                    }
                                />
                                <InputError message={errors.content} />
                            </div>
                        </div>
                    </div>
                    <Button
                        type={"submit"}
                        text={type === "edit" ? "Edit" : "Create"}
                        className={"!bg-blue-500 mt-8 !px-20"}
                    />
                </form>
            </div>
        </div>
    );
};

export default UserForm;

UserForm.layout = (page) => <AdminLayout>{page}</AdminLayout>;
