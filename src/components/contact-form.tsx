'use client';

import { type ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { EditorContent, type Editor as TiptapEditor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { LucideIcon } from 'lucide-react';
import { Bold, ChevronDown, Italic, List, ListOrdered, Loader2, Quote } from 'lucide-react';

type JSONContent = {
  type?: string;
  text?: string;
  content?: JSONContent[];
};

const ZERO_WIDTH_SPACE_REGEX = /\u200B/g;
const NON_BREAKING_SPACE_REGEX = /\u00A0/g;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

const sanitizeEditorText = (value: string) =>
  value.replace(ZERO_WIDTH_SPACE_REGEX, '').replace(NON_BREAKING_SPACE_REGEX, ' ').trim();

const convertTextToDoc = (value: string): JSONContent => {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map<JSONContent>((paragraph) => {
      const lines = paragraph.split(/\n/);
      const content: JSONContent[] = lines.flatMap((line, index) => {
        const nodes: JSONContent[] = [];

        if (line.length > 0) {
          nodes.push({ type: 'text', text: line });
        }

        if (index < lines.length - 1) {
          nodes.push({ type: 'hardBreak' });
        }

        return nodes;
      });

      return {
        type: 'paragraph',
        content: content.length > 0 ? content : [{ type: 'text', text: '' }],
      };
    });

  if (paragraphs.length === 0) {
    return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] };
  }

  return { type: 'doc', content: paragraphs };
};

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

type EnhanceMode = 'enhance' | 'grammar' | 'paraphrase' | 'shorten';

interface EnhanceOption {
  mode: EnhanceMode;
  label: string;
  loadingLabel: string;
  description: string;
}

const enhanceOptions: EnhanceOption[] = [
  {
    mode: 'enhance',
    label: 'Enhance message',
    loadingLabel: 'Enhancing…',
    description: 'Polish grammar, clarity, and tone while keeping the intent.',
  },
  {
    mode: 'grammar',
    label: 'Fix grammar',
    loadingLabel: 'Fixing grammar…',
    description: 'Correct spelling, punctuation, and grammatical issues only.',
  },
  {
    mode: 'paraphrase',
    label: 'Paraphrase',
    loadingLabel: 'Paraphrasing…',
    description: 'Rephrase the message with fresh wording and the same meaning.',
  },
  {
    mode: 'shorten',
    label: 'Make concise',
    loadingLabel: 'Shortening…',
    description: 'Trim the message to keep only the essential information.',
  },
];

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedEnhanceOption, setSelectedEnhanceOption] = useState<EnhanceOption>(enhanceOptions[0]);
  const [isEnhanceMenuOpen, setIsEnhanceMenuOpen] = useState(false);
  const [, setEditorStateVersion] = useState(0);
  const enhanceMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isEnhanceMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        enhanceMenuRef.current &&
        event.target instanceof Node &&
        !enhanceMenuRef.current.contains(event.target)
      ) {
        setIsEnhanceMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEnhanceMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEnhanceMenuOpen]);

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

    if (plainMessage.length > MAX_MESSAGE_LENGTH) {
      const message = `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`;
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
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const isNameValid = trimmedName.length > 0;
  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const isFormValid = isNameValid && isEmailValid && !isEditorEmpty;

  const handleEnhance = async (mode: EnhanceMode = selectedEnhanceOption.mode) => {
    if (!editor) {
      toast.error('Editor failed to load. Please refresh the page.');
      return;
    }

    const plainMessage = sanitizeEditorText(editor.getText({ blockSeparator: '\n' }));

    if (!plainMessage) {
      toast.error('Please write a message before enhancing it.');
      return;
    }

    if (plainMessage.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    setIsEnhanceMenuOpen(false);
    setIsEnhancing(true);

    try {
      const response = await fetch('/api/contact/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: plainMessage, mode }),
      });

      const payload = (await response.json()) as { suggestion?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? 'Failed to enhance your message.');
      }

      if (!payload.suggestion) {
        throw new Error('The AI response was empty. Please try again.');
      }

      editor.commands.setContent(convertTextToDoc(payload.suggestion), false);
      updateEditorEmptyState(editor);
      toast.success('Message enhanced successfully.');
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Something went wrong while enhancing your message.';
      toast.error(message);
    } finally {
      setIsEnhancing(false);
    }
  };

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
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isButtonActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
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
                          Share your project goals, requirements, or questions.
                        </span>
                      )}
                      <EditorContent editor={editor} />
                    </>
                  ) : (
                    <div aria-hidden className="relative">
                      <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                        Share your project goals, requirements, or questions.
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
            <Button
              type="submit"
              disabled={isSubmitting || !editor || !isFormValid}
              className="w-full justify-center md:w-auto"
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                'Send message'
              )}
            </Button>
            <div
              className="relative flex w-full items-center md:w-auto"
              ref={enhanceMenuRef}
              onBlur={(event) => {
                if (
                  enhanceMenuRef.current &&
                  event.relatedTarget instanceof Node &&
                  enhanceMenuRef.current.contains(event.relatedTarget)
                ) {
                  return;
                }
                setIsEnhanceMenuOpen(false);
              }}
            >
              <Button
                type="button"
                variant="outline"
                disabled={isEnhancing || isSubmitting || !editor || isEditorEmpty}
                onClick={() => {
                  void handleEnhance();
                }}
                className="w-full justify-center rounded-r-none md:w-auto"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    {selectedEnhanceOption.loadingLabel}
                  </>
                ) : (
                  selectedEnhanceOption.label
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="-ml-px rounded-l-none px-3"
                aria-haspopup="menu"
                aria-expanded={isEnhanceMenuOpen}
                aria-controls="enhance-menu"
                aria-label="More message enhancement options"
                disabled={isEnhancing || isSubmitting || !editor}
                onClick={() => {
                  setIsEnhanceMenuOpen((current) => !current);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setIsEnhanceMenuOpen(true);
                  }
                }}
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
              </Button>
              {isEnhanceMenuOpen ? (
                <div
                  id="enhance-menu"
                  role="menu"
                  aria-label="Message enhancement options"
                  className="absolute right-0 top-full z-10 mt-2 w-64 overflow-hidden rounded-md border bg-background p-1 shadow-lg"
                >
                  {enhanceOptions.map((option) => {
                    const isSelected = option.mode === selectedEnhanceOption.mode;
                    return (
                      <button
                        key={option.mode}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelected}
                        className={`flex w-full flex-col items-start gap-1 rounded-sm px-3 py-2 text-left text-sm transition hover:bg-accent hover:text-accent-foreground ${
                          isSelected ? 'bg-muted text-foreground' : 'text-foreground'
                        }`}
                        onClick={() => {
                          setSelectedEnhanceOption(option);
                          const canEnhance = !isEnhancing && !isSubmitting && editor && !isEditorEmpty;
                          if (canEnhance) {
                            void handleEnhance(option.mode);
                            return;
                          }

                          setIsEnhanceMenuOpen(false);
                        }}
                      >
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
