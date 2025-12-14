import React, { useState } from "react";
import RightArrow from "@/../assets/RightArrow";
import Dashboard from "@/../assets/Dashboard";
import { Link, usePage } from "@inertiajs/react";
import { useDetectClickOutside } from "react-detect-click-outside";

const Sidebar = ({
    sidebarLinks,
    isOpenMobileSidebar,
    setIsOpenMobileSidebar,
}) => {
    const { group } = usePage().props;
    const [openMenus, setOpenMenus] = useState(() => {
        const initialState = {};
        sidebarLinks.forEach((link) => {
            if (link.children?.length) {
                const isActive = link.children.some((child) =>
                    window.route().current(child.routeName)
                );
                if (isActive) {
                    initialState[link.name] = true;
                }
            }
        });
        return initialState;
    });

    const toggleMenu = (name) => {
        setOpenMenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const handleClickOutside = (e) => {
        if (e.target.parentNode.classList.contains("menu")) return;
        setIsOpenMobileSidebar(false);
    };
    const sidebarRef = useDetectClickOutside({
        onTriggered: handleClickOutside,
    });
    return (
        <div
            ref={sidebarRef}
            className={`fixed top-0 lg:left-0 transition-all z-[100] bg-[#0a0a0a] ${
                isOpenMobileSidebar ? "left-0" : "left-[-2000px]"
            } bottom-0 lg:w-[20%] w-[80%] max-w-[300px] min-h-full overflow-y-auto border-r border-white/5 shadow-2xl shadow-black/50`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6">
                    <Link href={window.route("group.home")}>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden ring-2 ring-white/10">
                                <img
                                    src={group?.logo}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="text-white font-bold truncate">
                                    {group?.name}
                                </h2>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                    Admin Panel
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="px-6 pb-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                    {/* Overview Section */}
                    <div>
                        <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                            Overview
                        </p>
                        <div className="space-y-1">
                            {sidebarLinks.map((link) =>
                                link.children?.length > 0 ? (
                                    <div key={link.name} className="space-y-1">
                                        <button
                                            onClick={() =>
                                                toggleMenu(link.name)
                                            }
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                                                openMenus[link.name]
                                                    ? "bg-white/5 text-white"
                                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="[&>svg]:w-5 [&>svg]:h-5">
                                                    {link.icon}
                                                </div>
                                                <span className="font-semibold text-sm">
                                                    {link.name}
                                                </span>
                                            </div>
                                            <RightArrow
                                                className={`w-4 h-4 text-zinc-600 group-hover:text-white transition-transform duration-200 ${
                                                    openMenus[link.name]
                                                        ? "rotate-90 text-white"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                        <div
                                            className={`space-y-1 overflow-hidden transition-all duration-300 ${
                                                openMenus[link.name]
                                                    ? "max-h-[500px] opacity-100 mt-1"
                                                    : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            {link.children.map((childLink) => (
                                                <Link
                                                    href={window.route(
                                                        childLink.routeName
                                                    )}
                                                    key={childLink.name}
                                                    className={`block pl-12 pr-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                        window
                                                            .route()
                                                            .current(
                                                                childLink.routeName
                                                            )
                                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                                                    }`}
                                                >
                                                    {childLink.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={window.route(link.routeName)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                            window
                                                .route()
                                                .current(link.routeName)
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        <div className="[&>svg]:w-5 [&>svg]:h-5">
                                            {link.icon}
                                        </div>
                                        <span className="font-semibold text-sm">
                                            {link.name}
                                        </span>
                                    </Link>
                                )
                            )}
                        </div>
                    </div>

                    {/* Account Section */}
                    <div>
                        <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                            Account
                        </p>
                        <div className="space-y-1">
                            <Link
                                href={window.route("group.admin.setting")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                    window
                                        .route()
                                        .current("group.admin.setting")
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Dashboard className="w-5 h-5" />
                                <span className="font-semibold text-sm">
                                    Settings
                                </span>
                            </Link>

                            <Link
                                href={window.route("group.admin.dashboard")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                    window
                                        .route()
                                        .current("group.admin.dashboard")
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Dashboard className="w-5 h-5" />
                                <span className="font-semibold text-sm">
                                    Dashboard
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
