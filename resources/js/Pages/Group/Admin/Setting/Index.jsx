import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import InputLabel from "@/Components/InputLabel";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import ColorPicker from "react-pick-color";

const formatSocialLabel = (key) =>
    key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

const Index = ({ group }) => {
    const {
        post: groupPost,
        data: groupData,
        setData: setGroupData,
        errors: groupErrors,
    } = useForm({
        logo: group?.logo || "",
        name: group?.name || "",
        primary_color: group?.group_setting.primary_color || "",
        social_links:
            typeof group?.group_setting?.social_links === "string"
                ? JSON.parse(group?.group_setting?.social_links)
                : group?.group_setting?.social_links || {},
    });

    const [logoUrl, setLogoUrl] = useState(group?.logo || null);

    useEffect(() => {
        if (groupData.logo instanceof File) {
            const url = URL.createObjectURL(groupData.logo);
            setLogoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        if (typeof groupData.logo === "string" && groupData.logo) {
            setLogoUrl(groupData.logo);
            return undefined;
        }
        if (!groupData.logo) {
            setLogoUrl(null);
        }
        return undefined;
    }, [groupData.logo]);

    return (
        <div className="bg-[#0a0a0a] min-h-screen p-6 md:p-8 text-white">
            <div className="w-full max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(237,100,0,0.15)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                        >
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                            Group settings
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium mt-1 truncate">
                            Branding, theme color, and social links
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        groupPost(
                            window.route("group.admin.setting.update", {
                                setting: group.group_setting.id,
                            }),
                            {
                                preserveScroll: true,
                            },
                        );
                    }}
                    className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl shadow-black/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Brand identity
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                <div className="relative shrink-0 mx-auto sm:mx-0 w-32 h-32">
                                    <div
                                        className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 ring-2 ring-primary/20 shadow-lg shadow-black/40 cursor-pointer transition-all hover:border-primary/40 hover:ring-primary/30"
                                        style={{
                                            backgroundColor:
                                                groupData.primary_color ||
                                                "transparent",
                                        }}
                                    >
                                        {logoUrl ? (
                                            <img
                                                className="w-full h-full object-cover"
                                                src={logoUrl}
                                                alt=""
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-900/90 text-zinc-500">
                                                <span className="text-4xl font-black text-zinc-600">
                                                    {(groupData.name || "?")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            aria-label="Change group logo"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f)
                                                    setGroupData("logo", f);
                                            }}
                                            className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div
                                        className="pointer-events-none absolute -bottom-0.5 -right-0.5 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-white text-zinc-900 shadow-[0_4px_14px_rgba(0,0,0,0.55)] ring-2 ring-primary ring-offset-2 ring-offset-[#1a1a1a]"
                                        aria-hidden
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#18181b"
                                            strokeWidth="2.25"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                            <path d="m15 5 4 4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left space-y-2">
                                    <InputLabel
                                        value="Group logo"
                                        className="!text-zinc-400 !mb-0"
                                    />
                                    <p className="text-zinc-500 text-sm leading-relaxed">
                                        Click the photo or the edit badge to
                                        upload. PNG or JPG recommended; square
                                        works best.
                                    </p>
                                    {groupErrors?.logo && (
                                        <p className="text-sm text-red-400">
                                            {groupErrors.logo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Group details
                            </h3>
                            <Input
                                label="Group name"
                                errorMessage={groupErrors?.name}
                                value={groupData.name}
                                onChange={(e) =>
                                    setGroupData("name", e.target.value)
                                }
                                placeholder="Your group name"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                Theme
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                <div>
                                    <Input
                                        label="Primary color"
                                        errorMessage={
                                            groupErrors?.primary_color
                                        }
                                        value={groupData.primary_color}
                                        onChange={(e) =>
                                            setGroupData(
                                                "primary_color",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="#ed6400"
                                    />
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <InputLabel
                                        value="Color picker"
                                        className="!text-zinc-400 !mb-3"
                                    />
                                    <div className="flex justify-center">
                                        <ColorPicker
                                            color={
                                                groupData.primary_color ||
                                                "#ed6400"
                                            }
                                            onChange={(color) =>
                                                setGroupData(
                                                    "primary_color",
                                                    color.hex,
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className="mt-4 h-3 rounded-full border border-white/10"
                                        style={{
                                            backgroundColor:
                                                groupData.primary_color ||
                                                "#3f3f46",
                                        }}
                                        aria-hidden
                                    />
                                </div>
                            </div>
                        </div>

                        {Object.keys(groupData.social_links || {}).length >
                            0 && (
                            <div className="md:col-span-2">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-white/5 pb-2">
                                    Social links
                                </h3>
                                <div className="space-y-6">
                                    {Object.keys(groupData.social_links).map(
                                        (key) => (
                                            <Input
                                                key={key}
                                                label={formatSocialLabel(key)}
                                                type="text"
                                                value={
                                                    groupData.social_links[
                                                        key
                                                    ] ?? ""
                                                }
                                                onChange={(e) =>
                                                    setGroupData(
                                                        "social_links",
                                                        {
                                                            ...groupData.social_links,
                                                            [key]: e.target
                                                                .value,
                                                        },
                                                    )
                                                }
                                                placeholder={`https://…`}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-10 pt-6 border-t border-white/5">
                        <Button
                            type="submit"
                            text="Save settings"
                            className="!bg-primary hover:!bg-primary/90 !px-10 !py-3 !rounded-xl !text-sm !font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
export default Index;
