import { renderToString } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/constants/site";
import { errorPage } from "@/lib/data";

import ErrorPage from "./error";
import GlobalError from "./global-error";

vi.mock("geist/font/sans", () => ({
  GeistSans: { variable: "font-sans-var" },
}));
vi.mock("geist/font/mono", () => ({
  GeistMono: { variable: "font-mono-var" },
}));

const serverError = () =>
  Object.assign(
    new Error("An error occurred in the Server Components render."),
    {
      digest: "2381054837",
    },
  );

function setup(error: unknown) {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const retry = vi.fn();
  const user = userEvent.setup();
  render(<ErrorPage error={error} retry={retry} />);
  return { user, retry };
}

describe("ErrorPage (error.tsx)", () => {
  it("explains the failure under a single h1; the big 500 is decorative", () => {
    setup(serverError());
    expect(
      screen.getByRole("heading", { level: 1, name: errorPage.heading }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(screen.getByText("500")).toHaveAttribute("aria-hidden", "true");
    expect(document.title).toBe(`${errorPage.title} · ${siteConfig.name}`);
  });

  it("retries the failed segment", async () => {
    const { user, retry } = setup(serverError());
    await user.click(screen.getByRole("button", { name: errorPage.retry }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("links home with a full page load and offers an email with the reference", () => {
    setup(serverError());
    expect(screen.getByRole("link", { name: errorPage.home })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: errorPage.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}?subject=${encodeURIComponent("Portfolio error (2381054837)")}`,
    );
  });

  it("shows the server's digest so a report can be matched to the logs", () => {
    setup(serverError());
    expect(
      screen.getByText(`${errorPage.reference}: 2381054837`),
    ).toBeInTheDocument();
  });

  it("never shows the raw error message", () => {
    setup(new Error("SMTP password rejected for user@example.com"));
    expect(document.body).not.toHaveTextContent("SMTP password");
  });

  it.each([
    ["a client Error without a digest", new Error("boom")],
    ["a thrown non-Error value", "boom"],
    ["undefined", undefined],
  ])("copes with %s (no reference line)", (_, error) => {
    setup(error);
    expect(screen.queryByText(new RegExp(errorPage.reference))).toBeNull();
    expect(screen.getByRole("link", { name: errorPage.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}?subject=${encodeURIComponent("Portfolio error")}`,
    );
  });

  it("logs the error for the browser console / monitoring", () => {
    const error = serverError();
    setup(error);
    expect(console.error).toHaveBeenCalledWith(error);
  });
});

describe("GlobalError (global-error.tsx)", () => {
  it("renders its own document with the site fonts and the error state", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToString(
      <GlobalError error={serverError()} retry={() => {}} />,
    );
    expect(html).toMatch(/^<html lang="en"/);
    expect(html).toContain("<body>");
    expect(html).toContain(errorPage.heading);
    expect(html).toContain(`${errorPage.title} · ${siteConfig.name}`);
  });
});
