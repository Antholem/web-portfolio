import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  title: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  technologies: string[];
  href: string;
}

const projects: Project[] = [
  {
    title: "Voyager Travel Planner",
    summary:
      "A responsive itinerary builder that helps travelers map destinations, organize bookings, and share curated guides with their companions.",
    imageSrc:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Travel planner dashboard displayed on a laptop with a map of destinations.",
    technologies: ["Next.js", "Tailwind CSS", "Prisma"],
    href: "#",
  },
  {
    title: "Aurora Analytics",
    summary:
      "A data storytelling platform that transforms raw product metrics into interactive visual reports for growth teams.",
    imageSrc:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Colorful analytics dashboard with charts and graphs on a screen.",
    technologies: ["React", "D3.js", "Node.js"],
    href: "#",
  },
  {
    title: "Lumen Workspace",
    summary:
      "A minimalist project hub where remote teams can track milestones, share updates, and keep discussions organized in one place.",
    imageSrc:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern workspace with sticky notes and project planning materials.",
    technologies: ["TypeScript", "Supabase", "Tailwind"],
    href: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary/80">Featured Work</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projects I'm currently sharing
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A snapshot of the products and experiments I'm building. These images are temporary placeholders until
            final photography is ready.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className="flex h-full flex-col overflow-hidden border-border/80">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 ease-out hover:scale-105"
                />
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{project.summary}</p>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href={project.href} aria-label={`View details for ${project.title}`}>
                    View project
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
