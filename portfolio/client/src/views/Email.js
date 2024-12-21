import React, { useState } from "react";
import axios from "axios";

const Email = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSend = (e) => {
        e.preventDefault();

        const formData = {
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            subject: subject,
            message: message
        };

        const apiUrl = process.env.REACT_APP_API_URL;

        axios.post(apiUrl, formData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div>
            {process.env.REACT_APP_API_URL}
            <form onSubmit={handleSend}>
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <button type="submit">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Email;
