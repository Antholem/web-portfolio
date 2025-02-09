import React from "react";
import { useThemeStore } from "../store/themeStore";
import * as Icon from "react-icons/fa";
import { IconButton, Tooltip } from "../components";

const Footer = () => {
    const { theme } = useThemeStore();
    const year = new Date().getFullYear();

    // Social media data
    const socialMediaLinks = [
        {
            href: "https://facebook.com",
            ariaLabel: "Facebook",
            icon: <Icon.FaFacebook size={20} />,
        },
        {
            href: "https://twitter.com",
            ariaLabel: "Twitter",
            icon: <Icon.FaTwitter size={20} />,
        },
        {
            href: "https://linkedin.com",
            ariaLabel: "LinkedIn",
            icon: <Icon.FaLinkedin size={20} />,
        },
        {
            href: "https://github.com",
            ariaLabel: "GitHub",
            icon: <Icon.FaGithub size={20} />,
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
                <div className="flex flex-wrap justify-center space-x-6 mb-4">
                    {socialMediaLinks.map(({ href, ariaLabel, icon }, index) => (
                        <Tooltip
                            key={index}
                            placement="bottom"
                            label={ariaLabel}
                            ariaLabel={ariaLabel}
                        >
                            <IconButton
                                key={index}
                                isRound
                                icon={icon}
                                variant="text"
                                size="xs"
                                href={href}
                                ariaLabel={ariaLabel}
                            />
                        </Tooltip>
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
