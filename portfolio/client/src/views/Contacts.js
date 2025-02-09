import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Icon from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";
import { Button, Card, IconText, IconButton, Input, TextEditor, Tooltip } from "../components";

const Contacts = () => {
    /** Contact Details */
    const contactDetails = [
        { label: "Contact", icon: <Icon.FaPhoneAlt size={20} />, text: "+63 977 333 6314" },
        { label: "Email", icon: <Icon.FaEnvelope size={20} />, text: "antholemlemmanalo@gmail.com" },
        { label: "Location", icon: <Icon.FaMapMarkerAlt size={20} />, text: "Mabalacat, Pampanga, Philippines" },
    ];

    /** Social Media Links */
    const socialLinks = [
        { href: "https://facebook.com", icon: <Icon.FaFacebook size={30} />, ariaLabel: "Facebook" },
        { href: "https://github.com", icon: <Icon.FaGithub size={30} />, ariaLabel: "Github" },
        { href: "https://linkedin.com", icon: <Icon.FaLinkedin size={30} />, ariaLabel: "LinkedIn" },
        { href: "https://instagram.com", icon: <Icon.FaInstagram size={30} />, ariaLabel: "Instagram" },
    ];

    /** State Management */
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isSendLoading, setIsSendLoading] = useState(false);

    /** Handle Google Login */
    const handleGoogleLogin = () => {
        setIsGoogleLoading(true); // Start loading state
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
            })
            .finally(() => setIsGoogleLoading(false)); // End loading state
    };

    /** Handle Form Submission */
    const handleSend = (e) => {
        e.preventDefault();
        setIsSendLoading(true);

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
            })
            .finally(() => setIsSendLoading(false));
    };

    /** Log User Data on Login */
    useEffect(() => {
        if (isLoggedIn) console.log("User Logged In:", { email, photo });
    }, [isLoggedIn, email, photo]);

    return (
        <div className="w-full mx-auto">
            {/* Section Heading */}
            <header className="mb-8 text-center">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    I Look Forward to Hearing From You
                </h2>
                <h1 className="text-4xl font-heading font-bold">Contacts</h1>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
                {/* Contact Details Section */}
                <div>
                    <Card className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold uppercase">Get in Touch</h2>
                            <p className="text-sm font-light">
                                I'm available to answer any questions or discuss potential collaborations.
                            </p>
                        </div>

                        {/* Contact List */}
                        <div className="space-y-4">
                            {contactDetails.map(({ label, icon, text }, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 text-brand">
                                        <IconText icon={icon} size="md" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase">{label}</h3>
                                        <p className="text-sm font-light">{text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-md font-bold uppercase mb-4">Find Me In</h3>
                            <div className="flex flex-wrap gap-4">
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
                                            size="sm"
                                            href={link.href}
                                            ariaLabel={link.ariaLabel}
                                            className="flex items-center justify-center mx-auto"
                                        />
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Contact Form Section */}
                <div>
                    <Card className="p-6">
                        {isLoggedIn && (
                            <div className="flex items-center gap-4 pb-6">
                                <img src={photo} alt="Profile" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h2 className="text-md font-bold">
                                        {auth.currentUser?.displayName || "User Name"}
                                    </h2>
                                    <p className="text-sm font-light">{email}</p>
                                </div>
                            </div>
                        )}
                        <form className="space-y-3" onSubmit={handleSend}>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2 cursor-text">
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
                                <label htmlFor="message" className="block text-sm font-medium mb-2 cursor-text">
                                    Message
                                </label>
                                <TextEditor
                                    placeholder="Enter your message here..."
                                    value={message}
                                    onChange={setMessage}
                                />
                            </div>
                            <div className="space-y-2">
                                <Button
                                    className="w-full"
                                    leftIcon={<FcGoogle />}
                                    variant="outlined"
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    isLoading={isGoogleLoading}
                                    loadingText="Logging in..."
                                >
                                    {isLoggedIn ? "Change Account" : "Login with Google"}
                                </Button>
                                <Button
                                    className="w-full"
                                    leftIcon={<IoMdSend />}
                                    isDisabled={!isLoggedIn || !subject.trim() || !message.trim()}
                                    isLoading={isSendLoading}
                                    loadingText="Sending..."
                                    type="submit"
                                >
                                    Send
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Contacts;
