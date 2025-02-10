import React from "react";
import { useThemeStore } from "../../store/themeStore";

const Card = ({
    size = "md",                  // Card size: 'xs', 'sm', 'md', 'lg', or 'xl'
    variant = "elevated",         // Card variant: 'elevated', 'outline', 'filled', or 'unstyled'
    children,                     // Card content
    className = "",               // Additional class names
    ...props                      // Additional props
}) => {
    const { theme } = useThemeStore();

    /** Size-based padding classes */
    const sizeClasses = {
        xs: "p-4",
        sm: "p-6",
        md: "p-8",
        lg: "p-10",
        xl: "p-12",
    };

    /** Variant-based styling classes */
    const variantClasses = {
        elevated: theme === "dark"
            ? "shadow-lg bg-dark-paper"
            : "shadow-lg bg-white",
        outlined: theme === "dark"
            ? "border border-dark-divider bg-transparent"
            : "border border-light-divider bg-transparent",
        filled: theme === "dark"
            ? "bg-dark-paper text-dark-text-primary"
            : "bg-light text-dark",
        unstyled: "", // No additional styling
    };

    /** Resolve size and variant styles */
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
