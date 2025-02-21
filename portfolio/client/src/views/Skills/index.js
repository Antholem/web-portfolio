import React from "react";
import * as Icon from "react-icons/si"
import { Card, IconText } from "../../components";

// Skills data
const skills = [
    { 
        title: "HTML", 
        IconComponent: Icon.SiHtml5, 
    },
    {
        title: "CSS",
        IconComponent: Icon.SiCss3,
    },
    {
        title: "EJS",
        IconComponent: Icon.SiJavascript, 
    },
    {
        title: "Tailwind",
        IconComponent: Icon.SiTailwindcss,
    },
    {
        title: "Chakra UI",
        IconComponent: Icon.SiChakraui,
    },
    {
        title: "Material UI",
        IconComponent: Icon.SiMui,
    },
    {
        title: "NextJS",
        IconComponent: Icon.SiNextdotjs,
    },
    {
        title: "ReactJS",
        IconComponent: Icon.SiReact,
    },
    {
        title: "NodeJS",
        IconComponent: Icon.SiNodedotjs,
    },
    {
        title: "ExpressJS",
        IconComponent: Icon.SiExpress,
    },
    {
        title: "MongoDB",
        IconComponent: Icon.SiMongodb,
    },
    {
        title: "MySQL",
        IconComponent: Icon.SiMysql,
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
                {skills.map((skill, index) => {
                    const IconComponent = skill.IconComponent;
                    return (
                        <Card
                            key={index}
                            variant="elevated"
                            size="sm"
                            className="flex flex-col items-center justify-center gap-5"
                        >
                            {/* Skill Icon */}
                            <IconText 
                                icon={<IconComponent className="text-brand" />} 
                                size="xl5" 
                            />

                            {/* Skill Title */}
                            <h3 className="font-light">
                                {skill.title}
                            </h3>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
};

export default Skills;
