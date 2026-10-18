import { siteConfig } from "@/constants/site";

export type ContactFormValues = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type ContactFormErrors = Partial<
  Record<"name" | "email" | "message", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  values: ContactFormValues,
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!values.name.trim()) errors.name = "Tell me your name";
  if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Enter a valid email address";
  if (!values.message.trim()) errors.message = "Add a short message";
  return errors;
}

// No mail backend yet: hand off to the visitor's mail client. Replace with a server action.
export function buildContactMailto(
  values: ContactFormValues,
  topicLabel: string,
) {
  const subject = `${topicLabel} — inquiry from ${values.name.trim()}`;
  const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function polishMessage(message: string) {
  const text = message.trim().replace(/\s+/g, " ");
  if (!text) return text;
  const capitalised = text.charAt(0).toUpperCase() + text.slice(1);
  return /[.!?]$/.test(capitalised) ? capitalised : `${capitalised}.`;
}
