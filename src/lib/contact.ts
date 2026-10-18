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

/**
 * There is no mail backend yet, so the form hands off to the visitor's email
 * client with everything pre-filled. Swap this for a server action when one exists.
 */
export function buildContactMailto(
  values: ContactFormValues,
  topicLabel: string,
) {
  const subject = `${topicLabel} — inquiry from ${values.name.trim()}`;
  const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Local stand-in for the "Refine with AI" action: tidies whitespace,
 * capitalises the first letter and closes the sentence.
 */
export function polishMessage(message: string) {
  const text = message.trim().replace(/\s+/g, " ");
  if (!text) return text;
  const capitalised = text.charAt(0).toUpperCase() + text.slice(1);
  return /[.!?]$/.test(capitalised) ? capitalised : `${capitalised}.`;
}
