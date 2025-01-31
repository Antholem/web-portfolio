import React from "react";
import * as Icon from "react-icons/fa";
import { IconButton } from "./";
import { EditorContent, useEditor } from "@tiptap/react";
import { useThemeStore } from "../store/themeStore";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";

const TextEditor = ({ placeholder, value, onChange }) => {
  const { theme } = useThemeStore();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const toggleBold = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleItalic().run();
  };

  const toggleStrike = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleStrike().run();
  };

  const toggleCode = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleCode().run();  // Corrected the method call
  };

  return (
    <div>
      <div className={`p-2 border-t border-r border-l rounded-t-md flex flex-wrap gap-1 ${theme === "dark"
        ? "bg-dark-paper border-dark-text-disabled"
        : "bg-light-paper border-light-text-disabled"}`}
      >
        <IconButton
          onClick={toggleBold}
          aria-label="Bold"
          icon={<Icon.FaBold className={`${editor.isActive("bold") && "text-brand"}`} />}
          variant="text"
          size="xs"
        />
        <IconButton
          onClick={toggleItalic}
          aria-label="Italic"
          icon={<Icon.FaItalic className={`${editor.isActive("italic") && "text-brand"}`} />}
          variant="text"
          size="xs"
        />
        <IconButton
          onClick={toggleStrike}
          aria-label="Strike"
          icon={<Icon.FaStrikethrough className={`${editor.isActive("strike") && "text-brand"}`} />}
          variant="text"
          size="xs"
        />
        <IconButton
          onClick={toggleCode}
          aria-label="Code"
          icon={<Icon.FaCode className={`${editor.isActive("code") && "text-brand"}`} />} 
          variant="text"
          size="xs"
        />
      </div>
      <EditorContent
        editor={editor}
        className={`border rounded-b-md transition duration-200 ${theme === "dark"
          ? "bg-dark-paper border-dark-text-disabled hover:border-dark-text-primary"
          : "bg-light-paper border-light-text-disabled hover:border-light-text-primary"}`}
      />
    </div>
  );
};

export default TextEditor;
