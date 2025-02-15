import React from "react";
import { Toast } from "../../components";

const About = () => {
    const { addToast } = Toast();

    const showToast = () => {
        addToast({
            // title: "Success!",
            description: "Your action was successful.",
            status: "success",
            position: "bottom-left"
        });
    };

    return <button onClick={showToast} className="px-4 py-2 bg-blue-600 text-white rounded">Show Toast</button>;
};

export default About;
