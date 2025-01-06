import React from "react";
import { useThemeStore } from "../store/themeStore";

const Card = ({
    size = "md", // Card size: 'xs', 'sm', 'md', 'lg', or 'xl'
    variant = "elevated", // Card variant: 'elevated', 'outline', 'filled', or 'unstyled'
    children, // Card content
    className = "", // Additional class names
    ...props
}) => {
    const { theme } = useThemeStore();

    // Define size-based padding and dimensions
    const sizeClasses = {
        xs: "p-4",
        sm: "p-6",
        md: "p-8",
        lg: "p-10",
        xl: "p-12",
    };

    // Define variant-based styles
    const variantClasses = {
        elevated: theme === "dark"
            ? "shadow-lg bg-dark-paper"
            : "shadow-lg bg-white-paper",
        outlined: theme === "dark"
            ? "border border-dark-divider bg-transparent"
            : "border border-white-divider bg-transparent",
        filled: theme === "dark"
            ? "bg-dark-paper text-white"
            : "bg-white-paper text-dark",
    };

    const appliedSize = sizeClasses[size] || sizeClasses["md"];
    const appliedVariant = variantClasses[variant] || variantClasses["elevated"];

    return (
        <div
            className={`rounded-lg ${appliedVariant} ${appliedSize} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
