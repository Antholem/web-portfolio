"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import {
  Check,
  LoaderCircle,
  Send,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { sendContactMessage } from "@/app/actions/contact";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CONTACT_LIMITS,
  polishMessage,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/contact";
import { contact } from "@/lib/data";
import { cn } from "@/lib/utils";

type RefineState = "idle" | "refining" | "refined";

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  topic: contact.topics[0].value,
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
    topic: `${id}-topic`,
    message: `${id}-message`,
  };

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [refineState, setRefineState] = useState<RefineState>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [sending, startSending] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const refineTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(refineTimer.current), []);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

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

  // Stand-in for a model call; the delay mirrors real latency so the loading state is exercised.
  function handleRefine() {
    if (!values.message.trim()) return;
    setRefineState("refining");
    clearTimeout(refineTimer.current);
    refineTimer.current = setTimeout(() => {
      setValues((current) => ({
        ...current,
        message: polishMessage(current.message).slice(
          0,
          contact.messageMaxLength,
        ),
      }));
      setRefineState("refined");
    }, 1100);
  }

  function showErrors(nextErrors: ContactFormErrors) {
    setErrors(nextErrors);
    if (nextErrors.name) nameRef.current?.focus();
    else if (nextErrors.email) emailRef.current?.focus();
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
    setSendFailed(false);
    startSending(async () => {
      const result = await sendContactMessage({
        ...values,
        website: honeypotRef.current?.value,
      });
      if (result.ok) setSubmitted(true);
      else if ("errors" in result) showErrors(result.errors);
      else setSendFailed(true);
    });
  }

  function handleReset() {
    clearTimeout(refineTimer.current);
    setValues(INITIAL_VALUES);
    setErrors({});
    setRefineState("idle");
    setSendFailed(false);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex min-h-115 flex-col items-center justify-center gap-4 text-center"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full border border-input">
          <Check size={24} aria-hidden />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="text-[22px] font-semibold tracking-[-0.02em] outline-none"
        >
          {contact.success.title}
        </h3>
        <p className="max-w-[32ch] text-[15px] leading-[1.6] text-muted-foreground">
          {contact.success.description}
        </p>
        <Button type="button" variant="outline" onClick={handleReset}>
          {contact.success.reset}
        </Button>
      </div>
    );
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
        <span
          id={ids.topic}
          className="text-[13px] font-medium text-foreground"
        >
          What can I help with?
        </span>
        <ToggleGroup
          type="single"
          variant="chip"
          aria-labelledby={ids.topic}
          value={values.topic}
          onValueChange={(value) => {
            if (value) setField("topic", value);
          }}
        >
          {contact.topics.map((topic) => (
            <ToggleGroupItem key={topic.value} value={topic.value}>
              {topic.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>

      <Field>
        <Label htmlFor={ids.message}>Message</Label>
        <div
          className={cn(
            "rounded-[10px] border border-input bg-background transition-[border-color,box-shadow] duration-150 ease-[ease] focus-within:border-ring focus-within:ring-3 focus-within:ring-focus-halo",
            errors.message && "border-destructive",
          )}
        >
          <Textarea
            ref={messageRef}
            id={ids.message}
            name="message"
            placeholder={contact.messagePlaceholder}
            maxLength={contact.messageMaxLength}
            value={values.message}
            onChange={(event) => handleMessageChange(event.target.value)}
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

      {sendFailed ? (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-destructive bg-card px-4 py-3.5"
        >
          <TriangleAlert
            size={18}
            className="mt-px shrink-0 text-destructive"
            aria-hidden
          />
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-destructive">
              {contact.failure.title}
            </p>
            <p className="text-[13.5px] leading-[1.55] text-muted-foreground">
              {contact.failure.description}
            </p>
          </div>
        </div>
      ) : null}

      <Button
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
            <Send aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}

export { ContactForm };
