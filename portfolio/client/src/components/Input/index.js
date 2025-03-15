import React from "react";
import { useThemeStore } from "../../stores/useTheme";

const Input = ({
    variant = "outline", 
    size = "md", 
    className = "", 
    placeholder = "", 
    isDisabled = false, 
    isInvalid = false, 
    isReadOnly = false, 
    isRequired = false, 
    value, 
    defaultValue, 
    onChange, 
    ...props 
}) => {
    const { theme } = useThemeStore();

    const baseStyles = "w-full transition-all duration-300";

    const sizeStyles = {
        xs: "py-1 px-1 h-8 text-xs", 
        sm: "py-2 px-2 h-10 text-sm", 
        md: "py-3 px-3 h-12 text-base", 
        lg: "py-4 px-4 h-14 text-lg", 
        xl: "py-5 px-5 h-16 text-xl", 
    };

    const variantStyles = {
        outline: theme === "dark"
            ? "px-2 rounded-md bg-transparent border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "px-2 rounded-md bg-transparent border border-light-text-disabled hover:border-light-text-primary focus:border-brand", 

        filled: theme === "dark"
            ? "px-2 rounded-md bg-dark border border-dark focus:border-brand hover:bg-dark-action-selected"
            : "px-2 rounded-md bg-light border border-light focus:border-brand hover:bg-light-action-selected", 

        flushed: theme === "dark"
            ? "border-0 border-b border-dark-text-disabled bg-transparent focus:border-brand hover:border-dark-text-primary active:border-brand"
            : "border-0 border-b border-light-text-disabled bg-transparent focus:border-brand hover:border-light-text-primary active:border-brand", 

        unstyled: theme === "dark"
            ? "border-none bg-transparent focus:ring-0"
            : "border-none bg-transparent focus:ring-0", 
    };

    const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed" : "focus:outline-none";
    const invalidStyles = isInvalid && "border-red-500 focus:ring-red-500";
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
    const appliedVariantStyles = variantStyles[variant] || variantStyles["outline"];

    return (
        <input
            className={`${baseStyles} ${appliedSizeStyles} ${appliedVariantStyles} ${disabledStyles} ${invalidStyles} ${className}`}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            aria-invalid={isInvalid}
            aria-required={isRequired}
            {...props}
        />
    );
};

export default Input;
