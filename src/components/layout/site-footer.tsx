import { ArrowUp } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SaMonogram } from "@/components/shared/logo";
import { TextLink } from "@/components/shared/text-link";
import { Button } from "@/components/ui/button";
import { FOOTER_SECTION_LINKS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { footer } from "@/lib/data";

const footerLinks = [
  ...FOOTER_SECTION_LINKS,
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
];

function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden border-t border-border render-when-visible">
      <Container className="flex flex-col gap-12 pt-16 pb-8">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-[40ch] flex-col gap-3">
            <span className="flex items-center gap-3.5">
              <SaMonogram height={40} />
              <span className="text-[18px] font-semibold tracking-[-0.02em]">
                {siteConfig.name}
              </span>
            </span>
            <p className="text-[14px] leading-[1.6] text-muted-foreground">
              {footer.tagline}
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-5 gap-y-1 text-[14px]"
          >
            {footerLinks.map((link) => (
              <TextLink
                key={link.label}
                href={link.href}
                className="text-muted-foreground"
              >
                {link.label}
              </TextLink>
            ))}
          </nav>
        </div>

        <div
          aria-hidden
          className="pointer-events-none season-wordmark text-center text-[clamp(76px,18.5vw,248px)] leading-[0.78] font-semibold tracking-[-0.065em] whitespace-nowrap text-outline select-none"
        >
          {footer.wordmark}
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-border pt-6 text-[13px] text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {siteConfig.name}. All rights reserved.
          </span>
          <span className="font-mono text-[12px]">{siteConfig.builtWith}</span>
          <Button asChild variant="ghost" size="sm" className="px-2.5">
            <a href="#top">
              Back to top
              <ArrowUp aria-hidden />
            </a>
          </Button>
        </div>
      </Container>
    </footer>
  );
}

export { SiteFooter };
