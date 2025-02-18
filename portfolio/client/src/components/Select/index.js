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
            ? "px-2 rounded-md bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "px-2 rounded-md bg-light-paper border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
        filled: theme === "dark"
            ? "px-2 rounded-md bg-dark-divider border border-dark focus:border-brand hover:bg-dark-action-selected focus:border-brand"
            : "px-2 rounded-md bg-light-divider border border-light focus:border-brand hover:bg-light-action-selected focus:border-brand",
        flushed: theme === "dark"
            ? "px-2 border-0 rounded-md bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "px-2 border-0 rounded-md bg-light-paper border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
        unstyled: "border-none bg-transparent focus:ring-0",
    };

    const sizeStyles = {
        xs: "h-6 text-xs",
        sm: "h-8 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-lg",
    };

    const disabledStyles = isDisabled
        ? "opacity-50 cursor-not-allowed"
        : "focus:outline-none";

    const invalidStyles = isInvalid && "border-red-500 focus:ring-red-500";

    return (
        <div className="relative" ref={selectRef}>
            <button
                className={`block w-full text-start ${variantStyles[variant]} ${sizeStyles[size]} rounded-md cursor-pointer ${disabledStyles} ${invalidStyles} ${className}`}
                onClick={handleToggleDropdown}
                disabled={isDisabled || isReadOnly}
            >
                <div className="flex flex-row justify-between items-center gap-2">
                    <div>
                        {options.find((opt) => opt.value === value)?.label || (placeholder ? placeholder : "Select option")}
                    </div>
                    <div>
                        {isOpen ? <Icon.MdArrowDropUp /> : <Icon.MdArrowDropDown />}
                    </div>
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
