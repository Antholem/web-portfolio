import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NAV_ITEMS } from "@/constants/navigation";
import { notFound } from "@/lib/data";

import NotFound, { metadata } from "./not-found";

describe("NotFound (404 page)", () => {
  it("is titled for the tab (the layout template appends the name)", () => {
    expect(metadata.title).toBe("Page not found");
  });

  it("explains what happened under a single h1; the big 404 is decorative", () => {
    const { container } = render(<NotFound />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: notFound.heading }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(screen.getByText(notFound.body)).toBeInTheDocument();
    const decorative = [...container.querySelectorAll("[aria-hidden]")].find(
      (el) => el.textContent === "404",
    );
    expect(decorative).toBeDefined();
  });

  it("offers a way home and a way to get in touch", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: notFound.home })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: notFound.contact }),
    ).toHaveAttribute("href", "/#contact");
  });

  it("links every home section by path, so the links leave the 404", () => {
    render(<NotFound />);
    const links = within(
      screen.getByRole("navigation", { name: notFound.jumpTo }),
    ).getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
      NAV_ITEMS.map((item) => [item.label, item.href]),
    );
  });
});
