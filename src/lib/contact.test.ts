// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  CONTACT_LIMITS,
  polishMessage,
  validateContactForm,
  type ContactFormValues,
} from "./contact";

const valid: ContactFormValues = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "New SaaS dashboard",
  message: "Hello there",
};

describe("validateContactForm", () => {
  it("returns no errors for a complete, valid form", () => {
    expect(validateContactForm(valid)).toEqual({});
  });

  it("reports every missing field at once with user-facing copy", () => {
    expect(
      validateContactForm({ name: "", email: "", subject: "", message: "" }),
    ).toEqual({
      name: "Tell me your name",
      email: "Enter a valid email address",
      subject: "Add a subject",
      message: "Add a short message",
    });
  });

  it.each([" ", "\t", "\n  \n"])(
    "treats whitespace-only name/message (%j) as empty",
    (blank) => {
      const errors = validateContactForm({
        ...valid,
        name: blank,
        message: blank,
      });
      expect(errors.name).toBeDefined();
      expect(errors.message).toBeDefined();
      expect(errors.email).toBeUndefined();
    },
  );

  it.each([
    "jane@example.com",
    "j.doe+tag@sub.example.co.uk",
    "  jane@example.com  ",
    "x@y.z",
    "ñame@dominio.es",
  ])("accepts %j", (email) => {
    expect(validateContactForm({ ...valid, email }).email).toBeUndefined();
  });

  it.each([
    "",
    "jane",
    "jane@",
    "jane@example",
    "@example.com",
    "jane@.com",
    "jane@example.",
    "jane doe@example.com",
    "jane@@example.com",
    "jane@exa mple.com",
  ])("rejects %j", (email) => {
    expect(validateContactForm({ ...valid, email }).email).toBe(
      "Enter a valid email address",
    );
  });

  describe("length limits", () => {
    it("exposes the limits shared by the form and the server action", () => {
      expect(CONTACT_LIMITS).toEqual({
        name: 100,
        email: 254,
        subject: 120,
        message: 1000,
      });
    });

    it("accepts a name and message exactly at the limit", () => {
      expect(
        validateContactForm({
          ...valid,
          name: "n".repeat(CONTACT_LIMITS.name),
          message: "m".repeat(CONTACT_LIMITS.message),
        }),
      ).toEqual({});
    });

    it("rejects a name one character over the limit", () => {
      expect(
        validateContactForm({ ...valid, name: "n".repeat(101) }).name,
      ).toBe("Keep your name under 100 characters");
    });

    it("rejects a message one character over the limit", () => {
      expect(
        validateContactForm({ ...valid, message: "m".repeat(1001) }).message,
      ).toBe("Keep your message under 1000 characters");
    });

    it("accepts an email of exactly 254 characters and rejects 255", () => {
      const at254 = `${"e".repeat(254 - "@x.io".length)}@x.io`;
      expect(at254).toHaveLength(254);
      expect(
        validateContactForm({ ...valid, email: at254 }).email,
      ).toBeUndefined();
      expect(validateContactForm({ ...valid, email: `e${at254}` }).email).toBe(
        "Enter a valid email address",
      );
    });

    it("measures length after trimming surrounding whitespace", () => {
      expect(
        validateContactForm({
          ...valid,
          name: `   ${"n".repeat(100)}   `,
          email: ` ${"e".repeat(249)}@x.io `,
          message: `\n${"m".repeat(1000)}\n`,
        }),
      ).toEqual({});
    });

    it("reports a blank name as missing, not as too long", () => {
      expect(validateContactForm({ ...valid, name: " " }).name).toBe(
        "Tell me your name",
      );
    });
  });

  describe("subject", () => {
    it("is required (whitespace does not count)", () => {
      expect(validateContactForm({ ...valid, subject: " \t " })).toEqual({
        subject: "Add a subject",
      });
    });

    it("accepts exactly the limit after trimming and rejects one more", () => {
      const max = "s".repeat(CONTACT_LIMITS.subject);
      expect(validateContactForm({ ...valid, subject: ` ${max} ` })).toEqual(
        {},
      );
      expect(validateContactForm({ ...valid, subject: `${max}s` })).toEqual({
        subject: "Keep your subject under 120 characters",
      });
    });
  });

  it("does not mutate its input", () => {
    const input = { ...valid, name: "  Jane  " };
    const snapshot = { ...input };
    validateContactForm(input);
    expect(input).toEqual(snapshot);
  });
});

describe("polishMessage", () => {
  it.each([
    ["hello world", "Hello world."],
    ["Hello world.", "Hello world."],
    ["is this possible?", "Is this possible?"],
    ["let's go!", "Let's go!"],
    ["  spaced   out\ttext  ", "Spaced out text."],
    ["élan", "Élan."],
    ["3 things to discuss", "3 things to discuss."],
    ["a", "A."],
  ])("polishes %j to %j", (input, expected) => {
    expect(polishMessage(input)).toBe(expected);
  });

  it.each(["", "   ", "\n\t"])("returns an empty string for %j", (input) => {
    expect(polishMessage(input)).toBe("");
  });

  it("is idempotent", () => {
    const once = polishMessage("  some   message without punctuation ");
    expect(polishMessage(once)).toBe(once);
  });

  // Was QA-06: paragraphs used to be flattened into one line.
  it("keeps the visitor's paragraph breaks, closing each paragraph", () => {
    expect(polishMessage("first paragraph.\n\nsecond paragraph")).toBe(
      "First paragraph.\n\nSecond paragraph.",
    );
  });

  it("keeps single line breaks inside a paragraph", () => {
    expect(polishMessage("dear sam,\nwe need help\nsoon")).toBe(
      "Dear sam,\nwe need help\nsoon.",
    );
  });

  it("collapses runs of blank and whitespace-only lines to one paragraph break", () => {
    expect(polishMessage("one\n\n\n  \t \n\ntwo")).toBe("One.\n\nTwo.");
  });

  it("normalises Windows and old-Mac line endings", () => {
    expect(polishMessage("one\r\n\r\ntwo\rthree")).toBe("One.\n\nTwo\nthree.");
  });

  it("tidies spacing inside lines without joining them", () => {
    expect(polishMessage("  a   b \t c  \n   d   ")).toBe("A b c\nd.");
  });

  // Was QA-09: a period used to be appended after "…" and closing quotes.
  it.each([
    ["more soon…", "More soon…"],
    ['they said "ship it."', 'They said "ship it."'],
    ["they said “ship it!”", "They said “ship it!”"],
    ["(see the brief.)", "(see the brief.)"],
    ["is it 'done?'", "Is it 'done?'"],
    ["list [a, b.]", "List [a, b.]"],
  ])("treats %j as already finished", (input, expected) => {
    expect(polishMessage(input)).toBe(expected);
  });

  it.each([
    ['a quote "unfinished"', 'A quote "unfinished".'],
    ["(aside)", "(aside)."],
  ])("still closes %j", (input, expected) => {
    expect(polishMessage(input)).toBe(expected);
  });

  it("is idempotent on multi-paragraph text", () => {
    const once = polishMessage("hi there\n\n  how are   you\nall good…");
    expect(polishMessage(once)).toBe(once);
  });
});
