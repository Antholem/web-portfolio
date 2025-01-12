import React from "react";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebook,
    FaGithub,
    FaLinkedin,
    FaInstagram,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { Button, Card, Icon, IconButton, Tooltip } from "../components";

const Contacts = () => {
    // Contact Details Data
    const contactDetails = [
        { label: "Contact", icon: <FaPhoneAlt size={20} />, text: "+63 977 333 6314" },
        { label: "Email", icon: <FaEnvelope size={20} />, text: "antholemlemmanalo@gmail.com" },
        { label: "Location", icon: <FaMapMarkerAlt size={20} />, text: "Mabalacat, Pampanga, Philippines" },
    ];

    // Social Media Links Data
    const socialLinks = [
        {
            href: "https://facebook.com",
            icon: <FaFacebook size={30} />,
            ariaLabel: "Facebook",
        },
        {
            href: "https://github.com",
            icon: <FaGithub size={30} />,
            ariaLabel: "Github",
        },
        {
            href: "https://linkedin.com",
            icon: <FaLinkedin size={30} />,
            ariaLabel: "LinkedIn",
        },
        {
            href: "https://instagram.com",
            icon: <FaInstagram size={30} />,
            ariaLabel: "Instagram",
        },
    ];

    return (
        <div>
            {/* Section Heading */}
            <header className="mb-8 text-center">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    I Look Forward to Hearing From You!
                </h2>
                <h1 className="text-4xl font-heading font-bold">Contact Me</h1>
            </header>

            {/* Contact Details and Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Contact Details */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Get in Touch</h2>
                        <p className="text-sm font-light">
                            I'm available to answer any questions or discuss potential collaborations.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {contactDetails.map((detail, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 text-brand">
                                    <Icon icon={detail.icon} size="md" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">{detail.label}</h3>
                                    <p className="text-sm font-light">{detail.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Social Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase mb-2">Find Me In</h3>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => (
                                <Tooltip
                                    key={index}
                                    placement="bottom"
                                    label={link.ariaLabel}
                                    ariaLabel={link.ariaLabel}
                                >
                                    <IconButton
                                        icon={link.icon}
                                        variant="text"
                                        size="md"
                                        href={link.href}
                                        ariaLabel={link.ariaLabel}
                                    />
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <Card>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="w-full mt-1 px-3 py-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-brand outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    className="w-full mt-1 px-3 py-2 border-gray-700 rounded-md focus:ring-2 focus:ring-brand outline-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                leftIcon={<FcGoogle />}
                                variant="outlined"
                            >
                                Login with Google
                            </Button>
                            <Button
                                isDisabled
                                type="submit"
                                className="w-full"
                                leftIcon={<IoMdSend />}
                                onClick={() => window.alert("sss")}
                            >
                                Send
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Contacts;
