import { render, screen } from "@testing-library/react";
import { LucideProvider, Mail } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers/providers";
import { NAV_ITEMS, SECTIONS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";

import HomePage from "./page";

// next/font cannot run under Vitest; the layout only needs the class names.
vi.mock("geist/font/sans", () => ({
  GeistSans: { variable: "font-sans-var" },
}));
vi.mock("geist/font/mono", () => ({
  GeistMono: { variable: "font-mono-var" },
}));

function renderPage() {
  return render(
    <Providers>
      <SiteHeader />
      <HomePage />
      <SiteFooter />
    </Providers>,
  );
}

describe("home page", () => {
  it("renders a section for every section id, each exactly once", () => {
    renderPage();
    for (const { id } of Object.values(SECTIONS)) {
      expect(document.querySelectorAll(`#${id}`)).toHaveLength(1);
    }
  });

  it("has no duplicate ids", () => {
    renderPage();
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("has only in-page fragment links that resolve (except documented placeholders)", () => {
    renderPage();
    const fragments = [...document.querySelectorAll<HTMLAnchorElement>("a")]
      .map((a) => a.getAttribute("href")!)
      .filter((href) => href.startsWith("#") && href.length > 1);
    expect(fragments.length).toBeGreaterThan(NAV_ITEMS.length);
    for (const href of new Set(fragments)) {
      // `#top` is the HTML-spec "top of the document" fragment.
      if (href === "#top") continue;
      expect(document.getElementById(href.slice(1)), href).not.toBeNull();
    }
  });

  it("gives every link and button an accessible name", () => {
    renderPage();
    for (const el of [
      ...screen.getAllByRole("link"),
      ...screen.getAllByRole("button"),
    ]) {
      expect(el).toHaveAccessibleName();
    }
  });

  it("forms a sane heading outline: one h1, one h2 per section, no skipped levels", () => {
    renderPage();
    const headings = screen
      .getAllByRole("heading")
      .map((h) => Number(h.tagName.slice(1)));
    expect(headings.filter((l) => l === 1)).toHaveLength(1);
    expect(headings[0]).toBe(1);
    expect(headings.filter((l) => l === 2)).toHaveLength(
      Object.keys(SECTIONS).length,
    );
    headings.reduce((prev, level) => {
      expect(level - prev).toBeLessThanOrEqual(1);
      return level;
    });
  });

  it("puts each section's h2 inside that section", () => {
    renderPage();
    for (const { id } of Object.values(SECTIONS)) {
      expect(document.querySelector(`#${id} h2`)).not.toBeNull();
    }
  });

  it("exposes banner, main and contentinfo landmarks plus labelled navs", () => {
    renderPage();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Footer" }),
    ).toBeInTheDocument();
  });

  it("applies the dark theme by default and the 1.75 icon stroke", () => {
    const { container } = render(
      <Providers>
        <Mail data-testid="icon" />
      </Providers>,
    );
    expect(document.documentElement).toHaveClass("dark");
    expect(container.querySelector("svg")).toHaveAttribute(
      "stroke-width",
      "1.75",
    );
    // Sanity: without the provider lucide falls back to 2.
    const { container: bare } = render(
      <LucideProvider>
        <Mail />
      </LucideProvider>,
    );
    expect(bare.querySelector("svg")).toHaveAttribute("stroke-width", "2");
  });
});

describe("root layout metadata", () => {
  it("titles and describes the page from site config", async () => {
    const { metadata, viewport } = await import("./layout");
    expect(metadata.title).toBe(siteConfig.title);
    expect(metadata.description).toBe(siteConfig.description);
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: siteConfig.title,
      siteName: siteConfig.name,
    });
    // One tag for the default (dark) theme; ThemeColorMeta retargets it.
    expect(viewport.themeColor).toBe("#0a0a0a");
  });
});
