import React from "react";
import { useThemeStore } from "../store/themeStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Button = ({
    variant = "contained",         // Default variant
    size = "md",                   // Default size
    leftIcon,                      // Icon before the button label
    rightIcon,                     // Icon after the button label
    iconSpacing = 2,               // Spacing between icon and label
    isLoading = false,             // Loading state
    loadingText,                   // Text to display while loading
    spinner = <AiOutlineLoading3Quarters className="animate-spin" />, // Default spinner
    spinnerPlacement = "start",    // Spinner position
    isDisabled = false,            // Disabled state
    fileView,                      // File URL to view in a new tab
    fileDownload,                  // File URL to download
    children,                      // Button content
    className = "",                // Optional additional classes
    ...props                       // All other props like type, disabled, onClick, etc.
}) => {
    const { theme } = useThemeStore();

    /** Base styles shared across all variants */
    const baseStyles = "font-heading rounded-md focus:outline-none transition-all duration-300 flex items-center justify-center";

    /** Styles for each variant */
    const variantStyles = {
        outlined: theme === "dark"
            ? "border border-white text-white hover:bg-white hover:bg-opacity-5 active:bg-opacity-10"
            : "border border-dark text-dark hover:bg-dark hover:bg-opacity-5 active:bg-opacity-10",
        text: theme === "dark"
            ? "text-white hover:bg-white hover:bg-opacity-5 active:bg-opacity-10"
            : "text-dark hover:bg-dark hover:bg-opacity-5 active:bg-opacity-10",
        contained: theme === "dark"
            ? "bg-white text-dark hover:bg-gray-200 active:bg-gray-50"
            : "bg-dark text-white hover:bg-gray-800 active:bg-gray-900",
    };

    /** Padding styles for each size */
    const sizeStyles = {
        xs: "px-2 py-1",
        sm: "px-4 py-2",
        md: "px-6 py-2",
        lg: "px-8 py-3",
        xl: "px-10 py-4",
    };

    /** Disabled styles */
    const disabledStyles = "opacity-50 cursor-not-allowed";

    /** Combine applied styles */
    const appliedVariantStyles = variantStyles[variant] || variantStyles["contained"];
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
    const appliedDisabledStyles = isLoading || isDisabled ? disabledStyles : "";

    /** Handle file-related actions */
    const handleClick = (e) => {
        if (fileView) {
            window.open(fileView, "_blank");
            e.preventDefault();
        } else if (fileDownload) {
            const link = document.createElement("a");
            link.href = fileDownload;
            link.download = fileDownload.split("/").pop();
            link.click();
            e.preventDefault();
        }
    };

    return (
        <button
            className={`${baseStyles} ${appliedVariantStyles} ${appliedSizeStyles} ${appliedDisabledStyles} ${className}`}
            disabled={isLoading || isDisabled}
            onClick={fileView || fileDownload ? handleClick : undefined}
            {...props}
        >
            {/* Spinner (if loading and spinnerPlacement is "start") */}
            {isLoading && spinnerPlacement === "start" && (
                <span style={{ marginRight: `${iconSpacing / 4}rem` }}>{spinner}</span>
            )}

            {/* Left Icon */}
            {!isLoading && leftIcon && (
                <span style={{ marginRight: `${iconSpacing / 4}rem` }}>{leftIcon}</span>
            )}

            {/* Button Content */}
            {isLoading ? loadingText || children : children}

            {/* Spinner (if loading and spinnerPlacement is "end") */}
            {isLoading && spinnerPlacement === "end" && (
                <span style={{ marginLeft: `${iconSpacing / 4}rem` }}>{spinner}</span>
            )}

            {/* Right Icon */}
            {!isLoading && rightIcon && (
                <span style={{ marginLeft: `${iconSpacing / 4}rem` }}>{rightIcon}</span>
            )}
        </button>
    );
};

export default Button;
