export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFormErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;

export const CONTACT_LIMITS = {
  name: 100,
  // RFC 5321 caps a forward path at 256 octets, including the angle brackets.
  email: 254,
  subject: 120,
  message: 1000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared by the form and the server action, so both enforce the same rules. */
export function validateContactForm(
  values: ContactFormValues,
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Tell me your name";
  else if (name.length > CONTACT_LIMITS.name)
    errors.name = `Keep your name under ${CONTACT_LIMITS.name} characters`;

  if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email))
    errors.email = "Enter a valid email address";

  if (!subject) errors.subject = "Add a subject";
  else if (subject.length > CONTACT_LIMITS.subject)
    errors.subject = `Keep your subject under ${CONTACT_LIMITS.subject} characters`;

  if (!message) errors.message = "Add a short message";
  else if (message.length > CONTACT_LIMITS.message)
    errors.message = `Keep your message under ${CONTACT_LIMITS.message} characters`;

  return errors;
}

/** "about 20 minutes" / "about 1 hour", rounded up so a retry is never too early. */
export function formatWait(seconds: number) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  if (minutes < 60) return `about ${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  return `about ${hours} hour${hours === 1 ? "" : "s"}`;
}
