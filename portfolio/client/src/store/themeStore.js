import { create } from "zustand";

export const useThemeStore = create((set) => {
    // Function to detect system preference
    const getSystemTheme = () => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    // Initialize theme with localStorage or system default
    const initialTheme = localStorage.getItem("theme") || getSystemTheme();

    return {
        theme: initialTheme,
        toggleTheme: () =>
            set((state) => {
                const newTheme = state.theme === "light" ? "dark" : "light";
                localStorage.setItem("theme", newTheme);
                return { theme: newTheme };
            }),
        setSystemDefaultTheme: () => {
            const systemTheme = getSystemTheme();
            localStorage.setItem("theme", systemTheme);
            set({ theme: systemTheme });
        },
    };
});
