import React, { useEffect, useRef, useState } from "react";
import * as Icon from "react-icons/fa";
import { IconButton } from "./";
import { Editor, EditorContent } from "@tiptap/react";
import { useThemeStore } from "../store/themeStore";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";

const TextEditor = () => {
  const { theme } = useThemeStore();
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editorRef.current) {
      const newEditor = new Editor({
        extensions: [
          StarterKit,
          Placeholder.configure({
            placeholder: "Enter your message here...",
          }),
        ],
      });
      setEditor(newEditor);
      editorRef.current = newEditor;
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (editor) {
      editor.setOptions({

      });
    }
  }, [theme, editor]);

  const toggleBold = (event) => {
    event.preventDefault();
    editor?.chain().focus().toggleBold().run();
  };

  return (
    <div>
      <div className={`p-2 border-t border-r border-l rounded-t-md flex flex-wrap gap-2 ${theme === "dark"
        ? "bg-dark-paper border-dark-text-disabled"
        : "bg-light-paper border-light-text-disabled"}`}
      >
        <IconButton
          onClick={toggleBold}
          aria-label="Bold"
          icon={<Icon.FaBold />}
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
