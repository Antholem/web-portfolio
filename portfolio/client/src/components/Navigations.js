import React, { useState } from "react";
import { MdDarkMode, MdSunny, MdMenu, MdClose } from "react-icons/md";
import { Link } from "react-scroll";
import { useThemeStore } from "../store/themeStore";

const NavigationBar = ({ children }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useThemeStore();

    const navItems = [
        { name: "About", to: "about" },
        { name: "Features", to: "features" },
        { name: "Skills", to: "skills" },
        { name: "Projects", to: "projects" },
        { name: "Contacts", to: "contacts" },
    ];

    return (
        <>
            {/* Top Navigation Bar */}
            <nav
                className={`sticky top-0 z-50 border-b-2 py-4 md:px-8 ${theme === "dark" ? "bg-dark-paper border-dark-divider" : "bg-light-paper border-light-divider"}`}
            >
                <div className="container mx-auto flex justify-between items-center px-6">
                    {/* Mobile Menu Toggle */}
                    <div className="block md:hidden text-xl cursor-pointer">
                        <MdMenu onClick={() => setMobileMenuOpen(true)} />
                    </div>

                    {/* Logo */}
                    <div className="flex items-center">
                        <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
                    </div>

                    {/* Desktop Navigation Items */}
                    <ul className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <li
                                key={item.to}
                                className="text-base font-normal tracking-wide hover:text-brand cursor-pointer"
                            >
                                <Link
                                    to={item.to}
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass="text-brand"
                                    className="block"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Theme Toggle */}
                    <div
                        className="text-xl cursor-pointer"
                        onClick={toggleTheme}
                        title="Toggle Theme"
                    >
                        {theme === "dark" ? <MdSunny /> : <MdDarkMode />}
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <div
                className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}
            >
                <div className="relative flex flex-col h-full py-10">
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-2xl"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <MdClose />
                    </button>

                    {/* Logo */}
                    <div className="flex justify-center mt-12 mb-8">
                        <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
                    </div>

                    {/* Mobile Navigation Items */}
                    <div className="flex flex-col items-center space-y-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                smooth={true}
                                duration={500}
                                spy={true}
                                activeClass="text-brand"
                                className="cursor-pointer text-lg font-medium hover:text-brand"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto py-4 px-0 md:px-16 lg:px-20">
                {children}
            </main>
        </>
    );
};

export default NavigationBar;
