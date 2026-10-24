import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { toast } from "sonner";
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

// Snackbars: tests assert what was raised, not Sonner's rendering. Mocked here,
// not per file: with `isolate: false` a component imported by an earlier file
// keeps whatever `sonner` it loaded first, so a file-level mock can arrive late.
// The same reason makes the mock a global singleton: this setup re-runs per
// file, and fresh vi.fn()s would not be the ones those cached modules call.
vi.mock("sonner", async (importOriginal) => {
  const shared = globalThis as typeof globalThis & { __toastMock?: unknown };
  shared.__toastMock ??= Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  });
  return {
    ...(await importOriginal<typeof import("sonner")>()),
    toast: shared.__toastMock,
  };
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
  vi.mocked(toast).mockClear();
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
  // Pure-logic files opt into the faster `node` environment: no DOM to reset.
  if (typeof document === "undefined") return;
  cleanup();
  localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("style");
});
