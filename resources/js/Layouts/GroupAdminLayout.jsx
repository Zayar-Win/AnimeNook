import Sidebar from "@/Components/Sidebar";
import React, {  useState } from "react";
import ToastLayout from "./ToastLayout";
import { sidebarLinks } from "@/Components/GroupAdminLinks";

const GroupAdminLayout = ({ children }) => {
    const [isOpenMobileSidebar,setIsOpenMobileSidebar] = useState(false);
    return (
        <ToastLayout>
            <div>
                <Sidebar sidebarLinks={sidebarLinks} isOpenMobileSidebar={isOpenMobileSidebar} setIsOpenMobileSidebar={setIsOpenMobileSidebar} />
                <div className="bg-white shadow-lg px-3 py-5 lg:hidden block">
                    <div
                        className="menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            className="menu"
                            height="26"
                            onClick={() => setIsOpenMobileSidebar(prev => !prev)}
                            viewBox="0 0 256 256"
                        >
                            <path
                                fill="currentColor"
                                d="M228 128a12 12 0 0 1-12 12H40a12 12 0 0 1 0-24h176a12 12 0 0 1 12 12ZM40 76h176a12 12 0 0 0 0-24H40a12 12 0 0 0 0 24Zm176 104H40a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24Z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="lg:pl-[22%]">{children}</div>
            </div>
        </ToastLayout>
    );
};

export default GroupAdminLayout;
