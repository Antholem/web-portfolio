// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CONTACT_LIMITS } from "@/lib/contact";
import { contact } from "@/lib/data";
import { sendContactEmail } from "@/server/mail";

import { sendContactMessage, type ContactSubmission } from "./contact";

vi.mock("@/server/mail", () => ({ sendContactEmail: vi.fn() }));

const send = vi.mocked(sendContactEmail);

const valid: ContactSubmission = {
  name: "Jane Doe",
  email: "jane@example.com",
  topic: "consulting",
  message: "Let's work together.",
  website: "",
};

describe("sendContactMessage (server action)", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue(undefined);
  });

  it("sends a valid message with the topic's label and reports success", async () => {
    await expect(sendContactMessage(valid)).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledExactlyOnceWith({
      name: "Jane Doe",
      email: "jane@example.com",
      topicLabel: "Consulting",
      message: "Let's work together.",
    });
  });

  it.each(contact.topics)("maps topic $value to “$label”", async (topic) => {
    await sendContactMessage({ ...valid, topic: topic.value });
    expect(send.mock.calls[0][0].topicLabel).toBe(topic.label);
  });

  it("trims name, email and message before sending", async () => {
    await sendContactMessage({
      ...valid,
      name: "  Jane  ",
      email: " jane@example.com\n",
      message: "\n  Hi!  \n",
    });
    expect(send).toHaveBeenCalledWith({
      name: "Jane",
      email: "jane@example.com",
      topicLabel: "Consulting",
      message: "Hi!",
    });
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
          topic: "",
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
        topic: ["consulting"],
        message: true,
      } as never);
      expect(result).toEqual({
        ok: false,
        errors: {
          name: "Tell me your name",
          email: "Enter a valid email address",
          message: "Add a short message",
        },
      });
      expect(send).not.toHaveBeenCalled();
    });

    it("rejects a non-string topic as an invalid topic", async () => {
      await expect(
        sendContactMessage({ ...valid, topic: 1 } as never),
      ).resolves.toEqual({ ok: false, error: "invalid-topic" });
      expect(send).not.toHaveBeenCalled();
    });
  });

  describe("server-side validation", () => {
    it.each([
      [{ name: "   " }, { name: "Tell me your name" }],
      [{ email: "jane@" }, { email: "Enter a valid email address" }],
      [{ message: " \n " }, { message: "Add a short message" }],
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

    it.each(["", "Consulting", "other", "CONSULTING", "__proto__"])(
      "rejects unknown topic %j",
      async (topic) => {
        await expect(sendContactMessage({ ...valid, topic })).resolves.toEqual({
          ok: false,
          error: "invalid-topic",
        });
        expect(send).not.toHaveBeenCalled();
      },
    );

    it("reports field errors before checking the topic", async () => {
      await expect(
        sendContactMessage({ ...valid, name: "", topic: "nope" }),
      ).resolves.toEqual({ ok: false, errors: { name: "Tell me your name" } });
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
