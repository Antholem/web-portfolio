import React, { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import * as Icon from "react-icons/md";

const Select = ({
    placeholder, 
    size = "md",
    variant = "outlined",
    isDisabled = false,
    isInvalid = false,
    isReadOnly = false,
    value,
    onChange,
    className = "",
    children
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const { theme } = useThemeStore();
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleButtonClick = (e, option) => {
        e.preventDefault();
        if (!isDisabled && !isReadOnly) {
            onChange(option);
            setIsOpen(false);
        };
    };

    const handleToggleDropdown = (e) => {
        e.preventDefault();
        if (!isDisabled && !isReadOnly) setIsOpen((prev) => !prev);
    };

    const options = React.Children.map(children, (child) => ({
        value: child.props.value,
        label: child.props.children,
    }));

    const variantStyles = {
        outlined: theme === "dark"
            ? "px-2 rounded-md bg-transparent border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "px-2 rounded-md bg-transparent border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
        filled: theme === "dark"
            ? "px-2 rounded-md bg-dark border border-dark focus:border-brand hover:bg-dark-action-selected focus:border-brand"
            : "px-2 rounded-md bg-light border border-light focus:border-brand hover:bg-light-action-selected focus:border-brand",
        flushed: theme === "dark"
            ? "border-b rounded-none bg-transparent border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "border-b rounded-none bg-transparent border-light-text-disabled hover:border-light-text-primary focus:border-brand",
        unstyled: "border-none bg-transparent focus:ring-0",
    };

    const sizeStyles = {
        xs: "py-1 px-1 h-8 text-xs",
        sm: "py-2 px-2 h-10 text-sm",
        md: "py-3 px-3 h-12 text-base",
        lg: "py-4 px-4 h-14 text-lg",
        xl: "py-5 px-5 h-15 text-xl",
    };

    const disabledStyles = isDisabled
        ? "opacity-50 cursor-not-allowed"
        : "focus:outline-none";

    const invalidStyles = isInvalid && "border-red-500 focus:ring-red-500";

    return (
        <div className="relative" ref={selectRef}>
            <button
                className={`flex items-center justify-between gap-2 w-full ${variantStyles[variant]} ${sizeStyles[size]} rounded-md cursor-pointer ${disabledStyles} ${invalidStyles} ${className}`}
                onClick={handleToggleDropdown}
                disabled={isDisabled || isReadOnly}
            >
                <div>
                    {options.find((opt) => opt.value === value)?.label || (placeholder ? placeholder : "Select option")}
                </div>
                <div>
                    {isOpen ? <Icon.MdArrowDropUp /> : <Icon.MdArrowDropDown />}
                </div>
            </button>
            {isOpen && !isDisabled && !isReadOnly && (
                <div 
                    className={`absolute w-auto max-w-max mt-0 border rounded-md shadow-lg z-10 
                        ${theme === "dark" ? "border-dark-text-disabled" : "border-light-text-disabled"}
                    `}
                >
                    {options.map((option, index) => (
                        <button
                            key={option.value}
                            className={`w-full text-left px-2 py-1 hover:bg-brand hover:text-white whitespace-nowrap 
                                ${options.length > 1 ? (index === 0 ? "rounded-t-md" : (index === options.length - 1 ? "rounded-b-md" : "")) : "rounded-md"}
                                ${index === highlightedIndex ? (theme === "dark" ? "bg-dark-action-selected" : "bg-light-action-selected") : ""}
                                ${theme === "dark" ? "bg-dark-paper" : "bg-light-paper"}
                            `}
                            onClick={(e) => handleButtonClick(e, option.value)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
