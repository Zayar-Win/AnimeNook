/* eslint-disable indent */
import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";

const TagForm = ({ type, tag }) => {
    const { data, setData, post, errors } = useForm({
        name: "",
    });

    useEffect(() => {
        if (type === "edit") {
            setData((data) => {
                return {
                    ...data,
                    name: tag.name,
                };
            });
        }
    }, [type]);

    return (
        <div>
            <div className="w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-6">
                    {type === "edit" ? "Edit" : "Create New"} Tag
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("group.admin.tags.update", {
                                      tag,
                                  })
                                : window.route("group.admin.tags.store"),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                >
                    <div className="grid grid-cols-2 gap-x-10 gap-y-8 ">
                        
                        <Input
                            label="Name"
                            errorMessage={errors?.name}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
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

export default TagForm;

TagForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
