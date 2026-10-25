import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { describe, expect, it, vi } from "vitest";

import { NAV_ITEMS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { footer } from "@/lib/data";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** matchMedia stub that lets a test fire breakpoint `change` events. */
function mockMatchMedia() {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
          listeners.add(cb),
        removeEventListener: (
          _: string,
          cb: (e: MediaQueryListEvent) => void,
        ) => listeners.delete(cb),
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );
  return {
    listeners,
    fire(matches: boolean) {
      act(() => {
        for (const cb of [...listeners]) {
          cb({ matches } as MediaQueryListEvent);
        }
      });
    },
  };
}

function renderHeader() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SiteHeader />
    </ThemeProvider>,
  );
}

const menuButton = () =>
  screen.getByRole("button", { name: /open menu|close menu/i });
const mobileNav = () => screen.queryByRole("navigation", { name: "Mobile" });

describe("SiteHeader", () => {
  // Was QA-03: the aria-label hid the visible text (WCAG 2.5.3 Label in Name).
  it("names the home link by its visible text plus a hidden “home” hint", () => {
    renderHeader();
    // jsdom has no layout, so it joins the flex items without spaces; the
    // exact browser name is asserted end-to-end.
    const home = screen.getByRole("link", {
      name: /^antholem\s*\/ software engineer\s*— home$/,
    });
    // Path + fragment: from another route (the 404) it goes home.
    expect(home).toHaveAttribute("href", "/#top");
    expect(home).not.toHaveAttribute("aria-label");
    expect(home.querySelector(".sr-only")).toHaveTextContent("— home");
    // The logo image is decorative, so it does not pollute the name.
    expect(home.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("renders the primary nav in section order", () => {
    renderHeader();
    const links = within(
      screen.getByRole("navigation", { name: "Primary" }),
    ).getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
      NAV_ITEMS.map((item) => [item.label, item.href]),
    );
  });

  it("has the desktop CTAs: résumé and contact", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(
      within(header).getByRole("link", { name: "Résumé" }),
    ).toHaveAttribute("href", siteConfig.links.resume);
    expect(
      within(header).getByRole("link", { name: "Let’s talk" }),
    ).toHaveAttribute("href", "/#contact");
    expect(
      within(header).getByRole("button", { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });

  it("starts with the mobile menu collapsed", () => {
    renderHeader();
    expect(menuButton()).toHaveAccessibleName("Open menu");
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(menuButton()).not.toHaveAttribute("aria-controls");
    expect(mobileNav()).not.toBeInTheDocument();
  });

  it("opens and closes the menu from the toggle, wiring aria-controls", async () => {
    const user = userEvent.setup({ delay: null });
    mockMatchMedia();
    renderHeader();

    await user.click(menuButton());
    expect(menuButton()).toHaveAccessibleName("Close menu");
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    const nav = mobileNav()!;
    expect(menuButton()).toHaveAttribute("aria-controls", nav.id);

    const links = within(nav).getAllByRole("link");
    expect(
      links.slice(0, NAV_ITEMS.length).map((a) => a.getAttribute("href")),
    ).toEqual(NAV_ITEMS.map((i) => i.href));
    expect(links[0]).toHaveTextContent("About01");

    await user.click(menuButton());
    expect(mobileNav()).not.toBeInTheDocument();
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and stops listening once closed", async () => {
    const user = userEvent.setup({ delay: null });
    const media = mockMatchMedia();
    const removeSpy = vi.spyOn(window, "removeEventListener");
    renderHeader();

    await user.keyboard("{Escape}"); // no-op while closed
    await user.click(menuButton());
    expect(media.listeners.size).toBe(1);
    await user.keyboard("{Escape}");
    expect(mobileNav()).not.toBeInTheDocument();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(media.listeners.size).toBe(0);
  });

  it("ignores keys other than Escape", async () => {
    const user = userEvent.setup({ delay: null });
    mockMatchMedia();
    renderHeader();
    await user.click(menuButton());
    menuButton().blur(); // keys go to <body>, not the toggle button
    await user.keyboard("{Enter}a{ArrowDown}{Tab}");
    expect(mobileNav()).toBeInTheDocument();
  });

  it.each(NAV_ITEMS.map((item) => item.label))(
    "closes after following the %s link",
    async (label) => {
      const user = userEvent.setup({ delay: null });
      mockMatchMedia();
      renderHeader();
      await user.click(menuButton());
      await user.click(
        within(mobileNav()!).getByRole("link", {
          name: new RegExp(`^${label}`),
        }),
      );
      expect(mobileNav()).not.toBeInTheDocument();
    },
  );

  it.each(["Let’s talk", "Résumé"])(
    "closes after following the mobile “%s” CTA",
    async (name) => {
      const user = userEvent.setup({ delay: null });
      mockMatchMedia();
      renderHeader();
      await user.click(menuButton());
      await user.click(within(mobileNav()!).getByRole("link", { name }));
      expect(mobileNav()).not.toBeInTheDocument();
    },
  );

  it("closes when the viewport crosses into the desktop breakpoint", async () => {
    const user = userEvent.setup({ delay: null });
    const media = mockMatchMedia();
    renderHeader();
    await user.click(menuButton());
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 60rem)");

    media.fire(false); // still mobile
    expect(mobileNav()).toBeInTheDocument();
    media.fire(true);
    expect(mobileNav()).not.toBeInTheDocument();
  });

  it("removes its listeners when unmounted while open", async () => {
    const user = userEvent.setup({ delay: null });
    const media = mockMatchMedia();
    const { unmount } = renderHeader();
    await user.click(menuButton());
    unmount();
    expect(media.listeners.size).toBe(0);
  });

  // Was QA-04: focus used to fall to <body>.
  it.each([0, 3, 7])(
    "returns focus to the menu button when Escape closes the menu from menu link #%i",
    async (index) => {
      const user = userEvent.setup({ delay: null });
      mockMatchMedia();
      renderHeader();
      await user.click(menuButton());
      within(mobileNav()!).getAllByRole("link")[index].focus();
      await user.keyboard("{Escape}");
      expect(mobileNav()).not.toBeInTheDocument();
      expect(menuButton()).toHaveFocus();
    },
  );

  it("leaves focus alone when Escape is pressed outside the menu", async () => {
    const user = userEvent.setup({ delay: null });
    mockMatchMedia();
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <SiteHeader />
        <main>
          <input aria-label="Your name" />
        </main>
      </ThemeProvider>,
    );
    await user.click(menuButton());
    const field = screen.getByRole("textbox", { name: "Your name" });
    await user.click(field);
    await user.keyboard("{Escape}");
    expect(field).toHaveFocus();
  });
});

describe("SiteFooter", () => {
  it("links to sections and profiles", () => {
    render(<SiteFooter />);
    const links = within(
      screen.getByRole("navigation", { name: "Footer" }),
    ).getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["About", "/#about"],
      ["Work", "/#work"],
      ["Contact", "/#contact"],
      ["GitHub", siteConfig.links.github],
      ["LinkedIn", siteConfig.links.linkedin],
    ]);
  });

  it("shows the name, tagline, stack credit and a back-to-top link", () => {
    render(<SiteFooter />);
    const footerEl = screen.getByRole("contentinfo");
    expect(footerEl).toHaveTextContent(siteConfig.name);
    expect(footerEl).toHaveTextContent(footer.tagline);
    expect(footerEl).toHaveTextContent(siteConfig.builtWith);
    expect(
      within(footerEl).getByRole("link", { name: "Back to top" }),
    ).toHaveAttribute("href", "#top");
  });

  it("prints the current year in the copyright line", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2031-03-01T00:00:00Z"));
    render(<SiteFooter />);
    expect(
      screen.getByText(`© 2031 ${siteConfig.name}. All rights reserved.`),
    ).toBeInTheDocument();
  });

  it("hides the decorative wordmark from assistive tech", () => {
    render(<SiteFooter />);
    const wordmark = screen.getByText(footer.wordmark, { selector: "div" });
    expect(wordmark).toHaveAttribute("aria-hidden", "true");
  });

  // Was QA-01: the wordmark's glyph box swallowed clicks on the footer nav.
  // Behaviour is covered end-to-end; the utility class is the contract here.
  it("lets pointer events pass through the wordmark", () => {
    render(<SiteFooter />);
    expect(screen.getByText(footer.wordmark, { selector: "div" })).toHaveClass(
      "pointer-events-none",
      "select-none",
    );
  });
});
