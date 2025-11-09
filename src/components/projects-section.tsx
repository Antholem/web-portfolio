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
    title: "Xeenapz",
    description:
      "An AI-driven conversational assistant built with Next.js and Chakra UI, integrating Google's Gemini API for natural, context-aware dialogue. Features real-time responses, text-to-speech interaction, and secure data management through Supabase.",
    image: {
      src: "/assets/project-1.png",
      alt: "Xeenapz AI Chatbot",
    },
    technologies: [
      "Next.js",
      "TypeScript",
      "Chakra UI",
      "Supabase",
      "Google Gemini API",
      "Text-to-Speech",
    ],
    href: "https://xeenapz.vercel.app/",
    hrefLabel: "View project",
  },
  {
    title: "Learn Type",
    description:
      "Single-page experience crafted with semantic HTML5, CSS3, and vanilla JavaScript, progressively enhanced into a fully responsive and interactive UI.",
    image: {
      src: "/assets/project-2.png",
      alt: "Responsive single-page application layout displayed across multiple device sizes.",
    },
    technologies: ["HTML5", "CSS3", "JavaScript"],
    href: "https://learn-type.vercel.app/",
    hrefLabel: "View project",
  },
  {
    title: "CryptCoin",
    description:
      "React and Material UI dashboard streaming live CoinGecko pricing, watchlists, and dynamic routing for deep dives into individual assets.",
    image: {
      src: "/assets/project-3.png",
      alt: "Real-time cryptocurrency dashboard with charts and market listings.",
    },
    technologies: ["React", "Material UI", "CoinGecko API"],
    href: "https://crypt-coin.vercel.app/",
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
