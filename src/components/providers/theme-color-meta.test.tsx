import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "next-themes";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_COLORS } from "@/constants/theme";

import { Providers } from "./providers";
import { ThemeColorMeta } from "./theme-color-meta";

/** The single tag Next renders from `viewport.themeColor`. */
function addMeta(content = THEME_COLORS.dark) {
  const meta = document.createElement("meta");
  meta.name = "theme-color";
  meta.content = content;
  document.head.append(meta);
  return meta;
}

function ThemeButtons() {
  const { setTheme } = useTheme();
  return (
    <>
      <button onClick={() => setTheme("light")}>light</button>
      <button onClick={() => setTheme("dark")}>dark</button>
      <button onClick={() => setTheme("system")}>system</button>
    </>
  );
}

function renderWithTheme(defaultTheme = "dark") {
  return render(
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
      <ThemeColorMeta />
      <ThemeButtons />
    </ThemeProvider>,
  );
}

function mockOsScheme(scheme: "light" | "dark") {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: query === `(prefers-color-scheme: ${scheme})`,
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

describe("ThemeColorMeta", () => {
  let meta: HTMLMetaElement;

  beforeEach(() => {
    meta = addMeta();
  });

  afterEach(() => {
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.remove());
  });

  it("renders nothing itself", () => {
    const { container } = renderWithTheme();
    expect(container.querySelector("meta")).toBeNull();
  });

  it("keeps the dark colour for the default dark theme", () => {
    renderWithTheme();
    expect(meta.content).toBe("#0a0a0a");
  });

  it("switches to the light colour for a stored light preference", () => {
    localStorage.setItem("theme", "light");
    meta.content = "#0a0a0a";
    renderWithTheme();
    expect(meta.content).toBe("#fafafa");
  });

  it("follows every theme change", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme();
    await user.click(screen.getByRole("button", { name: "light" }));
    expect(meta.content).toBe(THEME_COLORS.light);
    await user.click(screen.getByRole("button", { name: "dark" }));
    expect(meta.content).toBe(THEME_COLORS.dark);
  });

  it("follows the OS scheme when the theme is “system”, not the stored name", async () => {
    mockOsScheme("light");
    const user = userEvent.setup({ delay: null });
    renderWithTheme();
    await user.click(screen.getByRole("button", { name: "system" }));
    expect(meta.content).toBe(THEME_COLORS.light);
  });

  it("does nothing (and does not throw) when the tag is missing", () => {
    meta.remove();
    expect(() => renderWithTheme()).not.toThrow();
    expect(document.querySelector('meta[name="theme-color"]')).toBeNull();
  });

  it("ignores an unknown resolved theme instead of writing garbage", () => {
    localStorage.setItem("theme", "sepia");
    meta.content = "#123456";
    render(
      <ThemeProvider attribute="class" themes={["light", "dark", "sepia"]}>
        <ThemeColorMeta />
      </ThemeProvider>,
    );
    expect(meta.content).toBe("#123456");
  });

  it("is mounted by the app Providers", async () => {
    localStorage.setItem("theme", "light");
    await act(async () => {
      render(<Providers>content</Providers>);
    });
    expect(meta.content).toBe(THEME_COLORS.light);
  });
});
