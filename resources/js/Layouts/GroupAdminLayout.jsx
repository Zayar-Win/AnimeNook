import Sidebar from "@/Components/Sidebar";
import React, { useState } from "react";
import ToastLayout from "./ToastLayout";
import { sidebarLinks } from "@/Components/GroupAdminLinks";

const GroupAdminLayout = ({ children }) => {
    const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
    return (
        <ToastLayout>
            <div className="flex min-h-[100dvh] flex-col bg-[#0a0a0a] max-lg:h-[100dvh] max-lg:overflow-hidden">
                <Sidebar
                    sidebarLinks={sidebarLinks}
                    isOpenMobileSidebar={isOpenMobileSidebar}
                    setIsOpenMobileSidebar={setIsOpenMobileSidebar}
                />
                <div className="menu sticky top-0 z-[90] flex shrink-0 items-center border-b border-white/10 bg-[#0a0a0a] px-4 py-3 shadow-md shadow-black/40 lg:hidden">
                    <button
                        type="button"
                        className="menu flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                        aria-expanded={isOpenMobileSidebar}
                        aria-label={isOpenMobileSidebar ? "Close menu" : "Open menu"}
                        onClick={() =>
                            setIsOpenMobileSidebar((prev) => !prev)
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            className="menu pointer-events-none"
                            viewBox="0 0 256 256"
                            aria-hidden
                        >
                            <path
                                fill="currentColor"
                                d="M228 128a12 12 0 0 1-12 12H40a12 12 0 0 1 0-24h176a12 12 0 0 1 12 12ZM40 76h176a12 12 0 0 0 0-24H40a12 12 0 0 0 0 24Zm176 104H40a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24Z"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#0a0a0a] lg:overflow-visible lg:pl-[22%]">
                    {children}
                </div>
            </div>
        </ToastLayout>
    );
};

export default GroupAdminLayout;
