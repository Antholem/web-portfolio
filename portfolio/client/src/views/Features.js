import React from "react";
import { FaLaptopCode, FaMobileAlt, FaPaintBrush } from "react-icons/fa";
import { useThemeStore } from "../store/themeStore";
import { Card } from "../components";

const features = [
    {
        icon: <FaLaptopCode className="text-brand text-5xl mb-4" />,
        title: "Web Development",
        description:
            "Creating powerful and responsive websites with precision and creativity.",
    },
    {
        icon: <FaPaintBrush className="text-brand text-5xl mb-4" />,
        title: "UX Design",
        description:
            "Crafting seamless digital experiences through captivating design and usability.",
    },
    {
        icon: <FaMobileAlt className="text-brand text-5xl mb-4" />,
        title: "Mobile Development",
        description:
            "Building innovative and intuitive mobile applications for diverse platforms.",
    }
];

const Features = () => {
    const { theme } = useThemeStore();

    return (
        <>
            <h2 className="text-sm font-heading tracking-widest text-brand mb-2">
                SERVICES I OFFER AND SPECIALIZE IN
            </h2>
            <h1 className="text-4xl font-heading font-bold mb-8">
                Features
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                {features.map((feature, index) => (
                    <Card
                        variant="elevated"
                        size="lg"
                        key={index}
                        className={`flex flex-col items-center justify-center gap-4 ${theme === "dark" ? "bg-dark-paper" : "bg-light-paper"}`}
                    >
                        {feature.icon}
                        <h3 className="text-xl font-semibold mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-center">
                            {feature.description}
                        </p>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default Features;
