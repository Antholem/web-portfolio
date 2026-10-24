"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { LoaderCircle, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { sendContactMessage } from "@/app/actions/contact";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_LIMITS,
  polishMessage,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/contact";
import { useTextFormatting } from "@/hooks/use-text-formatting";
import { contact } from "@/lib/data";
import { cn } from "@/lib/utils";

import { MessageToolbar } from "./message-toolbar";

// Never trim the visitor's words to make room for added punctuation.
const polishWithinLimit = (message: string) => {
  const polished = polishMessage(message);
  return polished.length <= contact.messageMaxLength ? polished : message;
};

type RefineState = "idle" | "refining" | "refined";

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const REFINE_LABELS: Record<RefineState, string> = {
  idle: "Refine with AI",
  refining: "Refining…",
  refined: "Refined",
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
  const [refineState, setRefineState] = useState<RefineState>("idle");
  const [sending, startSending] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const refineTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Set when a send ends on a snackbar. The submit button is still disabled
  // inside the transition (focus() would be ignored), so focus is handed back
  // once it re-enables: a disabled control drops focus to <body>.
  const refocusSubmit = useRef(false);

  useEffect(() => () => clearTimeout(refineTimer.current), []);

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
    clearTimeout(refineTimer.current);
    setRefineState("idle");
    setField("message", message);
  }

  const formatting = useTextFormatting({
    ref: messageRef,
    value: values.message,
    onChange: handleMessageChange,
    maxLength: contact.messageMaxLength,
  });

  // Stand-in for a model call; the delay mirrors real latency so the loading state is exercised.
  function handleRefine() {
    if (!values.message.trim()) return;
    setRefineState("refining");
    clearTimeout(refineTimer.current);
    refineTimer.current = setTimeout(() => {
      setValues((current) => ({
        ...current,
        message: polishWithinLimit(current.message),
      }));
      setRefineState("refined");
    }, 1100);
  }

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
      else notifyFailure();
    });
  }

  // The typed message is kept so the visitor can simply try again.
  function notifyFailure() {
    refocusSubmit.current = true;
    toast.error(contact.failure.title, {
      description: contact.failure.description,
      duration: 6000,
    });
  }

  function clearForm() {
    clearTimeout(refineTimer.current);
    setValues(INITIAL_VALUES);
    setErrors({});
    setRefineState("idle");
  }

  const refining = refineState === "refining";

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
          aria-describedby={
            errors.subject ? `${ids.subject}-error` : undefined
          }
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
          <MessageToolbar
            controls={ids.message}
            disabled={refining}
            onAction={formatting.format}
          />
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
          <div className="flex items-center justify-between gap-2 border-t border-border py-1.5 pr-1.5 pl-3.5">
            <span className="font-mono text-[11px] text-subtle-foreground">
              {values.message.length} / {contact.messageMaxLength}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2.5"
              disabled={refining || !values.message.trim()}
              onClick={handleRefine}
            >
              {refining ? (
                <LoaderCircle
                  className="animate-spin motion-reduce:animate-none"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : (
                <Sparkles aria-hidden />
              )}
              {REFINE_LABELS[refineState]}
            </Button>
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
