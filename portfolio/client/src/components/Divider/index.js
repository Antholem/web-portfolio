import React from "react";
import { useThemeStore } from "../../store/themeStore";

const Divider = ({ 
    direction = "horizontal", 
    size = 1, 
    gap = 1, 
    className = "", 
    ...props 
}) => {
    const { theme } = useThemeStore();

    const baseStyles = "flex items-center";

    const paddingStyles =
        direction === "horizontal"
            ? `pb-${gap} mt-${gap}`
            : `pr-${gap} ml-${gap}`;

    const themeStyles =
        theme === "dark"
            ? "border-dark-text-disabled"
            : "border-light-text-disabled";

    const directionStyles =
        direction === "horizontal"
            ? `w-full border-t`
            : `h-full border-l`;

    return (
        <div className={`${baseStyles}`}>
            <div 
                className={`${baseStyles} ${directionStyles} border-${size} ${paddingStyles} ${themeStyles} ${className}`}
                {...props}
            />
        </div>
    );
};

export default Divider;
