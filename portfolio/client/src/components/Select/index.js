import React, { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import * as Icon from "react-icons/md";

const Select = ({
    placeholder, 
    value, 
    onChange, 
    children, 
    className = "", 
    size = "md", 
    variant = "outlined", 
    isDisabled = false, 
    isInvalid = false, 
    isReadOnly = false, 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const { theme } = useThemeStore();
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => selectRef.current && !selectRef.current.contains(event.target) && setIsOpen(false);

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleButtonClick = (event, option) => {
        event.preventDefault();
        if (isDisabled || isReadOnly) return;

        onChange(option);
        setIsOpen(false);
    };

    const handleToggleDropdown = (event) => {
        event.preventDefault();
        if (isDisabled || isReadOnly) return;
        setIsOpen((prev) => !prev);
    };

    const options = React.Children.map(children, (child) => ({
        value: child.props.value,
        label: child.props.children,
    }));

    const baseStyles = "w-full flex items-center justify-between gap-2 rounded-md cursor-pointer transition-all duration-300";

    const variantStyles = {
        outlined: theme === "dark"
            ? "px-2 rounded-md bg-transparent border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "px-2 rounded-md bg-transparent border border-light-text-disabled hover:border-light-text-primary focus:border-brand", 

        filled: theme === "dark"
            ? "px-2 rounded-md bg-dark border border-dark focus:border-brand hover:bg-dark-action-selected"
            : "px-2 rounded-md bg-light border border-light focus:border-brand hover:bg-light-action-selected", 

        flushed: theme === "dark"
            ? "border-b rounded-none bg-transparent border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "border-b rounded-none bg-transparent border-light-text-disabled hover:border-light-text-primary focus:border-brand", 

        unstyled: theme === "dark"
            ? "border-none bg-transparent focus:ring-0"
            : "border-none bg-transparent focus:ring-0", 
    };

    const sizeStyles = {
        xs: "py-1 px-1 h-8 text-xs", 
        sm: "py-2 px-2 h-10 text-sm", 
        md: "py-3 px-3 h-12 text-base", 
        lg: "py-4 px-4 h-14 text-lg", 
        xl: "py-5 px-5 h-15 text-xl", 
    };

    const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed" : "focus:outline-none";
    const invalidStyles = isInvalid && "border-red-500 focus:ring-red-500";

    return (
        <div className="relative" ref={selectRef}>
            {/* Select Button */}
            <button
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${invalidStyles} ${className}`}
                onClick={handleToggleDropdown}
                disabled={isDisabled || isReadOnly}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-disabled={isDisabled}
            >
                <div>
                    {options.find((opt) => opt.value === value)?.label || placeholder || "Select option"}
                </div>
                <div className={`${theme === "dark" ? "text-light-text-disabled" : "text-dark-text-disabled"}`}>
                    {isOpen ? <Icon.MdArrowDropUp /> : <Icon.MdArrowDropDown />}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && !isDisabled && !isReadOnly && (
                <div 
                    className={`absolute w-auto max-w-max mt-0 border rounded-md shadow-lg z-10 ${
                        theme === "dark" ? "border-dark-text-disabled bg-dark-paper" : "border-light-text-disabled bg-light-paper"
                    }`}
                    role="listbox"
                >
                    {options.map((option, index) => {
                        const isFirst = index === 0;
                        const isLast = index === options.length - 1;
                        const isHighlighted = index === highlightedIndex;
                        
                        return (
                            <button
                                key={option.value}
                                className={`
                                    w-full text-left px-2 py-1 hover:bg-brand hover:text-white whitespace-nowrap
                                    ${sizeStyles[size]} 
                                    ${(isFirst && "rounded-t-md") || (isLast && "rounded-b-md")}
                                    ${isHighlighted && (theme === "dark" ? "bg-dark-action-selected" : "bg-light-action-selected")}
                                `}
                                onClick={(e) => handleButtonClick(e, option.value)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Select;
