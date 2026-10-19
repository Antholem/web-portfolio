import { render, screen, within } from "@testing-library/react";
import { Mail } from "lucide-react";
import { describe, expect, it } from "vitest";

import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";

import { CheckList } from "./check-list";
import { Container } from "./container";
import { IconBox } from "./icon-box";
import { AntholemMark, SaMonogram } from "./logo";
import { Section } from "./section";
import { SectionHeader } from "./section-header";
import { StatusDot } from "./status-dot";
import { Tag, TagList } from "./tag";
import { TextLink } from "./text-link";
import { Eyebrow, HighlightedText, Lead, SectionTitle } from "./typography";

describe("HighlightedText", () => {
  function renderText(text: string) {
    const { container } = render(
      <p>
        <HighlightedText text={text} />
      </p>,
    );
    const p = container.querySelector("p")!;
    return {
      p,
      highlighted: [...p.querySelectorAll("span")].map((s) => s.textContent),
    };
  }

  it("wraps **phrases** in a foreground span and strips the markers", () => {
    const { p, highlighted } = renderText(
      "Building **scalable platforms** with a **refined UX**.",
    );
    expect(p).toHaveTextContent(
      "Building scalable platforms with a refined UX.",
    );
    expect(highlighted).toEqual(["scalable platforms", "refined UX"]);
    expect(p.querySelector("span")).toHaveClass("text-foreground");
  });

  it("renders plain text untouched", () => {
    const { p, highlighted } = renderText("No emphasis here.");
    expect(p.textContent).toBe("No emphasis here.");
    expect(highlighted).toEqual([]);
  });

  it("handles a highlight at the very start and end", () => {
    const { p, highlighted } = renderText("**Start** middle **end**");
    expect(p.textContent).toBe("Start middle end");
    expect(highlighted).toEqual(["Start", "end"]);
  });

  it("leaves unbalanced or empty markers as literal text", () => {
    expect(renderText("a **b").p.textContent).toBe("a **b");
    expect(renderText("a **** b").p.textContent).toBe("a **** b");
  });

  it("renders an empty string as nothing", () => {
    expect(renderText("").p.textContent).toBe("");
  });
});

describe("typography", () => {
  it("SectionTitle is an h2, Lead a paragraph, Eyebrow a span", () => {
    render(
      <>
        <SectionTitle>Title</SectionTitle>
        <Lead>Lead copy</Lead>
        <Eyebrow>Eyebrow</Eyebrow>
      </>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lead copy").tagName).toBe("P");
    expect(screen.getByText("Eyebrow").tagName).toBe("SPAN");
  });

  it("merges custom classes", () => {
    render(<SectionTitle className="max-w-[16ch]">T</SectionTitle>);
    expect(screen.getByRole("heading")).toHaveClass("max-w-[16ch]");
  });
});

describe("SectionHeader", () => {
  it("shows '<index> / <label>' with a decorative rule", () => {
    const { container } = render(<SectionHeader index="05" label="Work" />);
    expect(screen.getByText("05 / Work")).toBeInTheDocument();
    expect(container.querySelector("[aria-hidden]")).toBeEmptyDOMElement();
  });
});

describe("Section / Container", () => {
  it("renders a section with its id and a centred container", () => {
    const { container } = render(
      <Section id="about" aria-label="About">
        content
      </Section>,
    );
    const section = screen.getByRole("region", { name: "About" });
    expect(section).toHaveAttribute("id", "about");
    expect(section.firstElementChild).toHaveClass("mx-auto", "max-w-300");
    expect(container).toHaveTextContent("content");
  });

  it("Container composes with asChild", () => {
    render(
      <Container asChild>
        <nav aria-label="Test">x</nav>
      </Container>,
    );
    expect(screen.getByRole("navigation", { name: "Test" })).toHaveClass(
      "mx-auto",
    );
  });
});

describe("Tag / TagList", () => {
  it("renders a list item per tag", () => {
    render(<TagList tags={["React", "Next.js"]} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["React", "Next.js"]);
  });

  it("renders an empty list without crashing", () => {
    render(<TagList tags={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("Tag passes through props", () => {
    render(<Tag title="t">x</Tag>);
    expect(screen.getByText("x")).toHaveAttribute("title", "t");
  });
});

describe("CheckList", () => {
  it("renders items with decorative check icons", () => {
    render(<CheckList items={["One", "Two"]} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["One", "Two"]);
    for (const li of items) {
      expect(li.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
  });
});

describe("IconBox / StatusDot", () => {
  it("IconBox renders a decorative icon", () => {
    const { container } = render(<IconBox icon={Mail} />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("StatusDot is decorative and only pulses on request, honouring reduced motion", () => {
    const { container, rerender } = render(<StatusDot />);
    const dot = () => container.firstElementChild!;
    expect(dot()).toHaveAttribute("aria-hidden", "true");
    expect(dot().className).not.toMatch(/animate-status-pulse/);
    rerender(<StatusDot pulse />);
    expect(dot()).toHaveClass(
      "before:animate-status-pulse",
      "motion-reduce:before:hidden",
    );
  });
});

describe("TextLink", () => {
  it("renders an underlined anchor", () => {
    render(<TextLink href="/x">Docs</TextLink>);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/x");
    expect(link).toHaveClass("underline");
  });
});

describe("logos", () => {
  it("SaMonogram is decorative by default and keeps the 618:521 ratio", () => {
    const { container } = render(<SaMonogram height={30} />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("height", "30");
    expect(img).toHaveAttribute("width", "36");
  });

  it("SaMonogram accepts an accessible name", () => {
    render(<SaMonogram height={40} alt="SA" />);
    expect(screen.getByRole("img", { name: "SA" })).toHaveAttribute(
      "width",
      "47",
    );
  });

  it("AntholemMark is hidden without a title and an img with one", () => {
    const { container, rerender } = render(<AntholemMark />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    rerender(<AntholemMark title="Antholem" />);
    expect(screen.getByRole("img", { name: "Antholem" })).toBeInTheDocument();
  });

  it("brand icons are decorative unless the caller overrides", () => {
    const { container } = render(
      <>
        <GitHubIcon />
        <LinkedInIcon className="size-5" />
      </>,
    );
    const [gh, li] = container.querySelectorAll("svg");
    expect(gh).toHaveAttribute("aria-hidden", "true");
    expect(gh).toHaveAttribute("stroke", "currentColor");
    expect(li).toHaveClass("size-5");

    render(
      <div data-testid="labelled">
        <GitHubIcon aria-hidden={false} aria-label="GitHub" role="img" />
      </div>,
    );
    expect(
      within(screen.getByTestId("labelled")).getByRole("img", {
        name: "GitHub",
      }),
    ).toBeInTheDocument();
  });
});
