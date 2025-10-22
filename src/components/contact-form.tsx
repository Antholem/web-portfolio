'use client';

import { type ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
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

const editorClassName = [
  'h-56 w-full cursor-text overflow-y-auto px-3 py-2 text-sm leading-6 text-foreground caret-primary outline-none',
  'focus:outline-none focus-visible:outline-none',
  '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_p:last-child]:mb-0',
  '[&_ul]:list-disc [&_ul]:pl-6',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
].join(' ');

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

interface FormattingOptionDefinition {
  label: string;
  icon: LucideIcon;
  run: (editor: TiptapEditor) => boolean;
  isActive: (editor: TiptapEditor) => boolean;
  isDisabled: (editor: TiptapEditor) => boolean;
}

const formattingOptionDefinitions: FormattingOptionDefinition[] = [
  {
    label: 'Bold',
    icon: Bold,
    run: (instance) => instance.chain().focus().toggleBold().run(),
    isActive: (instance) => instance.isActive('bold'),
    isDisabled: (instance) => !instance.can().chain().focus().toggleBold().run(),
  },
  {
    label: 'Italic',
    icon: Italic,
    run: (instance) => instance.chain().focus().toggleItalic().run(),
    isActive: (instance) => instance.isActive('italic'),
    isDisabled: (instance) => !instance.can().chain().focus().toggleItalic().run(),
  },
  {
    label: 'Bullet list',
    icon: List,
    run: (instance) => instance.chain().focus().toggleBulletList().run(),
    isActive: (instance) => instance.isActive('bulletList'),
    isDisabled: (instance) => !instance.can().chain().focus().toggleBulletList().run(),
  },
  {
    label: 'Numbered list',
    icon: ListOrdered,
    run: (instance) => instance.chain().focus().toggleOrderedList().run(),
    isActive: (instance) => instance.isActive('orderedList'),
    isDisabled: (instance) => !instance.can().chain().focus().toggleOrderedList().run(),
  },
  {
    label: 'Quote',
    icon: Quote,
    run: (instance) => instance.chain().focus().toggleBlockquote().run(),
    isActive: (instance) => instance.isActive('blockquote'),
    isDisabled: (instance) => !instance.can().chain().focus().toggleBlockquote().run(),
  },
];

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
        class: editorClassName,
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
      const message = 'Editor failed to load. Please refresh the page.';
      setStatus({ state: 'error', message });
      toast.error(message);
      return;
    }

    const plainMessage = sanitizeEditorText(editor.getText({ blockSeparator: '\n' }));
    const messageHtml = editor.getHTML();

    if (!plainMessage) {
      const message = 'Please include a message.';
      setStatus({ state: 'error', message });
      toast.error(message);
      return;
    }

    if (plainMessage.length > 5000) {
      const message = 'Message is too long. Please keep it under 5000 characters.';
      setStatus({
        state: 'error',
        message,
      });
      toast.error(message);
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
      const message = 'Thanks! Your message has been delivered.';
      setStatus({ state: 'success', message });
      toast.success(message);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Something went wrong while sending your message.';
      setStatus({ state: 'error', message });
      toast.error(message);
    }
  };

  const isSubmitting = status.state === 'submitting';

  const formattingButtons = formattingOptionDefinitions.map(({ label, icon: Icon, run, isActive, isDisabled }) => {
    const isButtonActive = editor ? isActive(editor) : false;
    const isButtonDisabled = isSubmitting || !editor || (editor ? isDisabled(editor) : true);

    return (
      <button
        key={label}
        type="button"
        onClick={
          editor
            ? () => {
                run(editor);
              }
            : undefined
        }
        disabled={isButtonDisabled}
        aria-label={label}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isButtonActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        } ${isButtonDisabled ? 'opacity-50' : ''}`}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  });

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
                <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/80 px-2 py-1">
                  {formattingButtons}
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
                    <div aria-hidden className="relative">
                      <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                        Tell me about your project or question.
                      </span>
                      <div className={`${editorClassName} select-none`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2 px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Button type="submit" disabled={isSubmitting || !editor} className="w-full justify-center md:w-auto">
              {isSubmitting ? 'Sending…' : 'Send message'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast('This is a test toast from the contact form!')}
              className="w-full justify-center md:w-auto"
            >
              Test toast
            </Button>
          </div>
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
