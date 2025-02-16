import React, { useState, useRef, useEffect } from "react";
import BottomBar from "./BottomBar";
import ToolBar from "./ToolBar";
import { useThemeStore } from "../../store/themeStore";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import ListKeymap from "@tiptap/extension-list-keymap";
import Typography from "@tiptap/extension-typography";
import Gapcursor from "@tiptap/extension-gapcursor";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";

const TextEditor = ({ placeholder, value, onChange, editorRef }) => {
  const { theme } = useThemeStore();
  const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
  const [showFontColorPicker, setShowFontColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      Placeholder.configure({ placeholder }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ 
        multicolor: true
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Subscript,
      Superscript,
      CharacterCount,
      ListKeymap,
      Typography,
      Gapcursor,
      TextStyle,
      Color
    ],
    content: value,
    onUpdate: ({ editor }) => onChange && onChange(editor.getHTML())
  });

  useEffect(() => {
    if (editor && editorRef) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowHighlightColorPicker(false);
        setShowFontColorPicker(false);
      }
    };

    if (showHighlightColorPicker || showFontColorPicker) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [showHighlightColorPicker, showFontColorPicker]);

  if (!editor) return null;

  return (
    <div>
      <ToolBar
        editor={editor}
      />
      <EditorContent
        editor={editor}
        className={`border transition duration-200 ${theme === "dark"
          ? "bg-dark-paper border-dark-text-disabled hover:border-dark-text-primary"
          : "bg-light-paper border-light-text-disabled hover:border-light-text-primary"}`}
      />
      <BottomBar 
        editor={editor}
      />
    </div>
  );
};

export default TextEditor;
