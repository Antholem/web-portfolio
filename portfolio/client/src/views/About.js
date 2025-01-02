import React from "react";
import antholemPhoto from "../antholem.png";
import { Button } from "../components";

const About = () => {
    return (
        <section
            id="about"
            className="min-h-screen flex flex-col items-center justify-center px-4 py-4 md:justify-between md:px-12 md:py-10 lg:px-24"
        >
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Image Section */}
                <div className="flex justify-center order-1 md:order-2">
                    <div className="relative">
                        <img
                            src={antholemPhoto}
                            alt="Sam Manalo"
                            className="relative z-10 rounded-lg object-cover max-h-96 w-auto"
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div className="space-y-6 order-2 md:order-1 text-center md:text-left">
                    <h2 className="font-base text-lg tracking-wide">
                        HELLO WORLD!
                    </h2>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                        I'm <span className="text-brand">Sam Manalo</span>
                    </h1>
                    <h3 className="text-xl md:text-2xl font-medium">Software Engineer.</h3>
                    <p className="text-base md:text-lg font-light leading-relaxed">
                        I am a passionate Software Engineer and React Developer dedicated to crafting visually engaging and user-focused websites. With expertise in modern technologies like HTML5, CSS3, ES6+, and React.js, I excel at delivering seamless and immersive digital experiences that leave a lasting impression.
                    </p>
                    <div>
                        <Button variant="contained">Resume</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
