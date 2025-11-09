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
    title: "Atlas Insights",
    description:
      "Analytics dashboard for tracking KPIs with real-time charts, role-based access, and configurable reporting widgets.",
    image: {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      alt: "Laptop displaying a data analytics dashboard interface.",
    },
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    href: "https://example.com/atlas-insights",
    hrefLabel: "View project",
  },
  {
    title: "Aurora Commerce",
    description:
      "Headless e-commerce platform with personalized recommendations, smooth checkout flow, and automated inventory sync.",
    image: {
      src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
      alt: "Person browsing an online store on a tablet and phone.",
    },
    technologies: ["Next.js", "Shopify", "GraphQL"],
    href: "https://example.com/aurora-commerce",
    hrefLabel: "View project",
  },
  {
    title: "Horizon Studio",
    description:
      "Portfolio platform for creative studios, featuring modular layouts, smooth motion transitions, and accessible navigation.",
    image: {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      alt: "Designers collaborating while viewing a web project on a laptop.",
    },
    technologies: ["Next.js", "Contentful", "Framer Motion"],
    href: "https://example.com/horizon-studio",
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
