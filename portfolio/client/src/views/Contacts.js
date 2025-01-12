import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";
import { Button, Card, Icon, IconButton, Input, Tooltip } from "../components";

const Contacts = () => {
    /** Contact Details */
    const contactDetails = [
        { label: "Contact", icon: <FaPhoneAlt size={20} />, text: "+63 977 333 6314" },
        { label: "Email", icon: <FaEnvelope size={20} />, text: "antholemlemmanalo@gmail.com" },
        { label: "Location", icon: <FaMapMarkerAlt size={20} />, text: "Mabalacat, Pampanga, Philippines" },
    ];

    /** Social Media Links */
    const socialLinks = [
        { href: "https://facebook.com", icon: <FaFacebook size={30} />, ariaLabel: "Facebook" },
        { href: "https://github.com", icon: <FaGithub size={30} />, ariaLabel: "Github" },
        { href: "https://linkedin.com", icon: <FaLinkedin size={30} />, ariaLabel: "LinkedIn" },
        { href: "https://instagram.com", icon: <FaInstagram size={30} />, ariaLabel: "Instagram" },
    ];

    /** State Management */
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /** Handle Google Login */
    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setEmail(user.email);
                setPhoto(user.photoURL);
                setIsLoggedIn(true);
            })
            .catch((error) => {
                console.error("Error during Google login:", error);
                alert("Failed to log in with Google. Please try again.");
            });
    };

    /** Handle Form Submission */
    const handleSend = (e) => {
        e.preventDefault();

        const formData = {
            name: auth.currentUser?.displayName,
            photo: auth.currentUser?.photoURL,
            email,
            subject,
            message,
        };

        axios
            .post(process.env.REACT_APP_API_URL, formData)
            .then(() => alert("Message sent successfully!"))
            .catch((err) => {
                console.error("Error sending email:", err);
                alert("Failed to send message. Please try again.");
            });
    };

    /** Log User Data on Login */
    useEffect(() => {
        if (isLoggedIn) console.log("User Logged In:", { email, photo });
    }, [isLoggedIn, email, photo]);

    return (
        <div>
            {/* Section Heading */}
            <header className="mb-8 text-center">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    I Look Forward to Hearing From You!
                </h2>
                <h1 className="text-4xl font-heading font-bold">Contact Me</h1>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Contact Details */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Get in Touch</h2>
                        <p className="text-sm font-light">
                            I'm available to answer any questions or discuss potential collaborations.
                        </p>
                    </div>

                    {/* Contact List */}
                    <div className="grid grid-cols-1 gap-6">
                        {contactDetails.map(({ label, icon, text }, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 text-brand">
                                    <Icon icon={icon} size="md" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">{label}</h3>
                                    <p className="text-sm font-light">{text}</p>
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
                        {isLoggedIn && (
                            <div className="flex items-center gap-4 pb-4">
                                <img src={photo} alt="Profile" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h2 className="text-md font-bold">
                                        {auth.currentUser?.displayName || "User Name"}
                                    </h2>
                                    <p
                                        href={`mailto:${email}`}
                                        className="text-sm font-light"
                                    >
                                        {email}
                                    </p>
                                </div>
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSend}>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Subject
                                </label>
                                <Input
                                    type="text"
                                    id="subject"
                                    placeholder="Enter your subject here..."
                                    variant="outlined"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <Input
                                    type="text"
                                    id="message"
                                    placeholder="Write your message here..."
                                    variant="outlined"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full"
                                leftIcon={<FcGoogle />}
                                variant="outlined"
                                onClick={handleGoogleLogin}
                                type="button"
                            >
                                {isLoggedIn ? "Switch Account" : "Login with Google"}
                            </Button>
                            <Button
                                className="w-full"
                                leftIcon={<IoMdSend />}
                                isDisabled={!isLoggedIn}
                                type="submit"
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
