"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { sendContactMessage } from "@/app/actions/contact";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_LIMITS,
  formatWait,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/contact";
import { useTextFormatting } from "@/hooks/use-text-formatting";
import { contact } from "@/lib/data";
import { cn } from "@/lib/utils";

import { MessageToolbar } from "./message-toolbar";

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function ContactForm() {
  const id = useId();
  const ids = {
    name: `${id}-name`,
    email: `${id}-email`,
    subject: `${id}-subject`,
    message: `${id}-message`,
  };

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [sending, startSending] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Set when a send ends on a snackbar. The submit button is still disabled
  // inside the transition (focus() would be ignored), so focus is handed back
  // once it re-enables: a disabled control drops focus to <body>.
  const refocusSubmit = useRef(false);

  useEffect(() => {
    if (sending || !refocusSubmit.current) return;
    refocusSubmit.current = false;
    submitRef.current?.focus();
  }, [sending]);

  function setField<K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      field in current ? { ...current, [field]: undefined } : current,
    );
  }

  function handleMessageChange(message: string) {
    setField("message", message);
  }

  const formatting = useTextFormatting({
    ref: messageRef,
    value: values.message,
    onChange: handleMessageChange,
    maxLength: contact.messageMaxLength,
  });

  function showErrors(nextErrors: ContactFormErrors) {
    setErrors(nextErrors);
    if (nextErrors.name) nameRef.current?.focus();
    else if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.subject) subjectRef.current?.focus();
    else if (nextErrors.message) messageRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const nextErrors = validateContactForm(values);
    if (Object.keys(nextErrors).length > 0) {
      showErrors(nextErrors);
      return;
    }

    setErrors({});
    startSending(async () => {
      let result;
      try {
        result = await sendContactMessage({
          ...values,
          website: honeypotRef.current?.value,
        });
      } catch {
        // Network or server failure: the action call itself rejects. Uncaught,
        // it would escape the transition and replace the page with an error.
        notifyFailure();
        return;
      }
      if (result.ok) {
        clearForm();
        refocusSubmit.current = true;
        toast.success(contact.success.title, {
          description: contact.success.description,
        });
      } else if ("errors" in result) showErrors(result.errors);
      else if (result.error === "rate-limited") {
        refocusSubmit.current = true;
        toast.error(contact.rateLimited.title, {
          description: contact.rateLimited.description(
            formatWait(result.retryAfterSeconds),
          ),
          duration: 8000,
        });
      } else notifyFailure();
    });
  }

  function notifyFailure() {
    refocusSubmit.current = true;
    toast.error(contact.failure.title, {
      description: contact.failure.description,
      duration: 6000,
    });
  }

  function clearForm() {
    setValues(INITIAL_VALUES);
    setErrors({});
  }

  return (
    <form
      noValidate
      aria-label="Contact form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5.5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor={ids.name}>Name</Label>
          <Input
            ref={nameRef}
            id={ids.name}
            name="name"
            placeholder="Your name"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${ids.name}-error` : undefined}
          />
          <FieldError id={`${ids.name}-error`}>{errors.name}</FieldError>
        </Field>
        <Field>
          <Label htmlFor={ids.email}>Email</Label>
          <Input
            ref={emailRef}
            id={ids.email}
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email}
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${ids.email}-error` : undefined}
          />
          <FieldError id={`${ids.email}-error`}>{errors.email}</FieldError>
        </Field>
      </div>

      <Field>
        <Label htmlFor={ids.subject}>Subject</Label>
        <Input
          ref={subjectRef}
          id={ids.subject}
          name="subject"
          placeholder={contact.subjectPlaceholder}
          autoComplete="off"
          maxLength={CONTACT_LIMITS.subject}
          value={values.subject}
          onChange={(event) => setField("subject", event.target.value)}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? `${ids.subject}-error` : undefined}
        />
        <FieldError id={`${ids.subject}-error`}>{errors.subject}</FieldError>
      </Field>

      <Field>
        <Label htmlFor={ids.message}>Message</Label>
        <div
          className={cn(
            "rounded-[10px] border border-input bg-background transition-[border-color,box-shadow] duration-150 ease-[ease] focus-within:border-ring focus-within:ring-3 focus-within:ring-focus-halo",
            errors.message && "border-destructive",
          )}
        >
          <MessageToolbar controls={ids.message} onAction={formatting.format} />
          <Textarea
            ref={messageRef}
            id={ids.message}
            name="message"
            placeholder={contact.messagePlaceholder}
            maxLength={contact.messageMaxLength}
            value={values.message}
            onChange={(event) => handleMessageChange(event.target.value)}
            onKeyDown={formatting.onKeyDown}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? `${ids.message}-error` : undefined
            }
            className="min-h-33"
          />
          <div className="border-t border-border px-3.5 py-2.5 font-mono text-[11px] text-subtle-foreground">
            {values.message.length} / {contact.messageMaxLength}
          </div>
        </div>
        <FieldError id={`${ids.message}-error`}>{errors.message}</FieldError>
      </Field>

      {/* Honeypot: display:none keeps it away from people and assistive tech. */}
      <div hidden>
        <label>
          Website
          <input
            ref={honeypotRef}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Button
        ref={submitRef}
        type="submit"
        size="lg"
        className="w-full"
        disabled={sending}
        aria-busy={sending || undefined}
      >
        {sending ? (
          <>
            <LoaderCircle
              className="animate-spin motion-reduce:animate-none"
              strokeWidth={2}
              aria-hidden
            />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Send aria-hidden className="nudge-diagonal" />
          </>
        )}
      </Button>
    </form>
  );
}

export { ContactForm };
