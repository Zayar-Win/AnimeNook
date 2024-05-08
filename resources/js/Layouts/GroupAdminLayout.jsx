import Sidebar from "@/Components/Sidebar";
import React from "react";
import ToastLayout from "./ToastLayout";
import { sidebarLinks } from "@/Components/GroupAdminLinks";

const GroupAdminLayout = ({ children }) => {
    return (
        <ToastLayout>
            <Sidebar sidebarLinks={sidebarLinks} />
            <div className="pl-[22%]">{children}</div>
        </ToastLayout>
    );
};

export default GroupAdminLayout;
