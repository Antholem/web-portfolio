import { ArrowRight, ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons/brand-icons";
import { CheckList } from "@/components/shared/check-list";
import { TagList } from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FeaturedProject } from "@/types/content";

import { PROJECT_PREVIEWS } from "./previews/project-previews";

function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  const Preview = PROJECT_PREVIEWS[project.slug];

  return (
    <Card
      asChild
      interactive
      className="grid grid-cols-1 overflow-hidden bg-background md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <article>
        <div className="flex flex-col justify-between gap-7 p-10">
          <div className="flex flex-col gap-5">
            <p className="flex flex-wrap gap-2 font-mono text-[12px] tracking-[0.04em] text-subtle-foreground uppercase">
              <span className="text-foreground">Featured</span>
              <span aria-hidden>·</span>
              <span>{project.year}</span>
              <span aria-hidden>·</span>
              <span>{project.role}</span>
            </p>
            <div className="flex flex-col gap-2">
              <h3 className="text-[32px] font-semibold tracking-[-0.035em]">
                {project.name}
              </h3>
              <p className="text-[17px] text-foreground">{project.tagline}</p>
            </div>
            <p className="text-[15px] leading-[1.65] text-muted-foreground">
              {project.summary}
            </p>
            <CheckList items={project.highlights} className="gap-2.5" />
          </div>

          <div className="flex flex-col gap-5">
            <TagList tags={project.tags} />
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a href={project.links.caseStudy}>
                  Case study
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={project.links.demo}>
                  Live demo
                  <ArrowUpRight aria-hidden />
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <a
                  href={project.links.source}
                  aria-label={`${project.name} source on GitHub`}
                >
                  <GitHubIcon />
                  Source
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="flex items-center border-t border-border bg-muted p-10 md:border-t-0 md:border-l"
        >
          <Preview />
        </div>
      </article>
    </Card>
  );
}

export { FeaturedProjectCard };
