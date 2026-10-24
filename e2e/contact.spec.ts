import { expect, gotoHome, snackbar, test } from "./fixtures";

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
    const subject = form.getByRole("textbox", { name: "Subject" });
    const message = form.getByRole("textbox", { name: "Message" });
    const send = form.getByRole("button", { name: "Send message" });

    await send.click();
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Tell me your name");
    await expect(email).toHaveAccessibleDescription(
      "Enter a valid email address",
    );
    await expect(subject).toHaveAccessibleDescription("Add a subject");
    await expect(message).toHaveAccessibleDescription("Add a short message");

    await name.fill("Jane Doe");
    await expect(name).not.toHaveAttribute("aria-invalid");
    await email.fill("jane@invalid");
    await send.click();
    await expect(email).toBeFocused();

    await email.fill("jane@example.com");
    await expect(email).not.toHaveAttribute("aria-invalid");
    await send.click();
    await expect(subject).toBeFocused();

    await subject.fill("Platform rebuild");
    await expect(subject).not.toHaveAttribute("aria-invalid");
    await send.click();
    await expect(message).toBeFocused();
    await expect(message).toHaveAttribute("aria-invalid", "true");
    await expect(name).not.toHaveAttribute("aria-invalid");
    await expect(email).not.toHaveAttribute("aria-invalid");
  });

  test("the subject is a free-text field, capped at 120 characters", async ({
    page,
  }) => {
    const form = page.getByRole("form", { name: "Contact form" });
    await expect(form.getByRole("radiogroup")).toHaveCount(0);
    const subject = form.getByRole("textbox", { name: "Subject" });
    await expect(subject).toHaveAttribute(
      "placeholder",
      "e.g. Full-stack build for a SaaS dashboard",
    );
    await subject.pressSequentially("s".repeat(125));
    await expect(subject).toHaveValue("s".repeat(120));
  });

  test("the message counter tracks what is typed", async ({ page }) => {
    const form = page.getByRole("form", { name: "Contact form" });
    const text = "We need a support copilot.\nCan we talk?";
    await form.getByRole("textbox", { name: "Message" }).fill(text);
    await expect(form.getByText(`${text.length} / 1000`)).toBeVisible();
  });

  test("has no AI refine button", async ({ page }) => {
    const form = page.getByRole("form", { name: "Contact form" });
    await expect(form.getByRole("button", { name: /refine/i })).toHaveCount(0);
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
    await expect(snackbar(page, "Email copied to clipboard")).toBeVisible();
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
