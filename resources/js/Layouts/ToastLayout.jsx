import useToast from "@/hooks/useToast";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastLayout = ({ children }) => {
    useToast();
    return (
        <div>
            <ToastContainer position="bottom-right" theme="dark" />
            {children}
        </div>
    );
};

export default ToastLayout;
