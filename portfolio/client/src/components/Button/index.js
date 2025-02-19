import React from "react";
import { useThemeStore } from "../../store/themeStore"; 
import { AiOutlineLoading3Quarters as Spinner } from "react-icons/ai";

const Button = ({
    variant = "solid", 
    size = "sm", 
    className = "", 
    leftIcon, 
    rightIcon, 
    iconSpacing = 2, 
    isLoading = false, 
    loadingText, 
    spinner = <Spinner className="animate-spin" />, 
    spinnerPlacement = "start", 
    isDisabled = false, 
    href, 
    target = "_blank", 
    rel = "noopener noreferrer", 
    fileView, 
    fileDownload, 
    children, 
    ...props
}) => {
    const { theme } = useThemeStore();

    const baseStyles = "font-heading rounded-md focus:outline-none transition-all duration-300 flex items-center justify-center";

    const variantStyles = {
        outlined: theme === "dark"
            ? "border border-white text-white hover:bg-white hover:bg-opacity-5 active:bg-opacity-10"
            : "border border-dark text-dark hover:bg-dark hover:bg-opacity-5 active:bg-opacity-10", 

        ghost: theme === "dark"
            ? "text-white hover:bg-white hover:bg-opacity-5 active:bg-opacity-10"
            : "text-dark hover:bg-dark hover:bg-opacity-5 active:bg-opacity-10", 

        solid: theme === "dark"
            ? "bg-white text-dark hover:bg-gray-200 active:bg-gray-50"
            : "bg-dark text-white hover:bg-gray-800 active:bg-gray-900", 

        text: theme === "dark"
            ? "text-white active:bg-opacity-10 hover:underline"
            : "text-dark active:bg-opacity-10 hover:underline", 
    };

    const sizeStyles = {
        xs: "px-2 py-1",
        sm: "px-4 py-2",
        md: "px-6 py-3",
        lg: "px-8 py-4",
        xl: "px-10 py-5",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed";
    const appliedVariantStyles = variantStyles[variant] || variantStyles["solid"];
    const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
    const appliedDisabledStyles = (isLoading || isDisabled) && disabledStyles;

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
        };
    };

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={rel}
                className={`${baseStyles} ${appliedVariantStyles} ${appliedSizeStyles} ${appliedDisabledStyles} ${className}`}
                aria-disabled={isDisabled || isLoading}
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
            </a>
        );
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
