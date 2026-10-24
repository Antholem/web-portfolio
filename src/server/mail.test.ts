// @vitest-environment node
import nodemailer from "nodemailer";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ContactEmail } from "./mail";

// `nodemailer` is mocked for every unit test in vitest.setup.ts; this file
// only programmes that mock. Nothing here can open a socket.
const createTransport = vi.mocked(nodemailer.createTransport);

const email: ContactEmail = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "AI integration",
  message: "Hello there.\n\nSecond paragraph.",
};

function fakeTransport() {
  const sendMail = vi.fn().mockResolvedValue({ messageId: "x" });
  createTransport.mockReturnValue({ sendMail } as never);
  return sendMail;
}

/** Fresh module per test: mail.ts caches its SMTP transport at module level. */
async function loadMail() {
  vi.resetModules();
  return import("./mail");
}

describe("sendContactEmail", () => {
  beforeEach(() => {
    createTransport.mockClear();
    vi.stubEnv("APP_FROM_EMAIL", "from@example.test");
    vi.stubEnv("APP_FROM_PASSWORD", "app-password");
    vi.stubEnv("APP_TO_EMAIL", "inbox@example.test");
    vi.stubEnv("MAIL_TRANSPORT", undefined);
  });

  it("uses Gmail SMTP over implicit TLS with the configured credentials", async () => {
    fakeTransport();
    const { sendContactEmail } = await loadMail();
    await sendContactEmail(email);
    expect(createTransport).toHaveBeenCalledExactlyOnceWith({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: "from@example.test", pass: "app-password" },
    });
  });

  it("creates the SMTP transport once and reuses it", async () => {
    const sendMail = fakeTransport();
    const { sendContactEmail } = await loadMail();
    await sendContactEmail(email);
    await sendContactEmail(email);
    await sendContactEmail(email);
    expect(createTransport).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(3);
  });

  it("rebuilds the transport when the credentials change (e.g. .env edit in dev)", async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: "x" });
    const close = vi.fn();
    createTransport.mockReturnValue({ sendMail, close } as never);
    const { sendContactEmail } = await loadMail();

    await sendContactEmail(email);
    vi.stubEnv("APP_FROM_EMAIL", "new-sender@example.test");
    vi.stubEnv("APP_FROM_PASSWORD", "new-app-password");
    await sendContactEmail(email);

    expect(createTransport).toHaveBeenCalledTimes(2);
    expect(createTransport).toHaveBeenLastCalledWith(
      expect.objectContaining({
        auth: { user: "new-sender@example.test", pass: "new-app-password" },
      }),
    );
    expect(close).toHaveBeenCalledOnce();
  });

  it("switches to nodemailer's JSON transport when MAIL_TRANSPORT=json", async () => {
    vi.stubEnv("MAIL_TRANSPORT", "json");
    fakeTransport();
    const { sendContactEmail } = await loadMail();
    await sendContactEmail(email);
    expect(createTransport).toHaveBeenCalledExactlyOnceWith({
      jsonTransport: true,
    });
    expect(createTransport).not.toHaveBeenCalledWith(
      expect.objectContaining({ host: expect.anything() }),
    );
  });

  it("ignores other MAIL_TRANSPORT values (falls back to SMTP)", async () => {
    vi.stubEnv("MAIL_TRANSPORT", "JSON ");
    fakeTransport();
    const { sendContactEmail } = await loadMail();
    await sendContactEmail(email);
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: "smtp.gmail.com" }),
    );
  });

  it("builds the message: sender, recipient, reply-to, subject and body", async () => {
    const sendMail = fakeTransport();
    const { sendContactEmail } = await loadMail();
    await sendContactEmail(email);
    expect(sendMail).toHaveBeenCalledExactlyOnceWith({
      from: { name: "Portfolio contact form", address: "from@example.test" },
      to: "inbox@example.test",
      replyTo: { name: "Jane Doe", address: "jane@example.com" },
      subject: "New inquiry from Jane Doe — AI integration",
      text: expect.stringContaining("From:      Jane Doe <jane@example.com>"),
      html: expect.stringContaining("New message from Jane Doe"),
    });
  });

  it.each([
    ["Jane\r\nBcc: evil@example.com", "Jane Bcc: evil@example.com"],
    ["Jane\nDoe", "Jane Doe"],
    ["Jane\r\rDoe", "Jane Doe"],
    ["  Jane  \n", "Jane"],
  ])(
    "strips CR/LF from the name (%j) in the subject, reply-to and body",
    async (name, clean) => {
      const sendMail = fakeTransport();
      const { sendContactEmail } = await loadMail();
      await sendContactEmail({ ...email, name });
      const message = sendMail.mock.calls[0][0];
      expect(message.subject).toBe(
        `New inquiry from ${clean} — AI integration`,
      );
      expect(message.replyTo.name).toBe(clean);
      expect(message.text).toContain(`From:      ${clean} <jane@example.com>`);
      expect(message.subject).not.toMatch(/[\r\n]/);
    },
  );

  it("keeps the visitor's subject on one line and escapes it in the HTML", async () => {
    const sendMail = fakeTransport();
    const { sendContactEmail } = await loadMail();
    await sendContactEmail({
      ...email,
      subject: "<b>Rates</b>\r\nBcc: evil@example.com",
    });
    const message = sendMail.mock.calls[0][0];
    expect(message.subject).toBe(
      "New inquiry from Jane Doe — <b>Rates</b> Bcc: evil@example.com",
    );
    expect(message.text).toContain(
      "Subject:   <b>Rates</b> Bcc: evil@example.com",
    );
    expect(message.html).toContain("&lt;b&gt;Rates&lt;/b&gt;");
    expect(message.html).not.toContain("<b>Rates");
  });

  it("keeps the visitor's line breaks in the body", async () => {
    const sendMail = fakeTransport();
    const { sendContactEmail } = await loadMail();
    await sendContactEmail({ ...email, message: "a\nb\n\nc" });
    expect(sendMail.mock.calls[0][0].text).toContain(
      "Message\n-------\na\nb\n\nc\n\n—\n",
    );
  });

  it("fails before touching the transport when configuration is missing", async () => {
    vi.stubEnv("APP_FROM_PASSWORD", undefined);
    fakeTransport();
    const { sendContactEmail } = await loadMail();
    await expect(sendContactEmail(email)).rejects.toThrow(
      "Missing required environment variable APP_FROM_PASSWORD",
    );
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("propagates transport errors to the caller", async () => {
    const sendMail = fakeTransport();
    sendMail.mockRejectedValueOnce(new Error("535 auth failed"));
    const { sendContactEmail } = await loadMail();
    await expect(sendContactEmail(email)).rejects.toThrow("535 auth failed");
  });
});
