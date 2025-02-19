import React from "react";
import { useThemeStore } from "../../store/themeStore";

const IconButton = ({
  variant = "contained", 
  size = "md", 
  className = "", 
  icon, 
  isRound = false, 
  isDisabled = false, 
  isLoading = false, 
  spinner, 
  spinnerPlacement = "start", 
  ariaLabel, 
  href, 
  target = "_blank", 
  rel = "noopener noreferrer", 
  ...props 
}) => {
  const { theme } = useThemeStore();

  const baseStyles = `flex items-center justify-center focus:outline-none transition-all duration-300`;

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

  const sizeStyles = {
    xs: "w-8 h-8 text-xs", 
    sm: "w-10 h-10 text-sm", 
    md: "w-12 h-12 text-base", 
    lg: "w-14 h-14 text-lg", 
    xl: "w-16 h-16 text-xl", 
  };
  
  const disabledStyles = (isDisabled || isLoading) && "opacity-50 cursor-not-allowed";
  const appliedVariantStyles = variantStyles[variant] || variantStyles["contained"];
  const appliedSizeStyles = sizeStyles[size] || sizeStyles["md"];
  const appliedShapeStyles = isRound ? "rounded-full" : "rounded-md";

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
      className={`${baseStyles} ${appliedVariantStyles} ${appliedSizeStyles} ${appliedShapeStyles} ${disabledStyles} ${className}`}
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
