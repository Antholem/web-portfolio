import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Project = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  technologies: string[];
  href: string;
  hrefLabel: string;
};

const projects: Project[] = [
  {
    title: "Conversational AI Workspace",
    description:
      "Multi-modal ideation hub with Supabase thread storage, Google Gemini-powered suggestions, and replayable TTS responses.",
    image: {
      src: "/assets/project-1.png",
      alt: "Conversational AI workspace interface showcasing chat history, media uploads, and voice controls.",
    },
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Supabase",
      "Google Gemini API",
      "Chakra UI",
      "Framer Motion",
      "Web Speech API",
    ],
    href: "#",
    hrefLabel: "View project",
  },
  {
    title: "Responsive SPA from Scratch",
    description:
      "Static single-page application crafted with semantic HTML, modern CSS, and Vanilla JS for fully responsive interactions.",
    image: {
      src: "/assets/project-2.png",
      alt: "Screens from a responsive single-page website built with HTML, CSS, and JavaScript.",
    },
    technologies: ["HTML5", "CSS3", "JavaScript"],
    href: "#",
    hrefLabel: "View project",
  },
  {
    title: "Real-time Crypto Markets Dashboard",
    description:
      "Live cryptocurrency tracker with dynamic routing, Material UI theming, and CoinGecko-powered market updates.",
    image: {
      src: "/assets/project-3.png",
      alt: "Crypto dashboard highlighting market stats, charts, and currency filters.",
    },
    technologies: ["React", "Material UI", "CoinGecko API"],
    href: "#",
    hrefLabel: "View project",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Projects
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Scalable products built with precision
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A selection of web applications engineered for performance,
            usability, and maintainability.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className="flex h-full flex-col overflow-hidden">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 hover:scale-105"
                  priority={false}
                />
              </div>

              <CardHeader className="space-y-3">
                <CardTitle className="text-xl text-foreground">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-5">
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button asChild className="w-full">
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {project.hrefLabel}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
