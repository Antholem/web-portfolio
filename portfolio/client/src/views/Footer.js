import React from "react";
import { useThemeStore } from "../store/themeStore";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { IconButton } from "../components";

const Footer = () => {
    const { theme } = useThemeStore();
    const year = new Date().getFullYear();

    // Social media data
    const socialMediaLinks = [
        {
            href: "https://facebook.com",
            ariaLabel: "Facebook",
            icon: <FaFacebook size={25} />,
        },
        {
            href: "https://twitter.com",
            ariaLabel: "Twitter",
            icon: <FaTwitter size={25} />,
        },
        {
            href: "https://linkedin.com",
            ariaLabel: "LinkedIn",
            icon: <FaLinkedin size={25} />,
        },
        {
            href: "https://github.com",
            ariaLabel: "GitHub",
            icon: <FaGithub size={25} />,
        },
    ];

    return (
        <footer
            className={`mt-5 py-8 border-t ${theme === "dark"
                    ? "bg-dark-paper border-dark-action-selected"
                    : "bg-light-paper border-light-action-selected"
                }`}
        >
            <div className="container mx-auto text-center">
                {/* Social Media Links */}
                <div className="flex justify-center space-x-6 mb-4">
                    {socialMediaLinks.map(({ href, ariaLabel, icon }, index) => (
                        <IconButton
                            key={index}
                            isRound
                            icon={icon}
                            variant="text"
                            size="sm"
                            href={href}
                            ariaLabel={ariaLabel}
                        />
                    ))}
                </div>

                {/* Developer Info */}
                <p className="text-sm font-light mb-2">
                    Designed and developed by &#8202;
                    <span className="font-medium">Sam Manalo</span>
                </p>

                {/* Copyright */}
                <p className="text-xs font-light">
                    &copy; {year} Sam Manalo. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
