import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/constants/site";
import { work } from "@/lib/data";

import { WorkSection } from "./work-section";

const { project } = work;

describe("WorkSection", () => {
  it("shows the section title and the project", () => {
    render(<WorkSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: work.title }),
    ).toBeInTheDocument();
    const article = screen.getByRole("article");
    expect(
      within(article).getByRole("heading", { level: 3, name: project.name }),
    ).toBeInTheDocument();
    expect(article).toHaveTextContent(project.tagline);
    expect(article).toHaveTextContent(project.summary);
    for (const highlight of project.highlights)
      expect(article).toHaveTextContent(highlight);
    for (const tag of project.tags)
      expect(within(article).getByText(tag)).toBeInTheDocument();
  });

  it("no longer has a project filter", () => {
    render(<WorkSection />);
    expect(
      screen.queryByRole("radiogroup", { name: "Filter projects" }),
    ).not.toBeInTheDocument();
  });

  it("links to the live site and the source in a new tab, and says so", () => {
    render(<WorkSection />);
    const live = screen.getByRole("link", { name: /Visit live site/ });
    const source = screen.getByRole("link", { name: /Source code/ });
    expect(live).toHaveAttribute("href", project.links.live);
    expect(source).toHaveAttribute("href", project.links.source);
    for (const link of [live, source]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAccessibleName(/opens in a new tab/);
    }
  });

  it("shows the screenshot as a link to the live app", () => {
    render(<WorkSection />);
    const screenshot = screen.getByRole("img", { name: project.image.alt });
    expect(screenshot.closest("a")).toHaveAttribute("href", project.links.live);
    expect(
      screen.getByText(new URL(project.links.live).host),
    ).toBeInTheDocument();
  });

  it("still links to the GitHub profile", () => {
    render(<WorkSection />);
    expect(
      screen.getByRole("link", { name: "More on GitHub" }),
    ).toHaveAttribute("href", siteConfig.links.github);
  });
});
