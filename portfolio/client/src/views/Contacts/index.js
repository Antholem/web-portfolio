import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as Icon from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Button, Card, IconText, Input, TextEditor, Toast } from "../../components";

const Contacts = () => {
    /** Contact Details */
    const contactDetails = [
        { label: "Contact", icon: <Icon.FaPhoneAlt size={20} />, text: "+63 977 333 6314" },
        { label: "Email", icon: <Icon.FaEnvelope size={20} />, text: "antholemlemmanalo@gmail.com" },
        { label: "Location", icon: <Icon.FaMapMarkerAlt size={20} />, text: "Mabalacat, Pampanga, Philippines" },
    ];

    /** State Management */
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isSendLoading, setIsSendLoading] = useState(false);
    const { addToast } = Toast();
    const editorRef = useRef(null);

    /** Handle Google Login */
    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setEmail(user.email);
                setPhoto(user.photoURL);
                setIsLoggedIn(true);

                addToast({
                    description: "Logged in successfully!",
                    status: "success",
                    position: "bottom-left"
                });
            })
            .catch((error) => {
                console.error("Error during Google login:", error);

                addToast({
                    description: "Login failed. Please try again.",
                    status: "error",
                    position: "bottom-left"
                });
            })
            .finally(() => setIsGoogleLoading(false));
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
            .then(() => {
                addToast({
                    description: "Message sent successfully!",
                    status: "success",
                    position: "bottom-left"
                });

                if (editorRef.current) {
                    editorRef.current.commands.setContent("");
                    setMessage("");
                    setSubject("");
                };
            })
            .catch((err) => {
                console.error("Error sending email:", err);
                
                addToast({
                    description: "Failed to send message. Please try again.",
                    status: "error",
                    position: "bottom-left"
                });
            })
            .finally(() => setIsSendLoading(false));
    };

    /** Log User Data on Login */
    useEffect(() => {
        if (isLoggedIn) console.log("User Logged In:", { email });
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
                                    variant="outline"
                                    placeholder="Enter your message here..."
                                    value={message}
                                    onChange={setMessage}
                                    editorRef={editorRef}
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
