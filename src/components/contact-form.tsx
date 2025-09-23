'use client';

import {
  type ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

interface FormatState {
  bold: boolean;
  italic: boolean;
  unordered: boolean;
  ordered: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  message: '',
};

const initialStatus: FormStatus = { state: 'idle', message: null };
const initialFormatState: FormatState = {
  bold: false,
  italic: false,
  unordered: false,
  ordered: false,
  canUndo: false,
  canRedo: false,
};

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [formatState, setFormatState] = useState<FormatState>(initialFormatState);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const resetStatusOnInput = useCallback(() => {
    setStatus((previous) => {
      if (previous.state === 'idle' || previous.state === 'submitting') {
        return previous;
      }

      return initialStatus;
    });
  }, []);

  const handleChange = (field: 'name' | 'email') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));
      resetStatusOnInput();
    };

  const updateFormatState = useCallback(() => {
    if (typeof document === 'undefined') return;

    const editor = editorRef.current;
    if (!editor) return;

    const selection = document.getSelection();
    const anchorNode = selection?.anchorNode;
    const isInEditor =
      !!anchorNode && (editor === anchorNode || editor.contains(anchorNode));

    const safeQueryState = (command: string) => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    };

    const safeQueryEnabled = (command: string) => {
      try {
        return document.queryCommandEnabled(command);
      } catch {
        return false;
      }
    };

    const nextState: FormatState = {
      bold: isInEditor ? safeQueryState('bold') : false,
      italic: isInEditor ? safeQueryState('italic') : false,
      unordered: isInEditor ? safeQueryState('insertUnorderedList') : false,
      ordered: isInEditor ? safeQueryState('insertOrderedList') : false,
      canUndo: safeQueryEnabled('undo'),
      canRedo: safeQueryEnabled('redo'),
    };

    setFormatState((previous) => {
      if (
        previous.bold === nextState.bold &&
        previous.italic === nextState.italic &&
        previous.unordered === nextState.unordered &&
        previous.ordered === nextState.ordered &&
        previous.canUndo === nextState.canUndo &&
        previous.canRedo === nextState.canRedo
      ) {
        return previous;
      }

      return nextState;
    });
  }, []);

  const handleEditorInput = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const normalizedMessage = (editor.innerText ?? '')
      .replace(/\u00a0/g, ' ')
      .replace(/\r/g, '')
      .trim();

    setValues((previous) =>
      previous.message === normalizedMessage
        ? previous
        : { ...previous, message: normalizedMessage }
    );
    resetStatusOnInput();
    updateFormatState();
  }, [resetStatusOnInput, updateFormatState]);

  const handleEditorFocus = useCallback(() => {
    resetStatusOnInput();
    updateFormatState();
  }, [resetStatusOnInput, updateFormatState]);

  const handleEditorBlur = useCallback(() => {
    handleEditorInput();
    updateFormatState();
  }, [handleEditorInput, updateFormatState]);

  const execCommand = useCallback(
    (command: string) => {
      if (typeof document === 'undefined') return;
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();
      try {
        document.execCommand(command);
      } catch {
        // Ignore unsupported commands.
      }

      handleEditorInput();
      updateFormatState();
    },
    [handleEditorInput, updateFormatState]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    updateFormatState();
    const handleSelectionChange = () => updateFormatState();
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [updateFormatState]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = values.name.trim();
    const trimmedEmail = values.email.trim();
    const trimmedMessage = values.message.trim();

    if (!trimmedMessage) {
      setStatus({ state: 'error', message: 'Please include a message.' });
      return;
    }

    if (trimmedMessage.length > 5000) {
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
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      const payload = (await response.json()) as { error?: string } | { success?: boolean };

      if (!response.ok) {
        throw new Error('error' in payload && payload.error ? payload.error : 'Failed to send message.');
      }

      setValues(initialValues);
      setFormatState(initialFormatState);
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-3xl flex-col gap-5 rounded-lg border border-border bg-background p-6 shadow-sm"
    >
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
            autoComplete="name"
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
            autoComplete="email"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          How can I help?
        </label>
        <div className={cn('overflow-hidden rounded-md border border-input bg-transparent transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 focus-within:ring-offset-background')}>
          <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
            <ToolbarButton
              icon={Bold}
              label="Bold"
              active={formatState.bold}
              onClick={() => execCommand('bold')}
            />
            <ToolbarButton
              icon={Italic}
              label="Italic"
              active={formatState.italic}
              onClick={() => execCommand('italic')}
            />
            <ToolbarButton
              icon={List}
              label="Bulleted list"
              active={formatState.unordered}
              onClick={() => execCommand('insertUnorderedList')}
            />
            <ToolbarButton
              icon={ListOrdered}
              label="Numbered list"
              active={formatState.ordered}
              onClick={() => execCommand('insertOrderedList')}
            />
            <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            <ToolbarButton
              icon={Undo2}
              label="Undo"
              disabled={!formatState.canUndo}
              onClick={() => execCommand('undo')}
            />
            <ToolbarButton
              icon={Redo2}
              label="Redo"
              disabled={!formatState.canRedo}
              onClick={() => execCommand('redo')}
            />
          </div>
          <div
            ref={editorRef}
            id="message"
            role="textbox"
            aria-multiline="true"
            aria-required="true"
            className="rich-textarea"
            contentEditable
            data-placeholder="Tell me about your project or question."
            spellCheck
            onInput={handleEditorInput}
            onFocus={handleEditorFocus}
            onBlur={handleEditorBlur}
          />
        </div>
        <input type="hidden" name="message" value={values.message} />
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

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({ icon: Icon, label, onClick, active = false, disabled = false }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-40',
        active && 'bg-primary/10 text-primary'
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
