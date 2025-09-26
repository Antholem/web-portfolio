import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    title: "Aurora Creative Studio",
    description:
      "A refined brand identity project that combines sleek typography with immersive art direction for a boutique agency.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Brand Strategy", "Art Direction", "Editorial Design"],
    link: "#",
  },
  {
    title: "Solstice Architecture",
    description:
      "Concept website for a sustainable architecture firm featuring interactive process highlights and project storytelling.",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    tags: ["Web Design", "Sustainability", "User Research"],
    link: "#",
  },
  {
    title: "Lumen Product Launch",
    description:
      "Launch campaign for a smart lighting system with modular visuals, social assets, and experiential pop-up design.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    tags: ["Campaign Strategy", "Motion Graphics", "Experiential"],
    link: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6">
      <div className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">Selected Work</p>
        <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Projects & Case Studies</h2>
        <p className="mx-auto max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
          A curated collection of multidisciplinary projects exploring digital products, visual identity, and immersive
          brand experiences. New commissions are always welcome.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={project.title} className="flex h-full flex-col overflow-hidden border-border/70 bg-background/60">
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority={index === 0}
              />
            </div>
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl font-semibold text-foreground">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground md:text-base">{project.description}</p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-0">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full justify-center text-sm font-medium">
                <Link href={project.link} aria-label={`View project: ${project.title}`}>
                  View project
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
