// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMailEnv } from "./env";

const VARS = ["APP_FROM_EMAIL", "APP_FROM_PASSWORD", "APP_TO_EMAIL"] as const;

describe("getMailEnv", () => {
  beforeEach(() => {
    vi.stubEnv("APP_FROM_EMAIL", "from@example.test");
    vi.stubEnv("APP_FROM_PASSWORD", "app-password");
    vi.stubEnv("APP_TO_EMAIL", "inbox@example.test");
  });

  it("returns the three mail settings", () => {
    expect(getMailEnv()).toEqual({
      fromEmail: "from@example.test",
      fromPassword: "app-password",
      toEmail: "inbox@example.test",
    });
  });

  it.each(VARS)("throws a named error when %s is missing", (name) => {
    vi.stubEnv(name, undefined);
    expect(() => getMailEnv()).toThrow(
      `Missing required environment variable ${name}`,
    );
  });

  it.each(VARS)("treats an empty %s as missing", (name) => {
    vi.stubEnv(name, "");
    expect(() => getMailEnv()).toThrow(
      `Missing required environment variable ${name}`,
    );
  });

  it("reads lazily, so a later fix to the environment is picked up", () => {
    vi.stubEnv("APP_TO_EMAIL", "");
    expect(() => getMailEnv()).toThrow();
    vi.stubEnv("APP_TO_EMAIL", "fixed@example.test");
    expect(getMailEnv().toEmail).toBe("fixed@example.test");
  });
});
