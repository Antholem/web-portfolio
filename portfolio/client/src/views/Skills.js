import React from "react";
import { FaLaptopCode } from "react-icons/fa";
import { Card } from "../components";

// Skills data
const skills = Array(5).fill({
    icon: <FaLaptopCode className="text-brand text-5xl mb-4" />,
    title: "Skills",
});

const Skills = () => {
    return (
        <div className="text-center">
            {/* Section Heading */}
            <header className="mb-8">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    Comprehensive technical skill set
                </h2>
                <h1 className="text-4xl font-heading font-bold">Skills</h1>
            </header>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {skills.map((skill, index) => (
                    <Card
                        key={index}
                        variant="elevated"
                        size="sm"
                        className="flex flex-col items-center justify-center gap-2"
                    >
                        {/* Skill Icon */}
                        {skill.icon}

                        {/* Skill Title */}
                        <h3 className="text-base font-semibold">{skill.title}</h3>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Skills;
