import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";

const Email = () => {
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    // Handle Google Login
    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setEmail(user.email); // Set user email
                setPhoto(user.photoURL); // Set profile photo URL
                setUserLoggedIn(true); // Update login status
            })
            .catch((error) => {
                console.error("Error during Google login:", error);
                alert("Failed to log in with Google. Please try again.");
            });
    };

    // Effect to log user details once logged in
    useEffect(() => {
        if (userLoggedIn) {
            console.log("User Logged In:", { email, photo });
        }
    }, [userLoggedIn, email, photo]);

    // Handle form submission
    const handleSend = (e) => {
        e.preventDefault();

        const formData = {
            name: auth.currentUser?.displayName,
            photo: auth.currentUser?.photoURL,
            email: email,
            subject: subject,
            message: message,
        };

        const apiUrl = process.env.REACT_APP_API_URL;

        axios.post(apiUrl, formData)
            .then((res) => {
                console.log("Email sent successfully:", res);
                alert("Message sent successfully!");
            })
            .catch((err) => {
                console.error("Error sending email:", err);
                alert("Failed to send message. Please try again.");
            });
    };

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
            {userLoggedIn && (
                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                    <p><strong>Email:</strong> {email}</p>
                    <img
                        src={photo}
                        alt="Profile"
                        style={{ width: "50px", borderRadius: "50%", marginTop: "10px" }}
                    />
                </div>
            )}
            <form onSubmit={handleSend}>
                <div>
                    <input
                        type="text"
                        value={subject}
                        placeholder="Enter the subject"
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    />
                </div>
                <div>
                    <textarea
                        value={message}
                        placeholder="Enter your message"
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "10px", height: "100px" }}
                    />
                </div>
                <button
                    className="px-6 py-3 bg-brand text-white rounded-lg shadow-md hover:bg-dark"
                    style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    type="submit"
                >
                    Send Message
                </button>
            </form>
            <br />
            {!userLoggedIn && (
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        backgroundColor: "#4285F4",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    Login With Google
                </button>
            )}
        </div>
    );
};

export default Email;
