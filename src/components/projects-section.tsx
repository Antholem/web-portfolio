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
      "Build a collaborative AI workspace where visitors capture ideas via text, voice dictation, or image uploads with session history stored in Supabase threads and Google Gemini-powered suggestions.",
    image: {
      src: "/assets/project-1.png",
      alt: "Screens showcasing the conversational AI workspace interface.",
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
    href: "https://example.com/conversational-ai-workspace",
    hrefLabel: "View project",
  },
  {
    title: "Responsive SPA from Scratch",
    description:
      "A fully responsive single-page application crafted with semantic HTML5, modern CSS3, and Vanilla JavaScript, progressively enhanced from layout foundations to interactive UI behaviors.",
    image: {
      src: "/assets/project-2.png",
      alt: "Preview of the responsive single-page application across devices.",
    },
    technologies: ["HTML5", "CSS3", "JavaScript"],
    href: "https://example.com/responsive-spa",
    hrefLabel: "View project",
  },
  {
    title: "Real-time Crypto Dashboard",
    description:
      "Real-time cryptocurrency tracking app powered by React and Material UI with live market data from the Coingecko API and dynamic routing for deep dives into individual assets.",
    image: {
      src: "/assets/project-3.png",
      alt: "Dashboard interface for the real-time cryptocurrency tracking app.",
    },
    technologies: ["React", "Material UI", "Coingecko API"],
    href: "https://example.com/crypto-dashboard",
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
