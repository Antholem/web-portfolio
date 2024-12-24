import React, { useState } from "react";
import { MdDarkMode, MdSunny, MdMenu, MdClose } from "react-icons/md";
import { Link } from "react-scroll";
import { useThemeStore } from "../store/themeStore";

const NavigationBar = () => {
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
        <nav
            className={`sticky top-0 z-50 border-b-2 ${theme === "dark" ? "bg-dark text-light border-dark-divider" : "bg-light text-dark border-light-divider"
                } py-6`}
        >
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Mobile Menu Toggle */}
                <div className="block md:hidden text-xl cursor-pointer">
                    {isMobileMenuOpen ? (
                        <MdClose onClick={() => setMobileMenuOpen(false)} />
                    ) : (
                        <MdMenu onClick={() => setMobileMenuOpen(true)} />
                    )}
                </div>

                {/* Logo */}
                <div className="flex items-center justify-center w-full md:w-auto">
                    <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
                </div>

                {/* Navigation Items */}
                <ul
                    className={`${isMobileMenuOpen ? "block" : "hidden"} absolute top-16 left-0 w-full md:static md:flex md:space-x-6 md:w-auto`}
                >
                    {navItems.map((item) => (
                        <li
                            key={item.to}
                            className="font-sans py-2 md:py-0 md:inline-block text-base font-normal tracking-wide hover:text-brand transition-colors"
                        >
                            <Link
                                to={item.to}
                                smooth={true}
                                duration={500}
                                spy={true}
                                activeClass="text-brand font-bold"
                                className="cursor-pointer block md:inline-block"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Theme Toggle */}
                <div
                    className="text-xl cursor-pointer block"
                    onClick={toggleTheme}
                    title="Toggle Theme"
                >
                    {theme === "dark" ? <MdSunny /> : <MdDarkMode />}
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
