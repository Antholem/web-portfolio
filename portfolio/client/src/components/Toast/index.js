import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import { IconText } from "../";
import * as Icon from "react-icons/fa";
import { IoIosClose as Close } from "react-icons/io";

const Toast = ({ title, description, status = "info", isClosable, onClose, icon, duration = 5000 }) => {
    const { theme } = useThemeStore();
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const fadeInTimer = setTimeout(() => setOpacity(1), 50);
        const fadeOutTimer = setTimeout(() => setOpacity(0), duration - 500);

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(fadeOutTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setOpacity(0);
        setTimeout(onClose, 300);
    };

    const baseStyles = "w-[calc(100vw-32px)] md:w-80 p-4 rounded-md shadow-md flex gap-3 transition-all duration-300";

    const statusIcons = {
        success: <IconText icon={<Icon.FaCheckCircle className={`h-5 w-5 ${theme === "dark" ? "text-green-500" : "text-green-300"}`} />} size="xs" />,
        error: <IconText icon={<Icon.FaTimesCircle className={`h-5 w-5 ${theme === "dark" ? "text-red-500" : "text-red-400"}`} />} size="xs" />,
        warning: <IconText icon={<Icon.FaExclamationTriangle className={`h-5 w-5 ${theme === "dark" ? "text-orange-400" : "text-orange-300"}`} />} size="xs" />,
        info: <IconText icon={<Icon.FaInfoCircle className={`h-5 w-5 ${theme === "dark" ? "text-blue-600" : "text-blue-400"}`} />} size="xs" />
    };

    return (
        <div style={{ opacity }} className={`${baseStyles} ${title || "items-center"}  ${theme === "dark" ? "bg-light-paper text-dark" : "bg-dark-paper text-light"}`}>
            <div className="flex items-center">
                {icon || statusIcons[status]}
            </div>
            <div className="flex-1">
                {title && 
                    <p className="text-sm font-bold">{title}</p>
                }
                {description && 
                    <p className={`${title ? "text-xs font-light" : "text-sm"}`}>{description}</p>
                }
            </div>
            {isClosable && (
                <IconText
                    onClick={handleClose}
                    icon={<Close className={`text-6xl ${theme === "dark" ? "text-dark" : "text-light"}`} />}
                    variant="text"
                    className="cursor-pointer"
                    size="xs"
                />
            )}
        </div>
    );
};

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(({ title, description, status = "info", duration = 5000, isClosable = true, icon, position = "bottom-left" }) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, description, status, duration, isClosable, icon, position }]);

        if (duration) setTimeout(() => removeToast(id), duration);
    }, [removeToast]);

    const positionClasses = {
        "top": "top-4 left-1/2 transform -translate-x-1/2", 
        "top-right": "top-4 right-4", 
        "top-left": "top-4 left-4", 
        "bottom": "bottom-4 left-1/2 transform -translate-x-1/2", 
        "bottom-right": "bottom-4 right-4", 
        "bottom-left": "bottom-4 left-4", 
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {Object.keys(positionClasses).map((pos) => (
                <div key={pos} className={`fixed ${positionClasses[pos]} flex flex-col gap-3 z-50`}>
                    {toasts
                        .filter((toast) => toast.position === pos)
                        .map((toast) => (
                            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                        ))}
                </div>
            ))}
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};

export {ToastProvider, useToast};
