import React from "react";
import antholemPhoto from "../antholem.png";

const About = () => {
    return (
        <section
            id="about"
            className="min-h-screen flex flex-col items-center justify-center px-4 md:px-12 lg:px-24"
        >
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Text Section */}
                <div className="space-y-6">
                    <h2 className="text-brand font-bold text-lg tracking-wide">
                        HELLO WORLD!
                    </h2>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                        I'm <span className="text-brand">Sam Manalo</span>
                    </h1>
                    <h3 className="text-xl md:text-2xl font-medium">Software Engineer.</h3>
                    <p className="text-base md:text-lg font-light leading-relaxed">
                        A highly motivated Software Engineer and React Developer who thrives
                        on building visually stunning and user-friendly websites. With a
                        comprehensive skill set encompassing HTML5, CSS3, ES6+, and React.js, I
                        specialize in creating captivating online experiences.
                    </p>
                    <div>
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-dark text-light font-medium py-3 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300"
                        >
                            Resume
                        </a>
                    </div>
                </div>

                {/* Image Section */}
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-lg"></div>
                        <img
                            src={antholemPhoto}
                            alt="Sam Manalo"
                            className="relative z-10 rounded-lg object-cover shadow-xl max-h-96 w-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
