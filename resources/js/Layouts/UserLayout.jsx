import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { UserThemeProvider } from "@/contexts/UserThemeContext";
import React from "react";
import ToastLayout from "./ToastLayout";

const UserLayout = ({ children }) => {
    return (
        <ToastLayout>
            <UserThemeProvider>
                <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50">
                    <Navbar />
                    {children}
                    <Footer />
                </div>
            </UserThemeProvider>
        </ToastLayout>
    );
};

export default UserLayout;
