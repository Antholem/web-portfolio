import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/constants/site";
import {
  about,
  experience,
  hero,
  services,
  stack,
  techMarquee,
} from "@/lib/data";

import { AboutSection } from "./about-section";
import { ExperienceSection } from "./experience-section";
import { HeroSection } from "./hero/hero-section";
import { ServicesSection } from "./services-section";
import { StackSection } from "./stack-section";
import { TechMarquee } from "./tech-marquee";

const stripMarkers = (text: string) => text.replaceAll("**", "");

describe("HeroSection", () => {
  it("leads with the name as the page's only h1", () => {
    render(<HeroSection />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(hero.nameLines.join(" "));
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("shows availability, tagline (without ** markers), summary and location", () => {
    const { container } = render(<HeroSection />);
    expect(container).toHaveTextContent(hero.availability);
    expect(container).toHaveTextContent(stripMarkers(hero.tagline));
    expect(container).not.toHaveTextContent("**");
    expect(container).toHaveTextContent(hero.summary);
    expect(container).toHaveTextContent(siteConfig.location.short);
    expect(container).toHaveTextContent(siteConfig.location.timezone);
  });

  it("links the CTAs and social icons where the config says", () => {
    render(<HeroSection />);
    expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute(
      "href",
      "#work",
    );
    expect(
      screen.getByRole("link", { name: "Download résumé" }),
    ).toHaveAttribute("href", siteConfig.links.resume);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      siteConfig.links.github,
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      siteConfig.links.linkedin,
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}`,
    );
  });

  it("describes the portrait, with nothing laid over it", () => {
    const { container } = render(<HeroSection />);
    expect(screen.getByRole("img", { name: hero.portraitAlt })).toBeVisible();
    expect(container).not.toHaveTextContent("sam.config.ts");
  });
});

describe("TechMarquee", () => {
  it("exposes each technology once to assistive tech, despite the visual loop", () => {
    render(<TechMarquee />);
    const region = screen.getByRole("region", {
      name: "Technologies I work with",
    });
    const items = within(region).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(techMarquee);
    // The duplicated half exists for the seamless loop but is hidden.
    expect(region.querySelectorAll("li")).toHaveLength(techMarquee.length * 2);
  });

  it("stops scrolling for reduced-motion users", () => {
    render(<TechMarquee />);
    expect(screen.getAllByRole("list")[0]).toHaveClass(
      "animate-marquee",
      "motion-reduce:animate-none",
    );
  });
});

describe("AboutSection", () => {
  it("renders the numbered header, title, lead and paragraphs", () => {
    const { container } = render(<AboutSection />);
    const section = container.querySelector("section#about")!;
    expect(section).toHaveTextContent("01 / About");
    expect(
      screen.getByRole("heading", { level: 2, name: about.title }),
    ).toBeInTheDocument();
    expect(section).toHaveTextContent(about.lead);
    for (const p of about.paragraphs) {
      expect(section).toHaveTextContent(stripMarkers(p));
    }
    expect(section).not.toHaveTextContent("**");
  });

  it("lists every focus area as an h3 under the h2", () => {
    render(<AboutSection />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(about.focusAreas.length);
    about.focusAreas.forEach((area, i) => {
      expect(
        within(items[i]).getByRole("heading", { level: 3, name: area.title }),
      ).toBeInTheDocument();
      expect(items[i]).toHaveTextContent(area.description);
    });
  });
});

describe("ExperienceSection", () => {
  it("renders an ordered list of roles with details and tags", () => {
    render(<ExperienceSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: experience.title }),
    ).toBeInTheDocument();
    const list = screen.getAllByRole("list").find((el) => el.tagName === "OL")!;
    const entries = within(list)
      .getAllByRole("listitem")
      .filter((li) => li.parentElement === list);
    expect(entries).toHaveLength(experience.items.length);

    experience.items.forEach((item, i) => {
      const entry = within(entries[i]);
      expect(
        entry.getByRole("heading", { level: 3, name: item.role }),
      ).toBeInTheDocument();
      expect(entries[i]).toHaveTextContent(item.period);
      expect(entries[i]).toHaveTextContent(
        [item.organization, ...item.details].join(" · "),
      );
      expect(entries[i]).toHaveTextContent(item.summary);
      for (const tag of item.tags)
        expect(entry.getByText(tag)).toBeInTheDocument();
    });
  });

  it("links to the full résumé", () => {
    render(<ExperienceSection />);
    expect(screen.getByRole("link", { name: "Full résumé" })).toHaveAttribute(
      "href",
      siteConfig.links.resume,
    );
  });
});

describe("StackSection", () => {
  it("renders each group with its tools and a spoken tool count", () => {
    render(<StackSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: stack.title }),
    ).toBeInTheDocument();
    for (const group of stack.groups) {
      const heading = screen.getByRole("heading", {
        level: 3,
        name: group.title,
      });
      const card = heading.closest("li")!;
      expect(card).toHaveTextContent(`${group.tools.length} tools`);
      const tags = within(card)
        .getAllByRole("listitem")
        .map((li) => li.textContent);
      expect(tags).toEqual(group.tools);
    }
  });
});

describe("ServicesSection", () => {
  it("renders a numbered article per service with its features", () => {
    render(<ServicesSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: services.title }),
    ).toBeInTheDocument();
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(services.items.length);
    services.items.forEach((service, i) => {
      const article = within(articles[i]);
      expect(articles[i]).toHaveTextContent(
        `S—${String(i + 1).padStart(2, "0")}`,
      );
      expect(
        article.getByRole("heading", { level: 3, name: service.title }),
      ).toBeInTheDocument();
      expect(
        article.getAllByRole("listitem").map((li) => li.textContent),
      ).toEqual(service.features);
    });
  });
});
