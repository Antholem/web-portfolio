import React from "react";
import { useThemeStore } from "../store/themeStore";

const IconButton = ({
  icon,                   // The icon to render
  isRound = false,        // Whether the button is perfectly round
  size = "md",            // Button size
  variant = "contained",  // Button variant
  isDisabled = false,     // Disabled state
  isLoading = false,      // Loading state
  spinner,                // Custom spinner
  spinnerPlacement = "start", // Spinner position
  ariaLabel,              // Accessible label
  href,                   // Link URL (if present, render as <a>)
  target = "_blank",      // Target for the link
  rel = "noopener noreferrer", // Security attributes for links
  className = "",         // Optional additional classes
  ...props                // Other props
}) => {
  const { theme } = useThemeStore();

  // Base styles
  const baseStyles = `flex items-center justify-center focus:outline-none transition-all duration-300 ${className}`;

  // Variant styles
  const variantStyles = {
    contained: theme === "dark"
      ? "bg-white text-dark hover:bg-gray-200 active:bg-gray-50"
      : "bg-dark text-white hover:bg-gray-800 active:bg-gray-900",
    outlined: theme === "dark"
      ? "border border-white text-white hover:bg-white hover:bg-opacity-5 active:bg-opacity-10"
      : "border border-dark text-dark hover:bg-dark hover:bg-opacity-5 active:bg-opacity-10",
    text: theme === "dark"
      ? "text-white hover:bg-white hover:bg-opacity-5 active:bg-opacity-10"
      : "text-dark hover:bg-dark hover:bg-opacity-5 active:bg-opacity-10",
  };

  // Size styles
  const sizeStyles = {
    xs: "w-8 h-8 text-sm",
    sm: "w-10 h-10 text-base",
    md: "w-12 h-12 text-lg",
    lg: "w-14 h-14 text-xl",
    xl: "w-16 h-16 text-2xl",
  };

  // Disabled styles
  const disabledStyles = isDisabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

  // Applied styles
  const appliedVariantStyles = variantStyles[variant] || variantStyles["contained"];
  const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
  const appliedShapeStyles = isRound ? "rounded-full" : "rounded-md";

  // Render <a> or <button> based on href
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`${baseStyles} ${appliedVariantStyles} ${appliedSizeStyles} ${appliedShapeStyles} ${disabledStyles}`}
        aria-label={ariaLabel}
        {...props}
      >
        {/* Spinner */}
        {isLoading && spinnerPlacement === "start" && (
          <span className="absolute">
            {spinner || <span className="animate-spin">...</span>}
          </span>
        )}

        {/* Icon */}
        {!isLoading && icon}
      </a>
    );
  }

  return (
    <button
      className={`${baseStyles} ${appliedVariantStyles} ${appliedSizeStyles} ${appliedShapeStyles} ${disabledStyles}`}
      disabled={isDisabled || isLoading}
      aria-label={ariaLabel}
      {...props}
    >
      {/* Spinner */}
      {isLoading && spinnerPlacement === "start" && (
        <span className="absolute">
          {spinner || <span className="animate-spin">...</span>}
        </span>
      )}

      {/* Icon */}
      {!isLoading && icon}
    </button>
  );
};

export default IconButton;
