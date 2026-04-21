import UserThemeToggle from "@/Components/UserThemeToggle";
import { UserThemeProvider } from "@/contexts/UserThemeContext";
import React from "react";
import ToastLayout from "./ToastLayout";

/**
 * Guest auth pages under a group (login, register, forgot password).
 * Matches group user theme (localStorage + html.dark) with a visible toggle.
 */
const GroupAuthLayout = ({ children }) => {
    return (
        <ToastLayout>
            <UserThemeProvider>
                <div className="relative min-h-dvh">
                    <div className="absolute right-4 top-4 z-50 sm:right-6 sm:top-6 lg:right-8 lg:top-8">
                        <UserThemeToggle />
                    </div>
                    {children}
                </div>
            </UserThemeProvider>
        </ToastLayout>
    );
};

export default GroupAuthLayout;
