import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import React from "react";
import ToastLayout from "./ToastLayout";

const UserLayout = ({ children }) => {
    return (
        <ToastLayout>
            <Navbar />
            {children}
            <Footer />
        </ToastLayout>
    );
};

export default UserLayout;
