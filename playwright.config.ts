import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { defineConfig } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

// Shared by the runner, its workers (inherited env) and the web server, so the
// tests can check the server they talk to was started by *this* run.
process.env.E2E_RUN_ID ??= `${Date.now()}-${process.pid}`;
process.env.SMTP_GUARD_FILE ??= join(
  tmpdir(),
  "web-portfolio-e2e-smtp-guard.json",
);

/**
 * The E2E server must never send real mail:
 *  1. MAIL_TRANSPORT=json makes nodemailer build messages without sending.
 *  2. Dummy credentials override anything in .env.local (Next never
 *     overwrites variables already set in the process environment).
 *  3. A preloaded guard (e2e/smtp-guard.cjs) throws on any SMTP connection.
 *  4. reuseExistingServer is off, so a stale server without 1–3 is never used.
 */
export const E2E_SERVER_ENV = {
  MAIL_TRANSPORT: "json",
  APP_FROM_EMAIL: "e2e-sender@example.test",
  APP_FROM_PASSWORD: "e2e-not-a-real-password",
  APP_TO_EMAIL: "e2e-inbox@example.test",
  // Blank Redis settings: the rate limiter uses its in-memory store, which
  // starts empty with each run's server (never a real shared counter).
  UPSTASH_REDIS_REST_URL: "",
  UPSTASH_REDIS_REST_TOKEN: "",
  KV_REST_API_URL: "",
  KV_REST_API_TOKEN: "",
  NODE_OPTIONS: `--require=${resolve("e2e/smtp-guard.cjs").replaceAll("\\", "/")}`,
  E2E_RUN_ID: process.env.E2E_RUN_ID,
  SMTP_GUARD_FILE: process.env.SMTP_GUARD_FILE,
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    // System Chrome: no Playwright browser download needed.
    channel: "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  // Production build on 3100 so it never collides with `next dev` on 3000.
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    timeout: 240_000,
    reuseExistingServer: false,
    env: E2E_SERVER_ENV,
    stdout: "ignore",
    stderr: "pipe",
  },
});
