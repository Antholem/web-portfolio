import React from "react";
import { useThemeStore } from "../store/themeStore";

const Select = ({
    size = "md", // Size: xs, sm, md, lg
    variant = "outline", // Variant: outline, filled, flushed, unstyled
    isDisabled = false, // If true, the select is disabled
    isInvalid = false, // If true, the select is marked as invalid
    isReadOnly = false, // If true, the select is readonly
    isRequired = false, // If true, the select is required
    value, // Controlled value
    defaultValue, // Uncontrolled default value
    onChange, // Change handler
    className = "", // Additional classes
    children, // The options inside the select
    ...props // Additional props
}) => {
    const { theme } = useThemeStore();

    /** Styles for size */
    const sizeStyles = {
        xs: "h-6 text-xs",
        sm: "h-8 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-lg",
    };

    /** Styles for variant */
    const variantStyles = {
        outline: theme === "dark"
            ? "px-2 rounded-md bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "px-2 rounded-md bg-light-paper border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
        filled: theme === "dark"
            ? "px-2 rounded-md bg-dark border border-dark focus:border-brand hover:bg-dark-action-selected"
            : "px-2 rounded-md bg-light border border-light focus:border-brand hover:bg-light-action-selected",
        flushed: theme === "dark"
            ? "border-0 px-2 rounded-md bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "border-0 px-2 rounded-md bg-light-paper border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
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
        <select
            className={`w cursor-pointer ${appliedSizeStyles} ${appliedVariantStyles} ${disabledStyles} ${invalidStyles} ${className} transition duration-200`}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            aria-invalid={isInvalid}
            aria-required={isRequired}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;
