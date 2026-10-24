// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CONTACT_LIMITS } from "@/lib/contact";
import { sendContactEmail } from "@/server/mail";
import { createMemoryStore, type RateLimitStore } from "@/server/rate-limit";

import { sendContactMessage, type ContactSubmission } from "./contact";

vi.mock("@/server/mail", () => ({ sendContactEmail: vi.fn() }));

// The visitor's IP and the limiter's store, both under the test's control.
const limiter = vi.hoisted(() => ({
  headers: new Headers({ "x-forwarded-for": "203.0.113.1" }),
  store: undefined as RateLimitStore | undefined,
}));
vi.mock("next/headers", () => ({ headers: async () => limiter.headers }));
vi.mock("@/server/rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/rate-limit")>();
  return { ...actual, storeFromEnv: () => limiter.store! };
});

const send = vi.mocked(sendContactEmail);

const valid: ContactSubmission = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Design system audit",
  message: "Let's work together.",
  website: "",
};

describe("sendContactMessage (server action)", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue(undefined);
    limiter.store = createMemoryStore();
    limiter.headers = new Headers({ "x-forwarded-for": "203.0.113.1" });
  });

  it("sends a valid message with its subject and reports success", async () => {
    await expect(sendContactMessage(valid)).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledExactlyOnceWith({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Design system audit",
      message: "Let's work together.",
    });
  });

  it("trims every field before sending", async () => {
    await sendContactMessage({
      ...valid,
      name: "  Jane  ",
      email: " jane@example.com\n",
      subject: "  Hello  ",
      message: "\n  Hi!  \n",
    });
    expect(send).toHaveBeenCalledWith({
      name: "Jane",
      email: "jane@example.com",
      subject: "Hello",
      message: "Hi!",
    });
  });

  // The subject ends up in an email header: no line breaks may get through.
  it("collapses whitespace and line breaks in the subject to single spaces", async () => {
    await sendContactMessage({
      ...valid,
      subject: "Hi\r\nBcc: victim@example.com\t\tthere",
    });
    expect(send.mock.calls[0][0].subject).toBe(
      "Hi Bcc: victim@example.com there",
    );
  });

  it("works without the honeypot field at all", async () => {
    const noHoneypot = { ...valid };
    delete noHoneypot.website;
    await expect(sendContactMessage(noHoneypot)).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
  });

  describe("honeypot", () => {
    it("pretends to succeed but sends nothing when it is filled", async () => {
      await expect(
        sendContactMessage({ ...valid, website: "https://spam.example" }),
      ).resolves.toEqual({ ok: true });
      expect(send).not.toHaveBeenCalled();
    });

    it("short-circuits even when the rest is invalid", async () => {
      await expect(
        sendContactMessage({
          name: "",
          email: "",
          subject: "",
          message: "",
          website: "x",
        }),
      ).resolves.toEqual({ ok: true });
      expect(send).not.toHaveBeenCalled();
    });

    it.each([0, false, null, ["x"], { a: 1 }])(
      "ignores a non-string honeypot (%j)",
      async (website) => {
        await expect(
          sendContactMessage({ ...valid, website } as never),
        ).resolves.toEqual({ ok: true });
        expect(send).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe("untrusted input shape", () => {
    it.each([undefined, null, "a string", 42, []])(
      "rejects a non-object payload (%j) with field errors, without throwing",
      async (input) => {
        const result = await sendContactMessage(input as never);
        expect(result).toEqual({
          ok: false,
          errors: {
            name: "Tell me your name",
            email: "Enter a valid email address",
            subject: "Add a subject",
            message: "Add a short message",
          },
        });
        expect(send).not.toHaveBeenCalled();
      },
    );

    it("coerces non-string fields to empty strings", async () => {
      const result = await sendContactMessage({
        name: 123,
        email: { toString: () => "jane@example.com" },
        subject: ["Hello"],
        message: true,
      } as never);
      expect(result).toEqual({
        ok: false,
        errors: {
          name: "Tell me your name",
          email: "Enter a valid email address",
          subject: "Add a subject",
          message: "Add a short message",
        },
      });
      expect(send).not.toHaveBeenCalled();
    });
  });

  describe("server-side validation", () => {
    it.each([
      [{ name: "   " }, { name: "Tell me your name" }],
      [{ email: "jane@" }, { email: "Enter a valid email address" }],
      [{ subject: " \t " }, { subject: "Add a subject" }],
      [{ message: " \n " }, { message: "Add a short message" }],
      [
        { subject: "s".repeat(CONTACT_LIMITS.subject + 1) },
        { subject: "Keep your subject under 120 characters" },
      ],
      [
        { name: "n".repeat(CONTACT_LIMITS.name + 1) },
        { name: "Keep your name under 100 characters" },
      ],
      [
        { email: `${"e".repeat(CONTACT_LIMITS.email)}@x.io` },
        { email: "Enter a valid email address" },
      ],
      [
        { message: "m".repeat(CONTACT_LIMITS.message + 1) },
        { message: "Keep your message under 1000 characters" },
      ],
    ])("returns field errors for %j", async (override, errors) => {
      await expect(
        sendContactMessage({ ...valid, ...override }),
      ).resolves.toEqual({ ok: false, errors });
      expect(send).not.toHaveBeenCalled();
    });

    it("accepts values exactly at the limits", async () => {
      const local = "e".repeat(CONTACT_LIMITS.email - "@x.io".length);
      await expect(
        sendContactMessage({
          ...valid,
          name: "n".repeat(CONTACT_LIMITS.name),
          email: `${local}@x.io`,
          subject: "s".repeat(CONTACT_LIMITS.subject),
          message: "m".repeat(CONTACT_LIMITS.message),
        }),
      ).resolves.toEqual({ ok: true });
    });

    it("measures limits after trimming", async () => {
      await expect(
        sendContactMessage({
          ...valid,
          name: `  ${"n".repeat(CONTACT_LIMITS.name)}  `,
          message: `\n${"m".repeat(CONTACT_LIMITS.message)}\n`,
        }),
      ).resolves.toEqual({ ok: true });
    });
  });

  describe("rate limiting", () => {
    it("sends 5 messages an hour per visitor, then refuses with the wait", async () => {
      for (let i = 0; i < 5; i++) {
        await expect(sendContactMessage(valid)).resolves.toEqual({ ok: true });
      }
      const result = await sendContactMessage(valid);
      expect(result).toMatchObject({ ok: false, error: "rate-limited" });
      expect(
        (result as { retryAfterSeconds: number }).retryAfterSeconds,
      ).toBeGreaterThan(3500);
      expect(send).toHaveBeenCalledTimes(5);
    });

    it("counts each visitor (by forwarded IP) separately", async () => {
      for (let i = 0; i < 6; i++) await sendContactMessage(valid);
      limiter.headers = new Headers({ "x-forwarded-for": "198.51.100.2" });
      await expect(sendContactMessage(valid)).resolves.toEqual({ ok: true });
    });

    it("does not count invalid submissions or honeypot hits", async () => {
      for (let i = 0; i < 10; i++) {
        await sendContactMessage({ ...valid, email: "nope" });
        await sendContactMessage({ ...valid, website: "spam" });
      }
      await expect(sendContactMessage(valid)).resolves.toEqual({ ok: true });
    });

    it("still sends when the limiter's store is down (fails open)", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      limiter.store = { hit: () => Promise.reject(new Error("down")) };
      await expect(sendContactMessage(valid)).resolves.toEqual({ ok: true });
      expect(send).toHaveBeenCalledOnce();
    });
  });

  describe("send failures", () => {
    it("returns send-failed and logs the error instead of throwing", async () => {
      const error = new Error("SMTP down");
      send.mockRejectedValueOnce(error);
      const log = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(sendContactMessage(valid)).resolves.toEqual({
        ok: false,
        error: "send-failed",
      });
      expect(log).toHaveBeenCalledExactlyOnceWith(
        "[contact] failed to send message",
        error,
      );
    });

    it("handles missing mail configuration the same way", async () => {
      send.mockRejectedValueOnce(
        new Error("Missing required environment variable APP_TO_EMAIL"),
      );
      vi.spyOn(console, "error").mockImplementation(() => {});
      await expect(sendContactMessage(valid)).resolves.toEqual({
        ok: false,
        error: "send-failed",
      });
    });

    it("does not log on success", async () => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      await sendContactMessage(valid);
      expect(log).not.toHaveBeenCalled();
    });
  });
});
