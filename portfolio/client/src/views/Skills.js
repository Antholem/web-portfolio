import React from "react";
import * as SiIcons from "react-icons/si"
import { Card } from "../components";

// Skills data
const skills = [
    { 
        title: "HTML", 
        icon: <SiIcons.SiHtml5 className="text-brand text-7xl" />,
    },
    {
        title: "CSS",
        icon: <SiIcons.SiCss3 className="text-brand text-7xl" />,
    },
    {
        title: "EJS",
        icon: <SiIcons.SiJavascript className="text-brand text-7xl" />,
    },
    {
        title: "Tailwind",
        icon: <SiIcons.SiTailwindcss className="text-brand text-7xl" />,
    },
    {
        title: "Chakra UI",
        icon: <SiIcons.SiChakraui className="text-brand text-7xl" />,
    },
    {
        title: "Material UI",
        icon: <SiIcons.SiMui className="text-brand text-7xl" />,
    },
    {
        title: "NextJS",
        icon: <SiIcons.SiNextdotjs className="text-brand text-7xl" />,
    },
    {
        title: "ReactJS",
        icon: <SiIcons.SiReact className="text-brand text-7xl" />,
    },
    {
        title: "NodeJS",
        icon: <SiIcons.SiNodedotjs className="text-brand text-7xl" />,
    },
    {
        title: "ExpressJS",
        icon: <SiIcons.SiExpress className="text-brand text-7xl" />,
    },
    {
        title: "MongoDB",
        icon: <SiIcons.SiMongodb className="text-brand text-7xl" />,
    },
    {
        title: "MySQL",
        icon: <SiIcons.SiMysql className="text-brand text-7xl" />,
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
