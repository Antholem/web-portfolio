import { readFileSync } from "node:fs";
import net from "node:net";
import tls from "node:tls";

import type { Page, Route } from "@playwright/test";

import config, { E2E_SERVER_ENV } from "../playwright.config";

import { expect, gotoHome, test } from "./fixtures";

type GuardState = {
  runId: string;
  armed: { pid: number; mailTransport: string | null; argv: string }[];
  blocked: { pid: number; via: string; host?: string; port: number }[];
};

const guardState = (): GuardState =>
  JSON.parse(readFileSync(process.env.SMTP_GUARD_FILE!, "utf8"));

/** Fails the test if the server so much as tried to open an SMTP socket. */
function expectNoSmtpAttempts() {
  expect(guardState().blocked).toEqual([]);
}

async function fillValidForm(page: Page, name = "E2E Visitor") {
  const form = page.getByRole("form", { name: "Contact form" });
  await form.getByRole("textbox", { name: "Name" }).fill(name);
  await form
    .getByRole("textbox", { name: "Email" })
    .fill("visitor@example.test");
  await form.getByRole("radio", { name: "Design system" }).click();
  await form
    .getByRole("textbox", { name: "Message" })
    .fill("Automated E2E message — must never be delivered.");
  return form;
}

/** Holds server-action POSTs until `release()` so the pending UI is observable. */
async function holdServerActions(page: Page) {
  const held: Route[] = [];
  let release!: () => void;
  const released = new Promise<void>((r) => (release = r));
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.method() === "POST" && request.headers()["next-action"]) {
      held.push(route);
      await released;
    }
    await route.fallback();
  });
  return { held, release };
}

test.describe("mail safety (no test may ever send real email)", () => {
  test("the web server is configured for the JSON transport with dummy credentials", () => {
    const webServer = Array.isArray(config.webServer)
      ? config.webServer[0]
      : config.webServer!;
    expect(webServer.reuseExistingServer).toBe(false);
    expect(webServer.env).toBe(E2E_SERVER_ENV);
    expect(E2E_SERVER_ENV.MAIL_TRANSPORT).toBe("json");
    for (const key of ["APP_FROM_EMAIL", "APP_TO_EMAIL"] as const) {
      expect(E2E_SERVER_ENV[key]).toMatch(/@example\.test$/);
    }
    expect(E2E_SERVER_ENV.APP_FROM_PASSWORD).toContain("not-a-real");
    expect(E2E_SERVER_ENV.NODE_OPTIONS).toMatch(/--require=.*smtp-guard\.cjs$/);
  });

  test("the SMTP guard is armed in this run's server, in JSON mode", () => {
    const state = guardState();
    expect(state.runId).toBe(process.env.E2E_RUN_ID);
    expect(state.armed.length).toBeGreaterThan(0);
    // The process actually serving the tests is among them.
    expect(state.armed.map((p) => p.argv)).toContainEqual(
      expect.stringMatching(/next[\\/]dist[\\/]bin[\\/]next start$/),
    );
    for (const process of state.armed) {
      expect(process.mailTransport).toBe("json");
    }
    expectNoSmtpAttempts();
  });

  test("the guard really blocks SMTP connections (self-test, no network)", async () => {
    // Arm a private copy in this worker; the connect calls throw synchronously
    // before any socket or DNS lookup is created.
    const savedFile = process.env.SMTP_GUARD_FILE;
    process.env.SMTP_GUARD_FILE = "";
    const original = {
      net: net.connect,
      netCc: net.createConnection,
      tls: tls.connect,
    };
    try {
      await import("./smtp-guard.cjs");
      expect(() => tls.connect({ host: "smtp.gmail.com", port: 465 })).toThrow(
        /E2E SMTP guard: blocked tls.connect to smtp.gmail.com:465/,
      );
      expect(() => net.connect(587, "smtp.example.test")).toThrow(/blocked/);
      expect(() =>
        net.createConnection({ host: "127.0.0.1", port: 25 }),
      ).toThrow(/blocked/);
    } finally {
      net.connect = original.net;
      net.createConnection = original.netCc;
      tls.connect = original.tls;
      process.env.SMTP_GUARD_FILE = savedFile;
    }
  });
});

