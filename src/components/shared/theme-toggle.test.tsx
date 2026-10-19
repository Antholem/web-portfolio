import { renderToString } from "react-dom/server";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "./theme-toggle";

function renderToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

const html = document.documentElement;

function mockReducedMotion(reduce: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: reduce && query.includes("prefers-reduced-motion: reduce"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
}

describe("ThemeToggle", () => {
  afterEach(() => {
    // @ts-expect-error -- remove the per-test stub
    delete document.startViewTransition;
  });

  it("server-renders a neutral label (theme is unknown before hydration)", () => {
    const markup = renderToString(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(markup).toContain('aria-label="Toggle theme"');
  });

  it("defaults to dark and offers to switch to light", () => {
    renderToggle();
    expect(html).toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("toggles dark ⇄ light, updating the class, label and stored preference (no View Transitions)", async () => {
    const user = userEvent.setup({ delay: null });
    renderToggle();

    await user.click(
      screen.getByRole("button", { name: "Switch to light mode" }),
    );
    expect(html).toHaveClass("light");
    expect(html).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );
    expect(html).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("restores a stored preference", () => {
    localStorage.setItem("theme", "light");
    renderToggle();
    expect(html).toHaveClass("light");
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });

  it("is keyboard operable", async () => {
    const user = userEvent.setup({ delay: null });
    renderToggle();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(html).toHaveClass("light");
    await user.keyboard(" ");
    expect(html).toHaveClass("dark");
  });

  it("runs the switch inside a View Transition anchored on the button", async () => {
    const user = userEvent.setup({ delay: null });
    let update: (() => void) | undefined;
    const startViewTransition = vi.fn((cb: () => void) => {
      update = cb;
      return {} as ViewTransition;
    });
    Object.assign(document, { startViewTransition });
    mockReducedMotion(false);

    renderToggle();
    const button = screen.getByRole("button", { name: "Switch to light mode" });
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 100, y: 10, width: 40, height: 40 }),
    );
    await user.click(button);

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    // Reveal origin = button centre; radius reaches the farthest viewport corner.
    expect(html.style.getPropertyValue("--reveal-x")).toBe("120px");
    expect(html.style.getPropertyValue("--reveal-y")).toBe("30px");
    const radius = Math.hypot(
      Math.max(120, window.innerWidth - 120),
      Math.max(30, window.innerHeight - 30),
    );
    expect(html.style.getPropertyValue("--reveal-r")).toBe(`${radius}px`);

    // The DOM must not change before the browser captures the "old" snapshot…
    expect(html).toHaveClass("dark");
    // …and must be fully committed by the time the update callback returns.
    act(() => update!());
    expect(html).toHaveClass("light");
    expect(html).not.toHaveClass("dark");
  });

  it("skips the View Transition when the user prefers reduced motion", async () => {
    const user = userEvent.setup({ delay: null });
    const startViewTransition = vi.fn();
    Object.assign(document, { startViewTransition });
    mockReducedMotion(true);

    renderToggle();
    await user.click(
      screen.getByRole("button", { name: "Switch to light mode" }),
    );
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(html).toHaveClass("light");
    expect(html.style.getPropertyValue("--reveal-x")).toBe("");
  });

  it("marks both icons decorative", () => {
    renderToggle();
    const icons = screen.getByRole("button").querySelectorAll("svg");
    expect(icons).toHaveLength(2);
    for (const icon of icons)
      expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
