import React, { useState } from "react";
import { MdDarkMode, MdMenu, MdClose } from "react-icons/md";
import { Link } from "react-scroll";

const NavigationBar = () => {
    // State for managing the mobile menu
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation items
    const navItems = [
        { name: "About", to: "about" },
        { name: "Features", to: "features" },
        { name: "Skills", to: "skills" },
        { name: "Projects", to: "projects" },
        { name: "Contacts", to: "contacts" },
    ];

    return (
        <nav className="bg-white text-black border-b border-gray-300 py-4">
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
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        className="h-8 w-auto"
                    />
                </div>

                {/* Navigation Items */}
                <ul
                    className={`${isMobileMenuOpen ? "block" : "hidden"
                        } absolute top-16 left-0 w-full bg-white md:static md:flex md:space-x-6 md:w-auto md:bg-transparent text-lg font-medium`}
                >
                    {navItems.map((item) => (
                        <li key={item.to} className="py-2 md:py-0 md:inline-block">
                            <Link
                                to={item.to}
                                smooth={true}
                                duration={500}
                                className="cursor-pointer block md:inline-block"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Dark Mode Icon */}
                <div className="text-xl cursor-pointer block">
                    <MdDarkMode />
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
