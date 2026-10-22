"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type RefObject,
} from "react";

import {
  continueList,
  toggleInline,
  toggleList,
  type TextEdit,
} from "@/lib/text-formatting";

export type FormatAction = "bold" | "italic" | "bullet" | "ordered";

type Options = {
  ref: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

function read(el: HTMLTextAreaElement): TextEdit {
  return {
    value: el.value,
    selectionStart: el.selectionStart,
    selectionEnd: el.selectionEnd,
  };
}

/** Markdown-style formatting for a controlled textarea that keeps native undo. */
export function useTextFormatting({
  ref,
  value,
  onChange,
  maxLength,
}: Options) {
  const pendingSelection = useRef<[number, number] | null>(null);

  // Fallback path: restore the selection once React has rendered the new value.
  useLayoutEffect(() => {
    const el = ref.current;
    const selection = pendingSelection.current;
    if (!el || !selection) return;
    pendingSelection.current = null;
    el.setSelectionRange(...selection);
  }, [ref, value]);

  const apply = useCallback(
    (edit: TextEdit) => {
      const el = ref.current;
      if (!el) return false;
      if (maxLength !== undefined && edit.value.length > maxLength)
        return false;
      el.focus();

      const current = el.value;
      if (current !== edit.value) {
        // Replace only the changed span so the browser records a minimal undo step.
        let from = 0;
        while (from < current.length && current[from] === edit.value[from])
          from++;
        let oldEnd = current.length;
        let newEnd = edit.value.length;
        while (
          oldEnd > from &&
          newEnd > from &&
          current[oldEnd - 1] === edit.value[newEnd - 1]
        ) {
          oldEnd--;
          newEnd--;
        }
        el.setSelectionRange(from, oldEnd);
        const inserted = edit.value.slice(from, newEnd);

        // execCommand is the only way to keep the native undo stack for a
        // programmatic edit. It is deprecated but universally supported in
        // browsers; jsdom lacks it, hence the state fallback.
        let applied = false;
        try {
          applied = document.execCommand(
            inserted ? "insertText" : "delete",
            false,
            inserted,
          );
        } catch {
          applied = false;
        }
        if (!applied || el.value !== edit.value) {
          pendingSelection.current = [edit.selectionStart, edit.selectionEnd];
          onChange(edit.value);
          return true;
        }
      }
      el.setSelectionRange(edit.selectionStart, edit.selectionEnd);
      return true;
    },
    [ref, onChange, maxLength],
  );

  const format = useCallback(
    (action: FormatAction) => {
      const el = ref.current;
      if (!el) return;
      const state = read(el);
      apply(
        action === "bold"
          ? toggleInline(state, "**")
          : action === "italic"
            ? toggleInline(state, "_")
            : toggleList(state, action),
      );
    },
    [ref, apply],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.nativeEvent.isComposing) return;
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      if (
        mod &&
        !event.altKey &&
        !event.shiftKey &&
        (key === "b" || key === "i")
      ) {
        event.preventDefault();
        format(key === "b" ? "bold" : "italic");
        return;
      }
      if (event.key === "Enter" && !mod && !event.shiftKey && !event.altKey) {
        const edit = continueList(read(event.currentTarget));
        if (edit && apply(edit)) event.preventDefault();
      }
    },
    [format, apply],
  );

  return { format, onKeyDown };
}
