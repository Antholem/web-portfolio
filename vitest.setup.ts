import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Tell React this is a test environment so act() works outside RTL helpers too.
(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Testing Library only advances fake timers in its async wrapper when it sees a
// `jest` global; without this, user-event + vi.useFakeTimers() deadlocks.
(globalThis as typeof globalThis & { jest: unknown }).jest = {
  advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
};

// Mail safety net: no unit test can reach a real SMTP server. Real credentials
// never enter the test process (Vitest does not load .env.local into
// process.env, and these are cleared anyway), and nodemailer itself is mocked
// for every file: `mail.test.ts` drives this mock, anything else that reaches
// it gets a rejected send.
for (const key of ["APP_FROM_EMAIL", "APP_FROM_PASSWORD", "APP_TO_EMAIL"]) {
  delete process.env[key];
}
vi.mock("nodemailer", () => {
  const createTransport = vi.fn(() => ({
    sendMail: vi.fn(() =>
      Promise.reject(new Error("nodemailer is mocked in unit tests")),
    ),
  }));
  return { default: { createTransport }, createTransport };
});

// jsdom has no matchMedia; components (header, theme toggle) query it.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

afterEach(() => {
  vi.useRealTimers();
  // Pure-logic files opt into the faster `node` environment: no DOM to reset.
  if (typeof document === "undefined") return;
  cleanup();
  localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("style");
});
