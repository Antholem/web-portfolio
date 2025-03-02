import React from "react";
import { useThemeStore } from "../../store/themeStore";

const skills = [
    { name: "HTML", level: "Master", date: 2018 },
    { name: "CSS", level: "Master", date: 2018 },
    { name: "EJS", level: "Expert", date: 2020 },
    { name: "Tailwind", level: "Master", date: 2023 },
    { name: "Chakra UI", level: "Expert", date: 2023 },
    { name: "Material UI", level: "Expert", date: 2023 },
    { name: "NextJS", level: "Expert", date: 2023 },
    { name: "ReactJS", level: "Expert", date: 2022 },
    { name: "NodeJS", level: "Advanced", date: 2020 },
    { name: "ExpressJS", level: "Advanced", date: 2020 },
    { name: "Firebase", level: "Advanced", date: 2024 },
    { name: "MongoDB", level: "Expert", date: 2021 },
    { name: "MySQL", level: "Expert", date: 2021 },
];

const levelMapping = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
    Expert: 4,
    Master: 5,
};

const Skills = () => {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const currentYear = new Date().getFullYear();

    return (
        <div>
            {/* Section Heading */}
            <header className="mb-8 text-center">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    Comprehensive Technical Skill Set
                </h2>
                <h1 className="text-4xl font-heading font-bold">Skills</h1>
            </header>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5">
                {skills.map((skill, index) => {
                    const yearsOfExperience = currentYear - skill.date;
                    const experienceText = yearsOfExperience === 1 ? "1 year" : `${yearsOfExperience} years`;

                    return (
                        <div key={index}>
                            {/* Skill Name & Level */}
                            <div className="flex justify-between items-center mb-1">
                                <span className="flex flex-row items-center gap-1 text-lg font-semibold">
                                    <span>
                                        {skill.name}
                                    </span>
                                    <span className="text-xs font-light">
                                        ({yearsOfExperience > 0 ? experienceText : "Less than a year"})
                                    </span>
                                </span>
                                <span className="text-sm font-light">{skill.level}</span>
                            </div>

                            {/* Skill Level Bars */}
                            <div className="flex space-x-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 flex-1 ${i < levelMapping[skill.level] ? "bg-brand" :
                                                isDark ? "bg-dark-action-disabled" : "bg-light-action-disabled"
                                            }`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Skills;
