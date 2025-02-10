import React from "react";
import antholemPhoto from "../../antholem.png";
import { Button } from "../../components";
import * as Icon from "react-icons/md";
import { Link } from "react-scroll";                                

const About = () => {
    return (
        <div className="w-full mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text Section */}
            <div className="order-2 md:order-1 text-center md:text-left mx-auto md:mx-0">
                <h2 className="text-lg tracking-wide">HELLO!</h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                    I'm <span className="text-brand">Sam Manalo</span>
                </h1>
                <h3 className="text-xl md:text-2xl font-medium">Software Engineer.</h3>
                <p className="text-base md:text-lg font-light leading-relaxed mt-4">
                    I am a passionate Software Engineer and React Developer dedicated to
                    crafting visually engaging and user-focused websites. With expertise
                    in modern technologies like HTML5, CSS3, ES6+, and React.js, I excel
                    at delivering seamless and immersive digital experiences that leave
                    a lasting impression.
                </p>
                <div className="flex justify-center md:justify-start space-x-4 mt-6">
                    <Button variant="contained" leftIcon={<Icon.MdAttachFile />}>
                        Resume
                    </Button>
                    <Link
                        to={"contacts"}
                        smooth
                        duration={500}
                        spy
                        activeClass="text-brand"
                        className="block"
                    >
                        <Button variant="outlined" leftIcon={<Icon.MdCall />}>
                            Contact
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Image Section */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
                <img
                    src={antholemPhoto}
                    alt="Sam Manalo"
                    className="rounded-lg object-cover w-full max-w-md"
                />
            </div>
        </div>
    );
};

export default About;
