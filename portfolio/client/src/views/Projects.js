import React from "react";
import { Button, Card } from "../components";
import * as Icon from "react-icons/fa";

// Projects data
const projects = [
    {
        image: "https://placehold.co/1200x800",
        name: "Web Development",
        description:
            "Creating powerful and responsive websites with precision and creativity. Elevating web experiences with cutting-edge design and seamless functionality.",
        liveUrl: "https://example.com/demo/web-development",
        sourceUrl: "https://github.com/username/web-development",
    },
    {
        image: "https://placehold.co/1200x800",
        name: "UX Design",
        description:
            "Crafting seamless digital experiences through captivating design and usability.",
        liveUrl: "https://example.com/demo/ux-design",
        sourceUrl: "https://github.com/username/ux-design",
    },
    {
        image: "https://placehold.co/1200x800",
        name: "Mobile Development",
        description:
            "Building innovative and intuitive mobile applications for diverse platforms.",
        liveUrl: "https://example.com/demo/mobile-development",
        sourceUrl: "https://github.com/username/mobile-development",
    },
];

const Projects = () => {
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
                        <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-60 object-cover rounded-lg"
                        />

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
                                variant="contained"
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
