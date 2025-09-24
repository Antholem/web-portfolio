declare module '@tiptap/react' {
  import type { ComponentType } from 'react';

  export interface CommandChain {
    focus(): CommandChain;
    toggleBold(): CommandChain;
    toggleItalic(): CommandChain;
    toggleBulletList(): CommandChain;
    toggleOrderedList(): CommandChain;
    toggleBlockquote(): CommandChain;
    run(): boolean;
  }

  export interface Editor {
    readonly isEmpty: boolean;
    getHTML(): string;
    getText(options?: { blockSeparator?: string }): string;
    getJSON(): unknown;
    setEditable(editable: boolean): void;
    isActive(name: string): boolean;
    commands: {
      clearContent(emitUpdate?: boolean): void;
    };
    chain(): CommandChain;
    can(): {
      chain(): CommandChain;
    };
  }

  export interface UseEditorOptions {
    extensions?: unknown[];
    editorProps?: {
      attributes?: Record<string, string>;
    };
    onCreate?(event: { editor: Editor }): void;
    onUpdate?(event: { editor: Editor }): void;
    onSelectionUpdate?(event: { editor: Editor }): void;
  }

  export function useEditor(options?: UseEditorOptions): Editor | null;

  export interface EditorContentProps {
    editor: Editor | null;
    className?: string;
  }

  export const EditorContent: ComponentType<EditorContentProps>;
}

declare module '@tiptap/starter-kit' {
  const StarterKit: {
    configure(options?: Record<string, unknown>): unknown;
  };

  export default StarterKit;
}