test.describe("sending a message", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page, "/#contact");
  });

  test.afterEach(() => {
    expectNoSmtpAttempts();
  });

  test("a valid message shows “Message sent” with the heading focused", async ({
    page,
  }) => {
    const form = await fillValidForm(page);
    const action = page.waitForResponse(
      (r) =>
        r.request().method() === "POST" &&
        !!r.request().headers()["next-action"],
    );
    await form.getByRole("button", { name: "Send message" }).click();
    expect((await action).status()).toBe(200);

    const status = page.getByRole("status").filter({ hasText: "Message sent" });
    await expect(status).toBeVisible();
    await expect(status).toContainText(
      "Thanks for reaching out — I’ll get back to you within two business days.",
    );
    await expect(
      page.getByRole("heading", { level: 3, name: "Message sent" }),
    ).toBeFocused();
    await expect(page.getByRole("form", { name: "Contact form" })).toHaveCount(
      0,
    );
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("“Send another” brings back a blank form", async ({ page }) => {
    const form = await fillValidForm(page);
    await form.getByRole("button", { name: "Send message" }).click();
    await page.getByRole("button", { name: "Send another" }).click();

    const fresh = page.getByRole("form", { name: "Contact form" });
    await expect(fresh.getByRole("textbox", { name: "Name" })).toHaveValue("");
    await expect(fresh.getByRole("textbox", { name: "Email" })).toHaveValue("");
    await expect(fresh.getByRole("textbox", { name: "Message" })).toHaveValue(
      "",
    );
    await expect(
      fresh.getByRole("radio", { name: "Full-stack build" }),
    ).toHaveAttribute("aria-checked", "true");
    await expect(fresh.getByRole("alert")).toHaveCount(0);

    // And it can send again.
    await fillValidForm(page, "Second Visitor");
    await fresh.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
  });

  test("the button reads “Sending…”, busy and disabled, while the action is in flight", async ({
    page,
  }) => {
    const { held, release } = await holdServerActions(page);
    const form = await fillValidForm(page);
    await form.getByRole("button", { name: "Send message" }).click();

    const sending = form.getByRole("button", { name: "Sending…" });
    await expect(sending).toBeVisible();
    await expect(sending).toBeDisabled();
    await expect(sending).toHaveAttribute("aria-busy", "true");
    await expect.poll(() => held.length).toBe(1);

    // A second click or Enter while pending must not send twice.
    await sending.click({ force: true });
    await form.getByRole("textbox", { name: "Name" }).press("Enter");
    expect(held.length).toBe(1);

    release();
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
    expect(held.length).toBe(1);
  });

  test.describe("when the network fails", () => {
    test.use({
      allowedProblems: /ERR_INTERNET_DISCONNECTED|Failed to fetch/,
    });

    test("shows the failure alert and keeps the message", async ({ page }) => {
      await page.route("**/*", (route) =>
        route.request().headers()["next-action"]
          ? route.abort("internetdisconnected")
          : route.fallback(),
      );
      const form = await fillValidForm(page);
      await form.getByRole("button", { name: "Send message" }).click();
      await expect(form.getByRole("alert")).toContainText(
        "Couldn’t send your message",
      );
      await expect(form.getByRole("textbox", { name: "Message" })).toHaveValue(
        "Automated E2E message — must never be delivered.",
      );
      await expect(
        form.getByRole("button", { name: "Send message" }),
      ).toBeEnabled();
    });
  });

  test("a filled honeypot still shows success (bots get no signal)", async ({
    page,
  }) => {
    const form = await fillValidForm(page);
    await page
      .locator('input[name="website"]')
      .evaluate((el: HTMLInputElement) => (el.value = "https://spam.example"));
    await expect(page.locator('input[name="website"]')).toBeHidden();
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
  });

  test("keeps the theme-color meta after a send (no metadata re-render)", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    const meta = page.locator('meta[name="theme-color"]');
    await expect(meta).toHaveAttribute("content", "#fafafa");
    const form = await fillValidForm(page);
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
    await expect(meta).toHaveAttribute("content", "#fafafa");
  });
});
