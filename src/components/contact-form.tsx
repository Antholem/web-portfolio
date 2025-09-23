'use client';

import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Redo2, Undo2 } from 'lucide-react';
import { type ChangeEvent, FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormValues {
  name: string;
  email: string;
}

type FormStatus =
  | { state: 'idle'; message: string | null }
  | { state: 'submitting'; message: string | null }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string };

const initialValues: FormValues = {
  name: '',
  email: '',
};

const initialStatus: FormStatus = { state: 'idle', message: null };

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'Tell me about your project or question.',
      }),
    ],
    editorProps: {
      attributes: {
        'aria-labelledby': 'message-label',
        'aria-required': 'true',
        class: 'outline-none',
        id: 'message',
        role: 'textbox',
      },
    },
    onCreate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
    },
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
    },
  });

  const handleChange = (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) {
      setStatus({ state: 'error', message: 'The message editor is not ready yet. Please try again.' });
      return;
    }

    const plainMessage = editor.getText({ blockSeparator: '\n' }).trim();

    if (!plainMessage) {
      setStatus({ state: 'error', message: 'Please include a message before sending.' });
      return;
    }

    setStatus({ state: 'submitting', message: 'Sending your message…' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, message: plainMessage }),
      });

      const payload = (await response.json()) as { error?: string } | { success?: boolean };

      if (!response.ok) {
        throw new Error('error' in payload && payload.error ? payload.error : 'Failed to send message.');
      }

      setValues(initialValues);
      setStatus({ state: 'success', message: 'Thanks! Your message has been delivered.' });
      editor.commands.clearContent(true);
      setIsEditorEmpty(true);
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
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-lg border border-border bg-background p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
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
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label id="message-label" htmlFor="message" className="text-sm font-medium text-foreground">
            How can I help?
          </label>
          <div className="rounded-md border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/50 px-2 py-1 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'disabled:pointer-events-none disabled:opacity-50',
                )}
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'disabled:pointer-events-none disabled:opacity-50',
                )}
                aria-label="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </button>
              <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  editor?.isActive('bold') && 'bg-primary/10 text-primary',
                )}
                aria-label="Bold"
                aria-pressed={editor?.isActive('bold') ?? false}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  editor?.isActive('italic') && 'bg-primary/10 text-primary',
                )}
                aria-label="Italic"
                aria-pressed={editor?.isActive('italic') ?? false}
              >
                <Italic className="h-4 w-4" />
              </button>
              <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  editor?.isActive('bulletList') && 'bg-primary/10 text-primary',
                )}
                aria-label="Bulleted list"
                aria-pressed={editor?.isActive('bulletList') ?? false}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  editor?.isActive('orderedList') && 'bg-primary/10 text-primary',
                )}
                aria-label="Numbered list"
                aria-pressed={editor?.isActive('orderedList') ?? false}
              >
                <ListOrdered className="h-4 w-4" />
              </button>
            </div>
            <EditorContent
              editor={editor}
              className={cn(
                'relative min-h-[180px] w-full bg-transparent px-3 py-2 text-sm text-foreground',
                'whitespace-pre-wrap',
                'focus:outline-none focus-visible:outline-none',
                isEditorEmpty &&
                  'before:pointer-events-none before:absolute before:left-3 before:top-2.5 before:text-sm before:text-muted-foreground before:content-[attr(data-placeholder)]',
              )}
              data-placeholder="Tell me about your project or question."
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isSubmitting || !editor} className="w-full justify-center">
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
