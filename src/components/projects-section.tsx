import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    title: "Atlas Insights Dashboard",
    description:
      "An interactive analytics dashboard that tracks campaign KPIs, featuring real-time charts, role-based views, and configurable reporting widgets tailored for marketing teams.",
    image: {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      alt: "Laptop displaying a data analytics dashboard interface.",
    },
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    href: "https://example.com/atlas-insights",
    hrefLabel: "View case study",
  },
  {
    title: "Aurora Commerce Platform",
    description:
      "A headless e-commerce experience with personalized product curation, seamless checkout flows, and automated inventory sync across storefronts.",
    image: {
      src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
      alt: "Person browsing an online store on a tablet and phone.",
    },
    technologies: ["Next.js", "Shopify", "GraphQL"],
    href: "https://example.com/aurora-commerce",
    hrefLabel: "Visit project",
  },
  {
    title: "Horizon Studio Portfolio",
    description:
      "A modular creative studio portfolio designed to showcase motion work with cinematic storytelling, parallax transitions, and accessible navigation controls.",
    image: {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      alt: "Designers collaborating while viewing a web project on a laptop.",
    },
    technologies: ["Next.js", "Contentful", "Framer Motion"],
    href: "https://example.com/horizon-studio",
    hrefLabel: "See live site",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="bg-background py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
            Featured Work
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Crafted digital experiences grounded in strategic, scalable engineering
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Explore a selection of engagements where tailored design systems, performant architectures, and measurable outcomes came together to advance client goals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.title}
              className="flex h-full flex-col overflow-hidden"
            >
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

              <CardContent className="flex flex-1 flex-col gap-6 pt-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                </div>

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
              </CardContent>
              <CardFooter className="mt-auto w-full">
                <Button asChild className="w-full">
                  <Link href={project.href} target="_blank" rel="noreferrer noopener">
                    {project.hrefLabel}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
