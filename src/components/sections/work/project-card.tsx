import { TagList } from "@/components/shared/tag";
import { TextLink } from "@/components/shared/text-link";
import { Card } from "@/components/ui/card";
import type { Project } from "@/types/content";

import { PROJECT_PREVIEWS } from "./previews/project-previews";

function ProjectCard({ project }: { project: Project }) {
  const Preview = PROJECT_PREVIEWS[project.slug];

  return (
    <Card
      asChild
      interactive
      className="flex flex-col overflow-hidden bg-background"
    >
      <article>
        <div aria-hidden className="border-b border-border bg-muted px-6 pt-6">
          <Preview />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-7">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[20px] font-semibold tracking-tight">
              {project.name}
            </h3>
            <span className="font-mono text-[12px] text-subtle-foreground">
              {project.year} · {project.kind}
            </span>
          </div>
          <p className="text-[14px] leading-[1.6] text-muted-foreground">
            {project.summary}
          </p>
          <TagList tags={project.tags} />
          <div className="mt-auto flex gap-4 pt-2 text-[14px] font-medium">
            {project.links.map((link) => (
              <TextLink key={link.label} href={link.href}>
                {link.label}
              </TextLink>
            ))}
          </div>
        </div>
      </article>
    </Card>
  );
}

export { ProjectCard };
