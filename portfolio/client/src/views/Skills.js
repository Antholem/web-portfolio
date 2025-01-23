import React from "react";
import * as Icon from "react-icons/si"
import { Card } from "../components";

// Skills data
const skills = [
    { 
        title: "HTML", 
        icon: <Icon.SiHtml5 className="text-brand text-7xl" />,
    },
    {
        title: "CSS",
        icon: <Icon.SiCss3 className="text-brand text-7xl" />,
    },
    {
        title: "EJS",
        icon: <Icon.SiJavascript className="text-brand text-7xl" />,
    },
    {
        title: "Tailwind",
        icon: <Icon.SiTailwindcss className="text-brand text-7xl" />,
    },
    {
        title: "Chakra UI",
        icon: <Icon.SiChakraui className="text-brand text-7xl" />,
    },
    {
        title: "Material UI",
        icon: <Icon.SiMui className="text-brand text-7xl" />,
    },
    {
        title: "NextJS",
        icon: <Icon.SiNextdotjs className="text-brand text-7xl" />,
    },
    {
        title: "ReactJS",
        icon: <Icon.SiReact className="text-brand text-7xl" />,
    },
    {
        title: "NodeJS",
        icon: <Icon.SiNodedotjs className="text-brand text-7xl" />,
    },
    {
        title: "ExpressJS",
        icon: <Icon.SiExpress className="text-brand text-7xl" />,
    },
    {
        title: "MongoDB",
        icon: <Icon.SiMongodb className="text-brand text-7xl" />,
    },
    {
        title: "MySQL",
        icon: <Icon.SiMysql className="text-brand text-7xl" />,
    },
];

const Skills = () => {
    return (
        <div>
            {/* Section Heading */}
            <header className="mb-8 text-center">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    Comprehensive technical skill set
                </h2>
                <h1 className="text-4xl font-heading font-bold">Skills</h1>
            </header>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mx-auto">
                {skills.map((skill, index) => (
                    <Card
                        key={index}
                        variant="elevated"
                        size="sm"
                        className="flex flex-col items-center justify-center gap-5"
                    >
                        {/* Skill Icon */}
                        <span>
                            {skill.icon}
                        </span>

                        {/* Skill Title */}
                        <h3 className="text-sm font-light">
                            {skill.title}
                        </h3>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Skills;
