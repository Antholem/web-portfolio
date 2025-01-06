import { create } from "zustand";

export const useThemeStore = create((set) => {
    // Helper function to detect system theme preference
    const getSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    // Initialize theme from localStorage or system default
    const initialTheme = localStorage.getItem("theme") || getSystemTheme();

    return {
        theme: initialTheme,

        // Toggle between light and dark themes
        toggleTheme: () =>
            set((state) => {
                const newTheme = state.theme === "light" ? "dark" : "light";
                localStorage.setItem("theme", newTheme);
                return { theme: newTheme };
            }),

        // Reset theme to the system's default preference
        setSystemDefaultTheme: () => {
            const systemTheme = getSystemTheme();
            localStorage.setItem("theme", systemTheme);
            set({ theme: systemTheme });
        },
    };
});
