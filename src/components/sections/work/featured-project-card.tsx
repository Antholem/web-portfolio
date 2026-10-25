import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons/brand-icons";
import { CheckList } from "@/components/shared/check-list";
import { StatusDot } from "@/components/shared/status-dot";
import { TagList } from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/types/content";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

function FeaturedProjectCard({ project }: { project: Project }) {
  const host = new URL(project.links.live).host;

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
                <a href={project.links.live} {...external}>
                  Visit live site
                  <ArrowUpRight aria-hidden className="nudge-diagonal" />
                  <NewTab />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={project.links.source} {...external}>
                  <GitHubIcon />
                  Source code
                  <NewTab />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center border-t border-border bg-muted p-6 sm:p-10 md:border-t-0 md:border-l">
          <a
            href={project.links.live}
            {...external}
            className="group/shot block w-full overflow-hidden rounded-xl border border-input bg-card shadow-elevated"
          >
            <span className="flex h-8.5 items-center gap-1.5 border-b border-border bg-surface px-3">
              <span aria-hidden className="size-2 rounded-full bg-input" />
              <span aria-hidden className="size-2 rounded-full bg-input" />
              <span aria-hidden className="size-2 rounded-full bg-input" />
              <span className="ml-2.5 min-w-0 truncate rounded-md bg-muted px-2.5 py-0.75 font-mono text-[10.5px] text-subtle-foreground">
                {host}
              </span>
              <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2 py-0.75 font-mono text-[10px] text-muted-foreground">
                <StatusDot className="size-1.5" />
                LIVE
              </span>
            </span>
            <span className="block overflow-hidden">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                sizes="(min-width: 60rem) 640px, 100vw"
                className="h-auto w-full transition-[scale] duration-500 ease-out group-hover/shot:scale-[1.02] motion-reduce:transition-none"
              />
            </span>
            <span className="sr-only">
              Open {project.name}
              <NewTab />
            </span>
          </a>
        </div>
      </article>
    </Card>
  );
}

export { FeaturedProjectCard };
