import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

export const USER_THEME_STORAGE_KEY = "animenook-user-theme";

const UserThemeContext = createContext(null);

function readThemeFromDom() {
    if (typeof document === "undefined") {
        return "dark";
    }
    return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
}

export function UserThemeProvider({ children }) {
    const [theme, setThemeState] = useState(readThemeFromDom);

    const setTheme = useCallback((next) => {
        const resolved = next === "light" ? "light" : "dark";
        try {
            localStorage.setItem(USER_THEME_STORAGE_KEY, resolved);
        } catch {
            /* ignore */
        }
        if (resolved === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        setThemeState(resolved);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    const value = useMemo(
        () => ({ theme, setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme],
    );

    return (
        <UserThemeContext.Provider value={value}>
            {children}
        </UserThemeContext.Provider>
    );
}

export function useUserTheme() {
    const ctx = useContext(UserThemeContext);
    if (!ctx) {
        throw new Error("useUserTheme must be used within UserThemeProvider");
    }
    return ctx;
}
