import React from "react";
import { useThemeStore } from "../../store/themeStore";

const Divider = ({ 
    direction = "horizontal", // horizontal or vertical
    size = 1, // border size
    gap = 1, // padding size
    className = "", // additional classes
    ...props // additional props
}) => {
    const { theme } = useThemeStore();

    /** Determine padding styles based on direction */
    const paddingStyles =
        direction === "horizontal"
            ? `pb-${gap} mt-${gap}` // padding for horizontal direction
            : `pr-${gap} ml-${gap}`; // padding for vertical direction

    /** Determine border style based on theme */
    const themeStyles =
        theme === "dark"
            ? "border-dark-text-disabled"
            : "border-light-text-disabled";

    /** Determine direction-specific styles */
    const directionStyles =
        direction === "horizontal"
            ? `w-full border-t` // horizontal divider
            : `h-full border-l`; // vertical divider

    return (
        <div className="flex items-center">
            <div 
                className={`flex items-center ${directionStyles} border-${size} ${paddingStyles} ${themeStyles} ${className}`}
                {...props}
            />
        </div>
    );
};

export default Divider;
