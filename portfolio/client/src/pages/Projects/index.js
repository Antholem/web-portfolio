import React from "react";
import { useThemeStore } from "../../stores/useTheme";
import { Button, Card } from "../../components";
import * as Icon from "react-icons/fa";
import project_1 from "./project-1.png";
import project_2 from "./project-2.png";
import project_3 from "./project-3.png";

// Projects data
const projects = [
    {
        image: project_1,
        name: "Learn Type",
        description: "A Static Single Page Application that built entirely from Scratch Using HTML, CSS, and VanillaJS.",
        liveUrl: "https://learn-type.vercel.app/",
        sourceUrl: "https://github.com/Antholem/Learn-Type",
    },
    {
        image: project_2,
        name: "PokéAPI",
        description: "A Restful Pokémon API Application Using ReactJS and Material UI with customizable.",
        liveUrl: "https://poke-api-2023.vercel.app/",
        sourceUrl: "https://github.com/Antholem/PokeAPI",
    },
    {
        image: project_3,
        name: "CryptCoin",
        description: "Real-time cryptocurrency app using ReactJS and Material UI with Coingecko API for live data and dynamic routing.",
        liveUrl: "https://crypt-coin.vercel.app/",
        sourceUrl: "https://github.com/Antholem/Crypt-Coin",
    },
];

const Projects = () => {
    const { theme } = useThemeStore();

    return (
        <section className="py-12">
            {/* Section Heading */}
            <header className="text-center mb-12">
                <h2 className="text-sm font-heading tracking-widest uppercase text-brand mb-2">
                    Discover My Projects
                </h2>
                <h1 className="text-4xl font-heading font-bold">Projects</h1>
            </header>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <Card
                        key={index}
                        variant="elevated"
                        size="md"
                        className="flex flex-col items-start gap-6 p-6"
                    >

                        {/* Project Image */}
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-52 object-cover rounded-lg"
                            />
                        ) : (
                            <div className={`w-full h-52 object-cover rounded-lg flex justify-center items-center ${theme === "dark" ? "bg-dark-action-disabled" : "bg-light-action-disabled"}`}>
                                <Icon.FaImage className={`text-9xl ${theme === "dark" ? "text-dark-text-disabled" : "text-light-text-disabled"}`} />
                            </div>
                        )}

                        {/* Project Details */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            <p className="text-sm font-light">
                                {project.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-auto">
                            <Button
                                variant="solid"
                                leftIcon={<Icon.FaGlobe />}
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Demo
                            </Button>
                            <Button
                                variant="outlined"
                                leftIcon={<Icon.FaCode />}
                                href={project.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Source
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default Projects;
