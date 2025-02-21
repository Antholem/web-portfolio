import React from "react";
import * as Icon from "react-icons/fa";
import { Card, IconText } from "../../components";

// Features data
const features = [
    {   
        IconComponent: Icon.FaLaptopCode, 
        title: "Web Development", 
        description: "Creating powerful and responsive websites with precision and creativity.", 
    },
    {
        IconComponent: Icon.FaPaintBrush, 
        title: "UX Design", 
        description: "Crafting seamless digital experiences through captivating design and usability.", 
    },
    {
        IconComponent: Icon.FaMobileAlt, 
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
                {features.map((feature, index) => {
                    const IconComponent = feature.IconComponent;
                    return (
                        <Card
                            key={index}
                            variant="elevated"
                            size="lg"
                            className="flex flex-col items-center justify-center gap-6"
                        >
                            {/* Feature Icon */}
                            <IconText 
                                icon={<IconComponent className="text-brand" />} 
                                size="xl6" 
                            />

                            {/* Feature Title and Description */}
                            <div className="flex flex-col items-start justify-center gap-2">
                                <h3 className="text-xl font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="text-sm font-light">
                                    {feature.description}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Features;
