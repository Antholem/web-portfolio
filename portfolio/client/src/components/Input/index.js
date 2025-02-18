import React from "react";
import { useThemeStore } from "../../store/themeStore";

const Input = ({
    placeholder = "", // Placeholder text
    size = "md", // Size: xs, sm, md, lg
    variant = "outline", // Variant: outline, filled, flushed, unstyled
    isDisabled = false, // If true, the input is disabled
    isInvalid = false, // If true, the input is marked as invalid
    isReadOnly = false, // If true, the input is readonly
    isRequired = false, // If true, the input is required
    value, // Controlled value
    defaultValue, // Uncontrolled default value
    onChange, // Change handler
    className = "", // Additional classes
    ...props // Additional props
}) => {
    const { theme } = useThemeStore();

    /** Styles for size */
    const sizeStyles = {
        xs: "py-1 px-1 h-8 text-xs",
        sm: "py-2 px-2 h-10 text-sm",
        md: "py-3 px-3 h-12 text-base",
        lg: "py-4 px-4 h-14 text-lg",
        xl: "py-5 px-5 h-16 text-xl",
    };

    /** Styles for variant */
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
        unstyled: "border-none bg-transparent focus:ring-0",
    };

    /** Disabled styles */
    const disabledStyles = isDisabled
        ? "opacity-50 cursor-not-allowed"
        : "focus:outline-none";

    /** Invalid styles */
    const invalidStyles = isInvalid
        ? "border-red-500 focus:ring-red-500"
        : "";

    /** Combined styles */
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
    const appliedVariantStyles =
        variantStyles[variant] || variantStyles["outline"];

    return (
        <input
            className={`w-full ${appliedSizeStyles} ${appliedVariantStyles} ${disabledStyles} ${invalidStyles} ${className} transition duration-200`}
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
