import React, { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../store/themeStore";
import { Editor, EditorState, RichUtils, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import { FaBold } from "react-icons/fa";
import { IconButton } from "./";

const TextEditor = ({
  placeholder = "Write your message...",
  size = "md",
  isRequired = false,
  value = "", // Default value is an empty string
  onChange = () => {}, // Ensure onChange is always a function
  className = "",
  ...props
}) => {
  const { theme } = useThemeStore();
  const editorRef = useRef(null);

  const [editorState, setEditorState] = useState(() =>
    value ? EditorState.createWithContent(ContentState.createFromText(value)) : EditorState.createEmpty()
  );

  // Update state when `value` prop changes
  useEffect(() => {
    if (value !== editorState.getCurrentContent().getPlainText()) {
      setEditorState(EditorState.createWithContent(ContentState.createFromText(value)));
    }
  }, [value]);

  // Check if Bold is active
  const isBoldActive = editorState.getCurrentInlineStyle().has("BOLD");

  // Function to toggle Bold style
  const toggleBold = (event) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  // Handle text changes and call `onChange`
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    if (typeof onChange === "function") {
      onChange(newEditorState.getCurrentContent().getPlainText());
    }
  };

  // Check if editor is empty
  const isEditorEmpty = !editorState.getCurrentContent().hasText();

  /** Styles for size */
  const sizeStyles = {
    xs: "h-20 text-xs",
    sm: "h-24 text-sm",
    md: "h-32 text-base",
    lg: "h-40 text-lg",
  };

  return (
    <div className={`rounded-md ${theme === "dark" ? "bg-dark-paper" : "bg-light-paper"} ${className}`}>
      {/* Toolbar */}
      <div className={`p-2 border-t border-r border-l rounded-t-md ${theme === "dark" ? "bg-dark- border-dark-text-disabled" : "bg-light-paper border-light-text-disabled"}`}>
        <IconButton
          type="button"
          onMouseDown={toggleBold}
          aria-label="bold"
          icon={<FaBold className={isBoldActive ? "text-brand" : ""} />}
          variant="text"
          size="xs"
        />
      </div>

      {/* Editor */}
      <div
        className={`border rounded-b-md focus-within:border-brand p-2 min-h-[200px] cursor-text relative ${theme === "dark" ? "bg-dark- border-dark-text-disabled hover:border-dark-text-primary" : "bg-light-paper border-light-text-disabled hover:border-light-text-primary"} ${sizeStyles[size]}`}
        tabIndex="0"
        onClick={() => editorRef.current.focus()}
      >
        {isEditorEmpty && (
          <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextEditor;
