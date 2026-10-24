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

// Ends with . ! ? or …, optionally followed by closing quotes or brackets.
const SENTENCE_END = /[.!?…]["'”’)\]]*$/;

const LIST_LINE = /^(\s*(?:[-*•]|\d{1,3}[.)])\s+)(.*)$/;

const capitalise = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const polishParagraph = (paragraph: string) => {
  const lines = paragraph.split("\n");
  // Lists keep their markers and get no trailing full stop.
  if (lines.every((line) => LIST_LINE.test(line))) {
    return lines
      .map((line) =>
        line.replace(LIST_LINE, (_, marker, item) => marker + capitalise(item)),
      )
      .join("\n");
  }
  const text = capitalise(paragraph);
  return SENTENCE_END.test(text) ? text : `${text}.`;
};

/**
 * Local stand-in for "Refine with AI": tidies spacing inside lines, keeps the
 * visitor's line and paragraph breaks, capitalises and closes each paragraph.
 */
export function polishMessage(message: string) {
  return message
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
        .filter(Boolean)
        .join("\n"),
    )
    .filter(Boolean)
    .map(polishParagraph)
    .join("\n\n");
}
