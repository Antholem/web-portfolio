'use client';

import { type ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EditorContent, type Editor as TiptapEditor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { LucideIcon } from 'lucide-react';
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react';

type JSONContent = {
  type?: string;
  text?: string;
  content?: JSONContent[];
};

const ZERO_WIDTH_SPACE_REGEX = /\u200B/g;
const NON_BREAKING_SPACE_REGEX = /\u00A0/g;

const sanitizeEditorText = (value: string) =>
  value.replace(ZERO_WIDTH_SPACE_REGEX, '').replace(NON_BREAKING_SPACE_REGEX, ' ').trim();

const WRAPPER_NODE_TYPES = new Set(['bulletList', 'orderedList', 'blockquote', 'listItem']);

const nodeHasMeaningfulText = (node: JSONContent | null | undefined): boolean => {
  if (!node) {
    return false;
  }

  if (typeof node.text === 'string' && sanitizeEditorText(node.text).length > 0) {
    return true;
  }

  if (node.type === 'hardBreak') {
    return true;
  }

  if (!Array.isArray(node.content)) {
    return false;
  }

  if (node.content.some((child) => nodeHasMeaningfulText(child))) {
    return true;
  }

  if (node.type && WRAPPER_NODE_TYPES.has(node.type)) {
    return node.content.length > 0;
  }

  return false;
};

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

interface FormattingOption {
  label: string;
  icon: LucideIcon;
  action: () => boolean;
  isActive: boolean;
  isDisabled: boolean;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [, setEditorStateVersion] = useState(0);

  const updateEditorEmptyState = useCallback(
    (instance: TiptapEditor) => {
      const plainText = sanitizeEditorText(instance.getText({ blockSeparator: '\n' }));

      if (plainText.length > 0) {
        setIsEditorEmpty(false);
        return;
      }

      const documentJson = instance.getJSON() as JSONContent;
      setIsEditorEmpty(!nodeHasMeaningfulText(documentJson));
    },
    [setIsEditorEmpty],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepAttributes: false, keepMarks: true },
        orderedList: { keepAttributes: false, keepMarks: true },
      }),
    ],
    editorProps: {
      attributes: {
        class: [
          'min-h-[180px] w-full cursor-text px-3 py-2 text-sm leading-6 text-foreground caret-primary outline-none',
          'focus:outline-none focus-visible:outline-none',
          '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_p:last-child]:mb-0',
          '[&_ul]:list-disc [&_ul]:pl-6',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
        ].join(' '),
      },
    },
    onCreate({ editor }) {
      updateEditorEmptyState(editor);
    },
    onUpdate({ editor }) {
      updateEditorEmptyState(editor);
      setEditorStateVersion((count) => count + 1);
    },
    onSelectionUpdate({ editor }) {
      updateEditorEmptyState(editor);
      setEditorStateVersion((count) => count + 1);
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(status.state !== 'submitting');
  }, [editor, status.state]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    updateEditorEmptyState(editor);
  }, [editor, updateEditorEmptyState]);

  const handleChange = (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) {
      setStatus({ state: 'error', message: 'Editor failed to load. Please refresh the page.' });
      return;
    }

    const plainMessage = sanitizeEditorText(editor.getText({ blockSeparator: '\n' }));
    const messageHtml = editor.getHTML();

    if (!plainMessage) {
      setStatus({ state: 'error', message: 'Please include a message.' });
      return;
    }

    if (plainMessage.length > 5000) {
      setStatus({
        state: 'error',
        message: 'Message is too long. Please keep it under 5000 characters.',
      });
      return;
    }

    setStatus({ state: 'submitting', message: 'Sending your message…' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, message: plainMessage, messageHtml }),
      });

      const payload = (await response.json()) as { error?: string } | { success?: boolean };

      if (!response.ok) {
        throw new Error('error' in payload && payload.error ? payload.error : 'Failed to send message.');
      }

      setValues(initialValues);
      editor.commands.clearContent(true);
      updateEditorEmptyState(editor);
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

  const formattingOptions: FormattingOption[] = editor
    ? [
        {
          label: 'Bold',
          icon: Bold,
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive('bold'),
          isDisabled: !editor.can().chain().focus().toggleBold().run(),
        },
        {
          label: 'Italic',
          icon: Italic,
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive('italic'),
          isDisabled: !editor.can().chain().focus().toggleItalic().run(),
        },
        {
          label: 'Bullet list',
          icon: List,
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive('bulletList'),
          isDisabled: !editor.can().chain().focus().toggleBulletList().run(),
        },
        {
          label: 'Numbered list',
          icon: ListOrdered,
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive('orderedList'),
          isDisabled: !editor.can().chain().focus().toggleOrderedList().run(),
        },
        {
          label: 'Quote',
          icon: Quote,
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive('blockquote'),
          isDisabled: !editor.can().chain().focus().toggleBlockquote().run(),
        },
      ]
    : [];

  return (
    <Card className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <CardContent className="space-y-6 p-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
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
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">How can I help?</span>
              <div className="flex flex-col overflow-hidden rounded-md border border-input bg-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 px-2 py-1">
                  {formattingOptions.map(({ label, icon: Icon, action, isActive, isDisabled }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={action}
                      disabled={isSubmitting || isDisabled}
                      aria-label={label}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      } ${isSubmitting || isDisabled ? 'opacity-50' : ''}`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <div className="relative">
                  {editor ? (
                    <>
                      {isEditorEmpty && (
                        <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                          Tell me about your project or question.
                        </span>
                      )}
                      <EditorContent editor={editor} />
                    </>
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Loading editor…</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2 border-t border-border/60 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <Button type="submit" disabled={isSubmitting || !editor} className="w-full justify-center md:w-auto">
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
        </CardFooter>
      </form>
    </Card>
  );
}
