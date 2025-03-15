import React from "react";
import { useThemeStore } from "../../stores/useTheme";

const TextArea = ({
    variant = "outline", 
    size = "md", 
    resize = "vertical", 
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

    const baseStyles = "w-full transition duration-300";

    const sizeStyles = {
        xs: "py-1 px-1 h-20 text-xs",
        sm: "py-2 px-2 h-24 text-sm",
        md: "py-3 px-3 h-32 text-base",
        lg: "py-4 px-4 h-40 text-lg",
        xl: "py-5 px-5 h-40 text-xl",
    };

    const variantStyles = {
        outline: theme === "dark"
            ? "p-2 rounded-md bg-transparent border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "p-2 rounded-md bg-transparent border border-light-text-disabled hover:border-light-text-primary focus:border-brand", 

        filled: theme === "dark"
            ? "p-2 rounded-md bg-dark border border-dark focus:border-brand hover:bg-dark-action-selected"
            : "p-2 rounded-md bg-light border border-light focus:border-brand hover:bg-light-action-selected", 

        flushed: theme === "dark"
            ? "border-0 border-b border-dark-text-disabled bg-transparent focus:border-brand hover:border-dark-text-primary active:border-brand"
            : "border-0 border-b border-light-text-disabled bg-transparent focus:border-brand hover:border-light-text-primary active:border-brand", 

        unstyled: theme === "dark"
            ? "border-none bg-transparent focus:ring-0"
            : "border-none bg-transparent focus:ring-0", 
    };

    const resizeStyles = {
        vertical: "resize-y", 
        horizontal: "resize-x", 
        none: "resize-none", 
    };

    const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed" : "focus:outline-none";
    const invalidStyles = isInvalid && "border-red-500 focus:ring-red-500";
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
    const appliedVariantStyles = variantStyles[variant] || variantStyles["outline"];
    const appliedResizeStyles = resizeStyles[resize] || resizeStyles["vertical"];

    return (
        <textarea
            className={`${baseStyles} ${appliedSizeStyles} ${appliedVariantStyles} ${disabledStyles} ${invalidStyles} ${appliedResizeStyles} ${className}`}
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

export default TextArea;
