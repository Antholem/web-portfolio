import { expect, gotoHome, test } from "./fixtures";

// Sending (success, pending, reset) lives in mail.spec.ts.

const EMAIL = "antholemlemmanalo@gmail.com";

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page, "/#contact");
  });

  test("validates fields, focuses the first error and clears errors on edit", async ({
    page,
  }) => {
    const form = page.getByRole("form", { name: "Contact form" });
    const name = form.getByRole("textbox", { name: "Name" });
    const email = form.getByRole("textbox", { name: "Email" });
    const message = form.getByRole("textbox", { name: "Message" });
    const send = form.getByRole("button", { name: "Send message" });

    await send.click();
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Tell me your name");
    await expect(email).toHaveAccessibleDescription(
      "Enter a valid email address",
    );
    await expect(message).toHaveAccessibleDescription("Add a short message");

    await name.fill("Jane Doe");
    await expect(name).not.toHaveAttribute("aria-invalid");
    await email.fill("jane@invalid");
    await send.click();
    await expect(email).toBeFocused();

    await email.fill("jane@example.com");
    await expect(email).not.toHaveAttribute("aria-invalid");
    await send.click();
    await expect(message).toBeFocused();
    await expect(message).toHaveAttribute("aria-invalid", "true");
    await expect(name).not.toHaveAttribute("aria-invalid");
    await expect(email).not.toHaveAttribute("aria-invalid");
  });

  test("topic chips select exactly one topic and never clear", async ({
    page,
  }) => {
    const form = page.getByRole("form", { name: "Contact form" });
    const topics = form.getByRole("radiogroup", {
      name: "What can I help with?",
    });
    const first = topics.getByRole("radio", { name: "Full-stack build" });
    const ai = topics.getByRole("radio", { name: "AI integration" });
    await expect(first).toHaveAttribute("aria-checked", "true");
    await ai.click();
    await expect(ai).toHaveAttribute("aria-checked", "true");
    await expect(first).toHaveAttribute("aria-checked", "false");
    await ai.click();
    await expect(ai).toHaveAttribute("aria-checked", "true");
    await expect(topics.locator('[aria-checked="true"]')).toHaveCount(1);
  });

  test("the message counter tracks what is typed", async ({ page }) => {
    const form = page.getByRole("form", { name: "Contact form" });
    const text = "We need a support copilot.\nCan we talk?";
    await form.getByRole("textbox", { name: "Message" }).fill(text);
    await expect(form.getByText(`${text.length} / 1000`)).toBeVisible();
  });

  test("refine polishes the draft after its loading state", async ({
    page,
  }) => {
    // The clock must be installed before the page's scripts run.
    await page.clock.install();
    await gotoHome(page, "/#contact");
    const form = page.getByRole("form", { name: "Contact form" });
    const message = form.getByRole("textbox", { name: "Message" });
    const refine = form.getByRole("button", { name: "Refine with AI" });

    await expect(refine).toBeDisabled();
    await message.fill("  hello   there  ");
    // Freeze time so the 1.1s stand-in latency is fully under test control.
    await page.clock.pauseAt(Date.now() + 60_000);
    await refine.click();
    const refining = form.getByRole("button", { name: "Refining…" });
    await expect(refining).toBeDisabled();

    await page.clock.runFor(1099);
    await expect(message).toHaveValue("  hello   there  ");
    await expect(refining).toBeVisible();
    await page.clock.runFor(1);
    await expect(message).toHaveValue("Hello there.");
    await expect(form.getByRole("button", { name: "Refined" })).toBeEnabled();
  });

  test("the message is capped at 1000 characters", async ({ page }) => {
    const message = page.getByRole("textbox", { name: "Message" });
    await message.fill("x".repeat(999));
    await message.press("End");
    await message.pressSequentially("yz");
    await expect(message).toHaveValue(`${"x".repeat(999)}y`);
    await expect(page.getByText("1000 / 1000")).toBeVisible();
  });

  test("copy email puts the address on the clipboard", async ({
    page,
    context,
    baseURL,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: baseURL,
    });
    const copy = page.getByRole("button", { name: "Copy email address" });
    await copy.click();
    await expect(
      page.getByRole("button", { name: "Email copied" }),
    ).toBeVisible();
    await expect(page.getByText("Email copied to clipboard")).toBeAttached();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      EMAIL,
    );
    // Resets on its own.
    await expect(
      page.getByRole("button", { name: "Copy email address" }),
    ).toBeVisible();
  });

  test("direct contact links point at the configured email and phone", async ({
    page,
  }) => {
    const section = page.locator("#contact");
    await expect(section.getByRole("link", { name: EMAIL })).toHaveAttribute(
      "href",
      `mailto:${EMAIL}`,
    );
    await expect(
      section.getByRole("link", { name: "+63 977 333 6944" }),
    ).toHaveAttribute("href", "tel:+639773336944");
  });
});
