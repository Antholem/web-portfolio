import React, { useState } from "react";
import { useThemeStore } from "../store/themeStore";

const Tooltip = ({
  label,               // Tooltip text
  ariaLabel,           // Accessible name for screen readers
  placement = "auto",  // Placement of the tooltip, default is 'auto'
  hasArrow = false,    // Display an arrow
  isDisabled = false,  // Disable the tooltip
  children,            // Child element triggering the tooltip
  className = "",      // Additional classes for styling
  ...props             // Other props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useThemeStore();

  if (isDisabled) return children;

  // Theme-based styles
  const backgroundColor = theme === "dark" ? "bg-light text-dark" : "bg-dark text-light";
  const arrowColor = theme === "dark" ? "bg-light" : "bg-dark";

  // Tooltip position classes
  const positionClasses = {
    auto: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  // Arrow position classes
  const arrowPosition = {
    top: "bottom-[-0.5rem] left-1/2 transform -translate-x-1/2",
    bottom: "top-[-0.5rem] left-1/2 transform -translate-x-1/2",
    left: "right-[-0.5rem] top-1/2 transform -translate-y-1/2",
    right: "left-[-0.5rem] top-1/2 transform -translate-y-1/2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      aria-label={ariaLabel}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute hidden sm:block z-10 px-3 py-1 text-sm rounded shadow-md whitespace-nowrap ${backgroundColor} ${positionClasses[placement]} ${className}`}
          {...props}
        >
          {label}
          {hasArrow && (
            <div
              className={`absolute h-2 w-2 transform rotate-45 ${arrowColor} ${arrowPosition[placement]}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
