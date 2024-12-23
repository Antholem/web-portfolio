import React from "react";
import { MdDarkMode } from "react-icons/md";
import { Link } from "react-scroll";

const NavigationBar = () => {
    return (
        <nav className="bg-white text-black border-b border-gray-300 py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
                </div>

                {/* Navigation Items */}
                <ul className="hidden md:flex space-x-6 text-lg font-medium">
                    <li>
                        <Link to="about" smooth={true} duration={500} className="cursor-pointer">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="features" smooth={true} duration={500} className="cursor-pointer">
                            Features
                        </Link>
                    </li>
                    <li>
                        <Link to="skills" smooth={true} duration={500} className="cursor-pointer">
                            Skills
                        </Link>
                    </li>
                    <li>
                        <Link to="projects" smooth={true} duration={500} className="cursor-pointer">
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link to="contacts" smooth={true} duration={500} className="cursor-pointer">
                            Contacts
                        </Link>
                    </li>
                </ul>

                {/* Dark Mode Icon */}
                <div className="text-xl cursor-pointer">
                    <MdDarkMode />
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
