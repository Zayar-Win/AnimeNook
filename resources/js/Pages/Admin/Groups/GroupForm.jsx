import Input from '@/Components/Admin/Input';
import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import Select from '@/Components/Select';
import AdminLayout from '@/Layouts/AdminLayout'
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'

const GroupForm = ({group,type,plans}) => {
    const planOptions = plans.map(plan =>  {
        return {label : plan.name , value : plan.id}
    })
    const [logoUrl, setLogoUrl] = useState(
        group?.profile_picture
    );
    const {data,setData,post,errors} = useForm({
        name : group?.name || '',
        subdomain : group?.subdomain || '',
        logo : group?.logo || '',
        plan_id : group?.plan_id || '',
        start_date : group?.start_date || '',
        end_date : group?.expire_date || ''
    });
    useEffect(() => {
        if (data.logo && typeof data.logo !== "string") {
            setLogoUrl(URL.createObjectURL(data.logo));
        }
    }, [data.logo]);

    return (
        <div>
            <div className="w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-6">
                    {type === "edit" ? "Edit" : "Create New"} User
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(
                            type === "edit"
                                ? window.route("admin.groups.update", {
                                    group,
                                })
                                : window.route("admin.groups.store"),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                >
                    <div className="grid grid-cols-2 gap-x-10 gap-y-8 ">
                        <div className="col-span-2 relative flex justify-center">
                            <div className="w-28 h-28 relative">
                                <img
                                    className="w-28 h-28 rounded-full object-cover"
                                    src={
                                        logoUrl
                                            ? logoUrl
                                            : "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
                                    }
                                    alt=""
                                />
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "profile_picture",
                                            e.target.files[0]
                                        )
                                    }
                                    className="absolute top-0 opacity-0 left-0 w-full h-full"
                                />
                            </div>
                            <InputError message={errors?.logo} />
                        </div>
                        <Input
                            label="Name"
                            errorMessage={errors?.name}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <Input
                            label="Subdomain"
                            errorMessage={errors?.subdomain}
                            value={data.subdomain}
                            onChange={(e) => setData("subdomain", e.target.value)}
                        />
                        <Select
                            options={planOptions}
                            label="Plan"
                            inputProps={{ 
                                autoComplete : 'off'
                            }}
                            errorMessage={errors?.plan_id}
                            selected={data.plan_id}
                            onChange={(plan) => setData("plan_id", plan.value)}
                        />
                        <Input
                            label="Start Date"
                            type="datetime-local"
                            vlaue={data.start_date}
                            errorMessage={errors?.start_date}
                            onChange={(e) =>
                                setData("start_date", e.target.value)
                            }
                        />
                        <Input
                            label="Expire Date"
                            type="datetime-local"
                            vlaue={data.expire_date}
                            errorMessage={errors?.expire_date}
                            onChange={(e) =>
                                setData("expire_date", e.target.value)
                            }
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
    )
}

GroupForm.layout = page => <AdminLayout>{page}</AdminLayout>
export default GroupForm