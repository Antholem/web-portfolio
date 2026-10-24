import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/constants/site";
import { contact } from "@/lib/data";

import { ContactSection } from "./contact-section";
import { CopyEmailButton } from "./copy-email-button";

// `sonner` is mocked for every unit test in vitest.setup.ts.
const toastMock = vi.mocked(toast);

function setupClipboard(writeText: (text: string) => Promise<void>) {
  // user-event installs its own clipboard stub in setup(); replace it afterwards.
  const user = userEvent.setup({ delay: null });
  const spy = vi.fn(writeText);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: spy },
  });
  return { user, writeText: spy };
}

describe("CopyEmailButton", () => {
  beforeEach(() => {
    toastMock.success.mockClear();
    toastMock.error.mockClear();
  });

  it("copies the address and confirms it with a snackbar", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const { user, writeText } = setupClipboard(() => Promise.resolve());
    render(<CopyEmailButton email="me@example.com" />);

    await user.click(
      screen.getByRole("button", { name: "Copy email address" }),
    );
    expect(writeText).toHaveBeenCalledExactlyOnceWith("me@example.com");
    expect(
      await screen.findByRole("button", { name: "Email copied" }),
    ).toBeInTheDocument();
    expect(toastMock.success).toHaveBeenCalledExactlyOnceWith(
      "Email copied to clipboard",
    );
    expect(toastMock.error).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1600));
    expect(
      screen.getByRole("button", { name: "Copy email address" }),
    ).toBeInTheDocument();
  });

  // Was QA-07: a failed copy used to be silent.
  it("tells the visitor when copying failed, then returns to idle", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const { user } = setupClipboard(() => Promise.reject(new Error("denied")));
    render(<CopyEmailButton email="me@example.com" />);
    await user.click(
      screen.getByRole("button", { name: "Copy email address" }),
    );

    const button = await screen.findByRole("button", {
      name: "Couldn’t copy email address",
    });
    expect(toastMock.error).toHaveBeenCalledExactlyOnceWith(
      "Couldn’t copy email address",
      { description: "Select the address and copy it instead." },
    );
    expect(toastMock.success).not.toHaveBeenCalled();
    // Destructive alert icon, decorative to assistive tech.
    const icon = button.querySelector("svg")!;
    expect(icon).toHaveClass("lucide-circle-alert", "text-destructive");
    expect(icon).toHaveAttribute("aria-hidden", "true");

    act(() => vi.advanceTimersByTime(1600));
    expect(
      screen.getByRole("button", { name: "Copy email address" }),
    ).toBeInTheDocument();
  });

  it("recovers from a failure on the next successful copy", async () => {
    let fail = true;
    const { user } = setupClipboard(() =>
      fail ? Promise.reject(new Error("denied")) : Promise.resolve(),
    );
    render(<CopyEmailButton email="me@example.com" />);
    await user.click(screen.getByRole("button"));
    await screen.findByRole("button", { name: "Couldn’t copy email address" });
    fail = false;
    await user.click(screen.getByRole("button"));
    expect(
      await screen.findByRole("button", { name: "Email copied" }),
    ).toBeInTheDocument();
    expect(toastMock.error).toHaveBeenCalledTimes(1);
    expect(toastMock.success).toHaveBeenCalledExactlyOnceWith(
      "Email copied to clipboard",
    );
  });
});

describe("ContactSection", () => {
  it("renders the heading, lead and direct contact details", () => {
    render(<ContactSection />);
    const section = document.getElementById("contact")!;
    expect(section.tagName).toBe("SECTION");
    expect(
      within(section).getByRole("heading", { level: 2, name: contact.title }),
    ).toBeInTheDocument();
    expect(section).toHaveTextContent("06 / Contact");
    expect(section).toHaveTextContent(contact.lead);

    expect(
      within(section).getByRole("link", { name: siteConfig.email }),
    ).toHaveAttribute("href", `mailto:${siteConfig.email}`);
    expect(
      within(section).getByRole("link", { name: siteConfig.phone.display }),
    ).toHaveAttribute("href", siteConfig.phone.href);
    expect(section).toHaveTextContent(siteConfig.location.full);
    expect(
      within(section).getByRole("button", { name: "Copy email address" }),
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("form", { name: "Contact form" }),
    ).toBeInTheDocument();
  });
});
