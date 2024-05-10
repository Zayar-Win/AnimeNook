import Input from '@/Components/Admin/Input';
import Button from '@/Components/Button';
import GroupAdminLayout from '@/Layouts/GroupAdminLayout'
import { useForm } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
// import { HexColorPicker } from "react-colorful";
import ColorPicker from 'react-pick-color';


const Index = ({group}) => {
    const {post : groupPost , data:groupData,setData:setGroupData,errors : groupErrors} = useForm({
        logo : group?.logo || '',
        name : group?.name || '',
    });
    const {post : groupSettingPost , data :groupSettingData,setData : setGroupSettingData}  = useForm({
        primary_color : group?.group_setting.primary_color || '',
        social_links : group?.group_setting?.social_links || {},
    });
    const [logoUrl,setLogoUrl] = useState(group?.logo);
    useEffect(() => {
        if(groupData.logo && typeof groupData.logo !== 'string'){
            setLogoUrl(URL.createObjectURL(groupData.logo));
        }
    },[groupData.logo])
    return (
        <div>
            <div className="w-[90%] mx-auto">
                <h1 className="text-xl font-semibold my-6">
                    Group Setting
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        groupPost(
                            window.route("group.admin.group.update", {
                                group,
                            }),
                            {
                                preserveScroll: true,
                            }
                        );
                        groupSettingPost(
                            window.route("group.admin.groupSetting.update", {
                                groupSetting : group.group_setting.id,
                            }),
                            {
                                preserveScroll: true,
                            }
                        );
                    }}
                >
                    <div className="grid grid-cols-2 gap-x-10 gap-y-8 ">
                        <div className="col-span-2 flex justify-center">
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
                                        setGroupData(
                                            "logo",
                                            e.target.files[0]
                                        )
                                    }
                                    className="absolute top-0 opacity-0 left-0 w-full h-full"
                                />
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <Input
                                label="Group Name"
                                errorMessage={groupErrors?.name}
                                value={groupData.name}
                                onChange={(e) => setGroupData("name", e.target.value)}
                            />
                        </div>
                        <div className='col-span-2'>
                            <Input
                                label="Primary Color"
                                errorMessage={groupErrors?.name}
                                value={groupSettingData.primary_color}
                                onChange={(e) => setGroupSettingData("primary_color", e.target.value)}
                            />
                            <ColorPicker color={groupSettingData.primary_color} onChange={color => setGroupSettingData('primary_color',color.hex)} />
                        </div>
                        {
                            Object.keys(groupSettingData.social_links).map(key => (
                                <div
                                    className='col-span-2'
                                    key={key}
                                
                                >
                                    <Input
                                        label={key}
                                        type="text"
                                        value={groupSettingData[key]}
                                        onChange={(e) =>{
                                            let socialLinks = groupSettingData.social_links;
                                            socialLinks[key] = e.target.value;
                                            setGroupSettingData("social_links",socialLinks)
                                        }
                                        }
                                    />
                                </div>

                            ))
                        }
                    </div>
                    <Button
                        type={"submit"}
                        text={'Update'}
                        className={"!bg-blue-500 mt-8 !px-20"}
                    />
                </form>
            </div>
        </div>
    )
}

Index.layout = page => <GroupAdminLayout>{page}</GroupAdminLayout>
export default Index