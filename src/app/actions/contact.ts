"use server";

import { headers } from "next/headers";

import {
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/contact";
import { sendContactEmail } from "@/server/mail";
import {
  checkRateLimit,
  clientIdFromHeaders,
  CONTACT_RATE_LIMITS,
  storeFromEnv,
} from "@/server/rate-limit";

export type ContactSubmission = ContactFormValues & {
  /** Honeypot: hidden from people, filled in by naive bots. */
  website?: string;
};

export type SendContactResult =
  | { ok: true }
  | { ok: false; errors: ContactFormErrors }
  | { ok: false; error: "send-failed" }
  | { ok: false; error: "rate-limited"; retryAfterSeconds: number };

const asString = (value: unknown) => (typeof value === "string" ? value : "");

export async function sendContactMessage(
  input: ContactSubmission,
): Promise<SendContactResult> {
  // Server actions are public endpoints: never trust the client's shape or checks.
  if (asString(input?.website)) return { ok: true };

  const values: ContactFormValues = {
    name: asString(input?.name).trim(),
    email: asString(input?.email).trim(),
    // One line: it becomes part of the email's Subject header.
    subject: asString(input?.subject).replace(/\s+/g, " ").trim(),
    message: asString(input?.message).trim(),
  };

  const errors = validateContactForm(values);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // Only well-formed messages count, so fixing a typo never uses up a send.
  const limit = await checkRateLimit(
    clientIdFromHeaders(await headers()),
    CONTACT_RATE_LIMITS,
    storeFromEnv(),
  );
  if (!limit.allowed) {
    return {
      ok: false,
      error: "rate-limited",
      retryAfterSeconds: limit.retryAfterSeconds,
    };
  }

  try {
    await sendContactEmail({
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
    });
    return { ok: true };
  } catch (error) {
    console.error("[contact] failed to send message", error);
    return { ok: false, error: "send-failed" };
  }
}
