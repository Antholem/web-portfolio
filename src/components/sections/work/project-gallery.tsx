"use client";

import { Fragment, useState, type ReactNode } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ProjectCategory, ProjectFilter } from "@/types/content";

type GalleryItem = {
  key: string;
  category: ProjectCategory;
  /** Server-rendered card; only visibility is decided on the client. */
  content: ReactNode;
};

type ProjectGalleryProps = {
  title: ReactNode;
  filters: ProjectFilter[];
  featured: GalleryItem;
  projects: GalleryItem[];
};

function ProjectGallery({
  title,
  filters,
  featured,
  projects,
}: ProjectGalleryProps) {
  const [filter, setFilter] = useState<ProjectFilter["value"]>("all");

  const isVisible = (item: GalleryItem) =>
    filter === "all" || item.category === filter;
  const visibleProjects = projects.filter(isVisible);

  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        {title}
        <ToggleGroup
          type="single"
          variant="segmented"
          aria-label="Filter projects"
          value={filter}
          onValueChange={(value) => {
            // Radix allows clearing a single toggle group; keep one filter selected.
            if (value) setFilter(value as ProjectFilter["value"]);
          }}
        >
          {filters.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-4">
        {isVisible(featured) ? featured.content : null}
        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-4">
            {visibleProjects.map((project) => (
              <Fragment key={project.key}>{project.content}</Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

export { ProjectGallery };
