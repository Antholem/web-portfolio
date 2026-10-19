import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/constants/site";
import { work } from "@/lib/data";

import { ProjectGallery } from "./project-gallery";
import { WorkSection } from "./work-section";

const projectNames = () =>
  screen
    .getAllByRole("article")
    .map(
      (article) =>
        within(article).getByRole("heading", { level: 3 }).textContent,
    );

const allNames = [work.featured.name, ...work.projects.map((p) => p.name)];

function namesFor(category: string) {
  return [work.featured, ...work.projects]
    .filter((p) => category === "all" || p.category === category)
    .map((p) => p.name);
}

describe("WorkSection", () => {
  it("shows the title, the filter and every project by default", () => {
    render(<WorkSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: work.title }),
    ).toBeInTheDocument();
    const filter = screen.getByRole("radiogroup", { name: "Filter projects" });
    expect(
      within(filter)
        .getAllByRole("radio")
        .map((r) => r.textContent),
    ).toEqual(work.filters.map((f) => f.label));
    expect(within(filter).getByRole("radio", { name: "All" })).toBeChecked();
    expect(projectNames()).toEqual(allNames);
  });

  it.each(work.filters.map((f) => [f.label, f.value]))(
    "filter “%s” shows only matching projects",
    async (label, value) => {
      const user = userEvent.setup({ delay: null });
      render(<WorkSection />);
      // Start from a different filter so "All" is exercised as a transition too.
      await user.click(screen.getByRole("radio", { name: "Open source" }));
      await user.click(screen.getByRole("radio", { name: label }));
      expect(screen.getByRole("radio", { name: label })).toBeChecked();
      expect(projectNames()).toEqual(namesFor(value));
    },
  );

  it("keeps the current filter when its active button is clicked again", async () => {
    const user = userEvent.setup({ delay: null });
    render(<WorkSection />);
    const ai = screen.getByRole("radio", { name: "AI" });
    await user.click(ai);
    await user.click(ai);
    expect(ai).toBeChecked();
    expect(projectNames()).toEqual(namesFor("ai"));
  });

  it("filters from the keyboard", async () => {
    const user = userEvent.setup({ delay: null });
    render(<WorkSection />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "All" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "AI" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("radio", { name: "AI" })).toBeChecked();
    expect(projectNames()).toEqual(namesFor("ai"));
  });

  it("renders the featured project's details and links", () => {
    render(<WorkSection />);
    const featured = screen
      .getByRole("heading", { level: 3, name: work.featured.name })
      .closest("article")!;
    const card = within(featured);
    expect(featured).toHaveTextContent("Featured");
    expect(featured).toHaveTextContent(work.featured.year);
    expect(featured).toHaveTextContent(work.featured.role);
    expect(featured).toHaveTextContent(work.featured.tagline);
    expect(featured).toHaveTextContent(work.featured.summary);
    for (const h of work.featured.highlights) {
      expect(card.getByText(h)).toBeInTheDocument();
    }
    expect(card.getByRole("link", { name: "Case study" })).toHaveAttribute(
      "href",
      work.featured.links.caseStudy,
    );
    expect(card.getByRole("link", { name: "Live demo" })).toHaveAttribute(
      "href",
      work.featured.links.demo,
    );
    expect(
      card.getByRole("link", {
        name: `${work.featured.name} source on GitHub`,
      }),
    ).toHaveAttribute("href", work.featured.links.source);
  });

  it("renders each project card's meta, summary, tags and links", () => {
    render(<WorkSection />);
    for (const project of work.projects) {
      const article = screen
        .getByRole("heading", { level: 3, name: project.name })
        .closest("article")!;
      expect(article).toHaveTextContent(`${project.year} · ${project.kind}`);
      expect(article).toHaveTextContent(project.summary);
      for (const tag of project.tags) {
        expect(within(article).getByText(tag)).toBeInTheDocument();
      }
      const links = within(article)
        .getAllByRole("link")
        .map((a) => [a.textContent, a.getAttribute("href")]);
      expect(links).toEqual(project.links.map((l) => [l.label, l.href]));
    }
  });

  it("hides decorative previews from assistive tech", () => {
    render(<WorkSection />);
    // Mock-up copy such as "ledgerline.app/overview" must not be read out.
    for (const text of [
      "ledgerline.app/overview",
      "Cart · 2",
      "Insert draft",
    ]) {
      expect(
        screen.getByText(text).closest("[aria-hidden='true']"),
      ).not.toBeNull();
    }
    for (const article of screen.getAllByRole("article")) {
      expect(article.querySelector("[aria-hidden='true']")).not.toBeNull();
    }
  });

  it("links to more work on GitHub", () => {
    render(<WorkSection />);
    expect(
      screen.getByRole("link", { name: "More on GitHub" }),
    ).toHaveAttribute("href", siteConfig.links.github);
  });
});

describe("ProjectGallery (isolated)", () => {
  const item = (key: string, category: "web" | "ai" | "oss") => ({
    key,
    category,
    content: <article aria-label={key}>{key}</article>,
  });

  it("renders nothing for a filter with no matches (no crash, no stray grid)", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ProjectGallery
        title={<h2>Work</h2>}
        filters={[
          { value: "all", label: "All" },
          { value: "oss", label: "OSS" },
        ]}
        featured={item("feat", "web")}
        projects={[item("p1", "ai")]}
      />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
    await user.click(screen.getByRole("radio", { name: "OSS" }));
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
