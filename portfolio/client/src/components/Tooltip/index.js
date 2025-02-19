import React, { useRef, useState } from "react";
import { useThemeStore } from "../../store/themeStore";

const Tooltip = ({
  label,
  ariaLabel,
  placement = "auto",
  hasArrow = false,
  isDisabled = false,
  children,
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const { theme } = useThemeStore();

  if (isDisabled) return children;

  const baseStyles = "absolute z-10 px-3 py-1 text-sm rounded shadow-md whitespace-nowrap transition-all duration-300";
  const arrowStyles = "absolute h-2 w-2 rotate-45 transition-all duration-300";
  const backgroundColor = theme === "dark" ? "bg-light text-dark" : "bg-dark text-light";

  const positionClasses = {
    auto: "top-full left-1/2 -translate-x-1/2 mt-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };
  
  const arrowPosition = {
    top: "bottom-[-0.25rem] left-1/2 -translate-x-1/2",
    bottom: "top-[-0.25rem] left-1/2 -translate-x-1/2",
    left: "right-[-0.25rem] top-1/2 -translate-y-1/2",
    right: "left-[-0.25rem] top-1/2 -translate-y-1/2",
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), 500);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
    >
      {children}
      {isVisible && (
        <div
          className={`${baseStyles} ${backgroundColor} ${positionClasses[placement]} ${className}`}
          {...props}
        >
          {label}
          {hasArrow && (
            <div
              className={`${arrowStyles} ${backgroundColor} ${arrowPosition[placement]}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
