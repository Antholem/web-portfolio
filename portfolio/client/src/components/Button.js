import React from "react";
import { useThemeStore } from "../store/themeStore";

const Button = ({
    variant = "contained", // Default variant
    children, // Button content
    className = "", // Optional additional classes
    ...props // All other props like type, disabled, onClick, etc.
}) => {
    const { theme } = useThemeStore();

    // Base styles for all buttons
    const baseStyles =
        "font-heading px-6 py-2 rounded focus:outline-none transition-all duration-300";

    // Styles for each variant
    const variantStyles = {
        outlined: theme === "dark"
            ? "border border-white text-white hover:bg-white hover:text-dark"
            : "border border-dark text-dark hover:bg-dark hover:text-white",
        text: theme === "dark"
            ? "text-white hover:underline hover:text-gray-300"
            : "text-dark hover:underline hover:text-gray-700",
        contained: theme === "dark"
            ? "bg-white text-dark hover:bg-gray-200"
            : "bg-dark text-white hover:bg-gray-800",
    };

    // Determine styles based on the variant
    const appliedStyles = variantStyles[variant] || variantStyles["contained"];

    return (
        <button
            className={`${baseStyles} ${appliedStyles} ${className}`}
            {...props} // Spread all other props onto the button
        >
            {children}
        </button>
    );
};

export default Button;
