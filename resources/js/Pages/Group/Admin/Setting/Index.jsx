import Input from "@/Components/Admin/Input";
import Button from "@/Components/Button";
import InputLabel from "@/Components/InputLabel";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, useForm } from "@inertiajs/react";
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
        <div className="flex flex-1 flex-col bg-[#0a0a0a] px-4 pt-4 text-white sm:px-5 sm:pt-5 md:px-8 md:pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] md:pb-[max(2.5rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto w-full min-w-0 max-w-3xl">
                <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 shadow-[0_0_15px_rgba(237,100,0,0.15)] sm:p-3">
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
                                className="h-6 w-6 text-primary sm:h-7 sm:w-7"
                                aria-hidden
                            >
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                                Group settings
                            </h1>
                            <p className="mt-1.5 text-pretty text-sm font-medium leading-snug text-zinc-400 sm:text-base">
                                Branding, theme color, and social links
                            </p>
                        </div>
                    </div>
                    <Link
                        href={window.route("group.admin.dashboard")}
                        className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:h-10 sm:w-auto sm:text-sm"
                    >
                        ← Back to dashboard
                    </Link>
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
                    className="rounded-xl border border-white/10 bg-[#141414] p-4 shadow-xl shadow-black/40 ring-1 ring-white/5 sm:rounded-2xl sm:p-6 md:p-8"
                >
                    <div className="grid min-w-0 grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-10 md:gap-y-8">
                        <div className="md:col-span-2">
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-sm">
                                Brand identity
                            </h3>
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0 sm:h-32 sm:w-32">
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
                                        className="pointer-events-none absolute -bottom-0.5 -right-0.5 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#141414] bg-white text-zinc-900 shadow-[0_4px_14px_rgba(0,0,0,0.55)] ring-2 ring-primary ring-offset-2 ring-offset-[#141414] sm:h-10 sm:w-10"
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
                                <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
                                    <InputLabel
                                        value="Group logo"
                                        className="!mb-0 !text-zinc-400"
                                    />
                                    <p className="text-pretty text-sm leading-relaxed text-zinc-500">
                                        Tap the circle to choose an image. PNG
                                        or JPG; square looks best.
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
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-sm">
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
                            <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-sm">
                                Theme
                            </h3>
                            <div className="grid grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-2">
                                <div className="min-w-0">
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
                                <div className="min-w-0 rounded-xl border border-white/5 bg-black/30 p-3 sm:p-4">
                                    <InputLabel
                                        value="Color picker"
                                        className="!mb-3 !text-zinc-400"
                                    />
                                    <div className="-mx-1 flex max-w-full justify-center overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
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
                                <h3 className="mb-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-sm">
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

                    <div className="mt-8 flex flex-col border-t border-white/5 pt-5 sm:mt-10 sm:flex-row sm:justify-end sm:pt-6">
                        <Button
                            type="submit"
                            text="Save settings"
                            className="!w-full !rounded-xl !bg-primary !px-6 !py-3.5 !text-sm !font-bold shadow-lg shadow-primary/20 transition-all hover:!bg-primary/90 hover:-translate-y-0.5 sm:!w-auto sm:!px-10 sm:!py-3"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
export default Index;
