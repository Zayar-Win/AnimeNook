import Sidebar from "@/Components/Sidebar";
import React from "react";
import ToastLayout from "./ToastLayout";

const AdminLayout = ({ children }) => {
    return (
        <ToastLayout>
            <Sidebar />
            <div className="pl-[22%]">{children}</div>
        </ToastLayout>
    );
};

export default AdminLayout;
