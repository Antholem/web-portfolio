import React, { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../store/themeStore";
import { IconButton } from "./";
import { FaBold } from "react-icons/fa";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

const TextEditor = ({
  placeholder = ".",
  isRequired = false,
  value = EditorState.createEmpty(),
  onChange = () => {},
  className = "",
  ...props
}) => {
  const { theme } = useThemeStore();
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [editorState, setEditorState] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setEditorState((prevState) =>
      value.getCurrentContent().getPlainText() !== prevState.getCurrentContent().getPlainText() ? value : prevState
    );
  }, [value]);

  const isBoldActive = editorState.getCurrentInlineStyle().has("BOLD");

  const toggleBold = (event) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    if (typeof onChange === "function") {
      onChange(newEditorState);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (event) => {
    if (editorContainerRef.current && !editorContainerRef.current.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  };

  const isEditorEmpty = !editorState.getCurrentContent().hasText();

  return (
    <div ref={editorContainerRef} className={`rounded-md ${theme === "dark" ? "bg-dark-paper" : "bg-light-paper"} ${className}`}>
      <div className={`p-2 border-t border-r border-l rounded-t-md ${theme === "dark" ? "bg-dark- border-dark-text-disabled" : "bg-light-paper border-light-text-disabled"}`}>
        <IconButton
          type="button"
          onMouseDown={toggleBold}
          aria-label="bold"
          icon={<FaBold className={isBoldActive && "text-brand"} />}
          variant="text"
          size="xs"
        />
      </div>
      <div
        className={`border rounded-b-md p-2 min-h-52 max-h-52 overflow-y-auto cursor-text relative ${
          isFocused ? "border-brand" :
          theme === "dark" ? "border-dark-text-disabled hover:border-dark-text-primary" 
          : "border-light-text-disabled hover:border-light-text-primary"
        } `}
        tabIndex="0"
        onClick={() => editorRef.current.focus()}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
