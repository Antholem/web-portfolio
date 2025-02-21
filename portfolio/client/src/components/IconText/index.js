import React from "react";

const IconText = ({
    size = "md", 
    icon, 
    className = "", 
    ...props 
}) => {

    const baseStyles = `flex items-center justify-center focus:outline-none transition-all duration-300`;

    const sizeStyles = {
        xs: "text-xs", 
        sm: "text-sm", 
        md: "text-base", 
        lg: "text-lg", 
        xl: "text-xl", 
        xl2: "text-2xl", 
        xl3: "text-3xl", 
        xl4: "text-4xl", 
        xl5: "text-5xl", 
        xl6: "text-6xl", 
        xl7: "text-7xl", 
        xl8: "text-8xl", 
        xl9: "text-9xl", 
    };
    
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];

    return (
        <span
            className={`${baseStyles} ${appliedSizeStyles} ${className}`}
            {...props}
        >
            {icon}
        </span>
    );
};

export default IconText;
