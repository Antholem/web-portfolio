import React from "react";
import { useThemeStore } from "../../stores/useTheme";

const Card = ({
    variant = "elevated",  
    size = "md", 
    className = "", 
    children, 
    ...props 
}) => {
    const { theme } = useThemeStore();

    const baseStyles = "rounded-lg";

    const sizeClasses = {
        xs: "p-4", 
        sm: "p-6", 
        md: "p-8", 
        lg: "p-10", 
        xl: "p-12", 
    };

    const variantClasses = {
        elevated: theme === "dark"
            ? "bg-dark-paper shadow-lg"
            : "bg-white shadow-lg", 
        outlined: theme === "dark"
            ? "bg-transparent border border-dark-divider"
            : "bg-transparent border border-light-divider", 
        filled: theme === "dark"
            ? "bg-dark-paper"
            : "bg-white", 
        unstyled: theme === "dark"
            ? "bg-transparent"
            : "bg-transparent", 
    };

    const appliedSize = sizeClasses[size] || sizeClasses["md"];
    const appliedVariant = variantClasses[variant] || variantClasses["elevated"];

    return (
        <div
            className={`${baseStyles} ${appliedVariant} ${appliedSize} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
