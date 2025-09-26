import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const projects = [
  {
    title: "Immersive Design System",
    description:
      "A modular design system crafted for a distributed product team, focused on rapid prototyping and consistent hand-offs.",
    imageSrc: "/projects/immersive-design.svg",
    imageAlt: "Abstract shapes representing a design system dashboard",
    technologies: ["Figma", "React", "Storybook"],
    link: "https://example.com/immersive-design-system",
    linkLabel: "View case study",
  },
  {
    title: "Data Insights Portal",
    description:
      "A responsive analytics portal that visualizes customer KPIs and integrates with real-time reporting pipelines.",
    imageSrc: "/projects/data-insights.svg",
    imageAlt: "Stylized charts and graphs symbolizing an analytics portal",
    technologies: ["Next.js", "TypeScript", "D3.js"],
    link: "https://example.com/data-insights-portal",
    linkLabel: "Explore dashboard",
  },
  {
    title: "Community Learning Hub",
    description:
      "An accessible learning platform featuring curated courses, collaborative study rooms, and dynamic progress tracking.",
    imageSrc: "/projects/community-learning.svg",
    imageAlt: "Illustration of people collaborating around a laptop",
    technologies: ["Node.js", "PostgreSQL", "Tailwind CSS"],
    link: "https://example.com/community-learning-hub",
    linkLabel: "See product tour",
  },
] as const;

const linkClasses =
  "inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80";

const badgeClasses =
  "rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground";

export default function ProjectsSection() {
  return (
    <section aria-labelledby="projects-heading" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Selected Work</p>
          <h2 id="projects-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A snapshot of multidisciplinary collaborations ranging from scalable platforms to immersive digital experiences.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className="flex h-full flex-col overflow-hidden">
              <div className="relative h-48 w-full bg-muted">
                <Image
                  alt={project.imageAlt}
                  src={project.imageSrc}
                  fill
                  sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-semibold">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardHeader>
              <CardContent className="mt-auto flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span className={badgeClasses} key={technology}>
                    {technology}
                  </span>
                ))}
              </CardContent>
              <CardFooter>
                <a
                  aria-label={project.linkLabel}
                  className={linkClasses}
                  href={project.link}
                  rel="noreferrer"
                  target="_blank"
                >
                  {project.linkLabel}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M7 17 17 7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
