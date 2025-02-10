import React from "react";
import * as Icon from "react-icons/fa";
import { Card } from "../../components";

// Features data
const features = [
    {
        icon: <Icon.FaLaptopCode className="text-brand text-5xl mb-4" />,
        title: "Web Development",
        description: "Creating powerful and responsive websites with precision and creativity.",
    },
    {
        icon: <Icon.FaPaintBrush className="text-brand text-5xl mb-4" />,
        title: "UX Design",
        description: "Crafting seamless digital experiences through captivating design and usability.",
    },
    {
        icon: <Icon.FaMobileAlt className="text-brand text-5xl mb-4" />,
        title: "Mobile Development",
        description: "Building innovative and intuitive mobile applications for diverse platforms.",
    },
];

const Features = () => {
    return (
        <div>
            {/* Section Heading */}
            <header className="mb-8 text-center">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    Services I Offer and Specialize In
                </h2>
                <h1 className="text-4xl font-heading font-bold">Features</h1>
            </header>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        variant="elevated"
                        size="lg"
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        {/* Feature Icon */}
                        {feature.icon}

                        {/* Feature Title and Description */}
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h3 className="text-xl font-semibold">
                                {feature.title}
                            </h3>
                            <p className="text-center text-sm font-light">
                                {feature.description}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Features;
