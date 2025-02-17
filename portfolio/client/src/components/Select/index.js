import React, { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import * as Icon from "react-icons/md";

const Select = ({
    options = [],
    selectedValue,
    onSelect,
    variant = "outlined",
    size = "md",
    isDisabled = false,
    isInvalid = false,
    isReadOnly = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const { theme } = useThemeStore();
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleButtonClick = (option) => {
        if (!isDisabled && !isReadOnly) {
            onSelect(option);
            setIsOpen(false);
            setHighlightedIndex(options.indexOf(option));
        }
    };

    const handleToggleDropdown = () => {
        if (!isDisabled && !isReadOnly) setIsOpen((prev) => !prev);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            handleButtonClick(options[highlightedIndex]);
        }
    };

    const variantStyles = {
        outlined: theme === "dark"
            ? "px-2 rounded-md bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "px-2 rounded-md bg-light-paper border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
        filled: theme === "dark"
            ? "px-2 rounded-md bg-dark-divider border border-dark focus:border-brand hover:bg-dark-action-selected focus:border-brand"
            : "px-2 rounded-md bg-light-divider border border-light focus:border-brand hover:bg-light-action-selected focus:border-brand",
        flushed: theme === "dark"
            ? "border-0 px-2 rounded-md bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary focus:border-brand"
            : "border-0 px-2 rounded-md bg-light-paper border border-light-text-disabled hover:border-light-text-primary focus:border-brand",
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

    const invalidStyles = isInvalid
        ? "border-red-500 focus:ring-red-500"
        : "";

    return (
        <div className="relative" ref={selectRef}>
            <button
                className={`block w-full text-start ${variantStyles[variant]} ${sizeStyles[size]} rounded-md cursor-pointer ${disabledStyles} ${invalidStyles} ${className}`}
                onClick={handleToggleDropdown}
                onKeyDown={handleKeyDown}
                disabled={isDisabled || isReadOnly} // Disable if isReadOnly is true
            >
                <div className="flex flex-row justify-between items-center">
                    <div>
                        {selectedValue || "Select option"}
                    </div>
                    <div>
                        {isOpen ? <Icon.MdArrowDropDown /> : <Icon.MdArrowDropUp />}
                    </div>
                </div>
            </button>
            {isOpen && !isDisabled && !isReadOnly && (
                <div 
                    className={`absolute w-full mt-0 border rounded-md shadow-lg z-10 
                        ${theme === "dark" ? "border-dark-text-disabled" : "border-light-text-disabled"}
                    `}
                >
                    {options.map((option, index) => (
                        <button
                            key={option}
                            className={`w-full text-left px-2 py-1 hover:bg-brand hover:text-white
                                ${index === 0 ? "rounded-t-md" : (index === (options.length - 1) && "rounded-b-md")}
                                ${index === highlightedIndex && (theme === "dark" ? "bg-dark-action-selected" : "bg-light-action-selected")}
                                ${theme === "dark" ? `bg-dark-paper` : "bg-light-paper"}
                            `}
                            onClick={() => handleButtonClick(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
