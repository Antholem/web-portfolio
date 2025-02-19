import React from "react";

const IconText = ({
    size = "md", 
    icon, 
    isRound = false, 
    className = "", 
    ...props 
}) => {

    const baseStyles = `flex items-center justify-center focus:outline-none transition-all duration-300`;

    const sizeStyles = {
        xs: "w-8 h-8 text-xs", 
        sm: "w-10 h-10 text-sm", 
        md: "w-12 h-12 text-base", 
        lg: "w-14 h-14 text-lg", 
        xl: "w-16 h-16 text-xl", 
    };
    
    const shapeStyles = isRound ? "rounded-full" : "rounded-md";
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];

    return (
        <span
            className={`${baseStyles} ${appliedSizeStyles} ${shapeStyles} ${className}`}
            {...props}
        >
            {icon}
        </span>
    );
};

export default IconText;
