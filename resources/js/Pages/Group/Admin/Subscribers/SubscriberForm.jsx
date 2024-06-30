import React from "react";
import GroupAdminLayout from "../../../../Layouts/GroupAdminLayout";
import Input from "@/Components/Admin/Input.jsx";
import Button from "@/Components/Button";
import { useForm } from "@inertiajs/react";
const SubscriberForm = ({ subscriber }) => {
    const { post, data, setData, errors } = useForm({
        email: subscriber.email,
    });
    return (
        <div>
            <div className="w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-6">
                    Subscriber Edit Form
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            window.route("group.admin.subscribers.update", {
                                subscriber,
                            })
                        );
                    }}
                >
                    <div className="grid grid-cols-1">
                        <Input
                            type={"email"}
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            label="Email"
                            errorMessage={errors.email}
                        />
                    </div>
                    <Button
                        type={"submit"}
                        text={"Edit"}
                        className={"!bg-blue-500 mt-8 !px-20"}
                    />
                </form>
            </div>
        </div>
    );
};

export default SubscriberForm;

SubscriberForm.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
