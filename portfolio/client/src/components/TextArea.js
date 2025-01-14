import React from "react";
import { useThemeStore } from "../store/themeStore";

const TextArea = ({
    placeholder = "", // Placeholder text
    size = "md", // Size: xs, sm, md, lg
    variant = "outline", // Variant: outline, filled, flushed, unstyled
    isDisabled = false, // If true, the textarea is disabled
    isInvalid = false, // If true, the textarea is marked as invalid
    isReadOnly = false, // If true, the textarea is readonly
    isRequired = false, // If true, the textarea is required
    value, // Controlled value
    defaultValue, // Uncontrolled default value
    onChange, // Change handler
    className = "", // Additional classes
    resize = "vertical", // Resize behavior: vertical, horizontal, none
    ...props // Additional props
}) => {
    const { theme } = useThemeStore();

    /** Styles for size */
    const sizeStyles = {
        xs: "h-20 text-xs",
        sm: "h-24 text-sm",
        md: "h-32 text-base",
        lg: "h-40 text-lg",
    };

    /** Styles for variant */
    const variantStyles = {
        outline: theme === "dark"
            ? "p-2 rounded-md bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "p-2 rounded-md bg-light-paper border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
        filled: theme === "dark"
            ? "p-2 rounded-md bg-dark border border-dark focus:border-brand hover:bg-dark-action-selected"
            : "p-2 rounded-md bg-light border border-light focus:border-brand hover:bg-light-action-selected",
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

    /** Resize styles */
    const resizeStyles = {
        vertical: "resize-y",
        horizontal: "resize-x",
        none: "resize-none",
    };

    /** Combined styles */
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
    const appliedVariantStyles =
        variantStyles[variant] || variantStyles["outline"];
    const appliedResizeStyles = resizeStyles[resize] || resizeStyles["vertical"];

    return (
        <textarea
            className={`w-full ${appliedSizeStyles} ${appliedVariantStyles} ${disabledStyles} ${invalidStyles} ${appliedResizeStyles} ${className} transition duration-200`}
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
