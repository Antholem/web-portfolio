"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SaMonogram } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS, SECTIONS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ID = "mobile-nav";

const navLinkClass =
  "rounded-lg px-3 py-2 text-[14px] text-muted-foreground transition-[color,background-color] duration-150 ease-[ease] hover:bg-accent hover:text-foreground";

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const desktop = window.matchMedia("(min-width: 60rem)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpointChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-nav backdrop-blur-[14px] backdrop-saturate-160">
      <Container className="flex h-17 items-center justify-between gap-4">
        {/* `#top` scrolls to the top of the document (HTML spec), no element needed. */}
        <a
          href="#top"
          aria-label={`${siteConfig.name} — home`}
          className="flex items-center gap-2.5"
        >
          <SaMonogram height={30} />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">
            {siteConfig.handle}
          </span>
          <span className="hidden font-mono text-[12px] text-subtle-foreground md:inline">
            / {siteConfig.role.toLowerCase()}
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            <a href={siteConfig.links.resume}>
              <Download aria-hidden />
              Résumé
            </a>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href={`#${SECTIONS.contact.id}`}>Let’s talk</a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? MOBILE_NAV_ID : undefined}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </Container>

      {menuOpen ? (
        <Container asChild>
          <nav
            id={MOBILE_NAV_ID}
            aria-label="Mobile"
            className="flex flex-col gap-1 border-t border-border pt-2 pb-5 md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  navLinkClass,
                  "flex justify-between px-1 py-3.5 text-[17px]",
                )}
              >
                {item.label}
                <span className="font-mono text-[12px] text-subtle-foreground">
                  {item.index}
                </span>
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <Button asChild variant="outline">
                <a href={siteConfig.links.resume}>Résumé</a>
              </Button>
              <Button asChild>
                <a href={`#${SECTIONS.contact.id}`} onClick={closeMenu}>
                  Let’s talk
                </a>
              </Button>
            </div>
          </nav>
        </Container>
      ) : null}
    </header>
  );
}

export { SiteHeader };
