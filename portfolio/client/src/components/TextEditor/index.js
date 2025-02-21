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

const TextEditor = ({
  variant = "outline",
  className = "", 
  isInvalid = false, 
  placeholder,
  value,
  onChange,
  editorRef,
  ...props
}) => {
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
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
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
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange && onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && editorRef) editorRef.current = editor;
  }, [editor, editorRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowHighlightColorPicker(false);
        setShowFontColorPicker(false);
      }
    };

    if (showHighlightColorPicker || showFontColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHighlightColorPicker, showFontColorPicker]);

  if (!editor) return null;

  const baseStyles = "transition-all duration-300";

  const variantStyles = {
    outline: theme === "dark"
      ? "bg-dark border border-dark-text-disabled hover:border-dark-text-primary"
      : "bg-light border border-light-text-disabled hover:border-light-text-primary",

    filled: theme === "dark"
      ? "bg-dark-paper border border-dark-text-disabled hover:border-dark-text-primary"
      : "bg-light-paper border border-light-text-disabled hover:border-light-text-primary",

    flushed: theme === "dark"
    ? "bg-dark-action-hover border-dark-text-disabled hover:bg-dark"
    : "bg-light-action-hover border-light-text-disabled hover:bg-light",
  };

  const appliedVariantStyles = variantStyles[variant] || variantStyles["filled"];
  const invalidStyles = isInvalid && "border-red-500 focus:ring-red-500";

  return (
    <div>
      <ToolBar 
        variant={variant}
        editor={editor} 
      />
      <EditorContent
        editor={editor}
        className={`${baseStyles} ${appliedVariantStyles} ${invalidStyles} ${className}`}
        {...props}
      />
      <BottomBar 
        variant={variant}
        editor={editor} 
      />
    </div>
  );
};

export default TextEditor;
