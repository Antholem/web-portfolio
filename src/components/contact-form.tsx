'use client';

import { type ChangeEvent, FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

type FormStatus =
  | { state: 'idle'; message: string | null }
  | { state: 'submitting'; message: string | null }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string };

const initialValues: FormValues = {
  name: '',
  email: '',
  message: '',
};

const initialStatus: FormStatus = { state: 'idle', message: null };

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<FormStatus>(initialStatus);

  const handleChange = (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ state: 'submitting', message: 'Sending your message…' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { error?: string } | { success?: boolean };

      if (!response.ok) {
        throw new Error('error' in payload && payload.error ? payload.error : 'Failed to send message.');
      }

      setValues(initialValues);
      setStatus({ state: 'success', message: 'Thanks! Your message has been delivered.' });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Something went wrong while sending your message.';
      setStatus({ state: 'error', message });
    }
  };

  const isSubmitting = status.state === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border border-border bg-background p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={values.name}
          onChange={handleChange('name')}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Juan Dela Cruz"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={handleChange('email')}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          How can I help?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={values.message}
          onChange={handleChange('message')}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Tell me about your project or question."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
          {isSubmitting ? 'Sending…' : 'Send message'}
        </Button>
        {status.message && (
          <p
            className={`text-sm ${
              status.state === 'error'
                ? 'text-destructive'
                : status.state === 'success'
                  ? 'text-emerald-600'
                  : 'text-muted-foreground'
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
