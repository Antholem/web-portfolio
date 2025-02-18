import React from "react";

const IconText = ({
    icon,                 // The icon to render
    isRound = false,      // Whether the icon has a circular shape
    size = "md",          // Icon size (xs, sm, md, lg, xl)
    className = "",       // Additional custom classes
    ...props              // Other props
}) => {
    // Base styles
    const baseStyles = `flex items-center justify-center focus:outline-none transition-all duration-300 ${className}`;

    // Size styles
    const sizeStyles = {
        xs: "w-8 h-8 text-xs",
        sm: "w-10 h-10 text-sm",
        md: "w-12 h-12 text-base",
        lg: "w-14 h-14 text-lg",
        xl: "w-16 h-16 text-xl",
    };
    
    // Shape styles
    const shapeStyles = isRound ? "rounded-full" : "rounded-md";

    // Applied styles
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];

    return (
        <span
            className={`${baseStyles} ${appliedSizeStyles} ${shapeStyles}`}
            {...props}
        >
            {icon}
        </span>
    );
};

export default IconText;
