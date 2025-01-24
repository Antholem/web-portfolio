import React, { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../store/themeStore";
import * as Icon from "react-icons/fa";
import { IconButton, Select } from "./";
import { Editor as DraftEditor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

const TextEditor = ({
  placeholder = "",
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
      value.getCurrentContent().getPlainText() !==
      prevState.getCurrentContent().getPlainText()
        ? value
        : prevState
    );
  }, [value]);

  const toggleBold = (event) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const toggleItalic = (event) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  const toggleUnderline = (event) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  const toggleStrikethrough = (event) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const blockStyleFn = (block) => {
    const blockType = block.getType();
    
    switch (blockType) {
      case "header-one":
        return "text-3xl font-bold mb-4";
      case "header-two":
        return "text-2xl font-bold mb-4"; 
      case "header-three":
        return "text-xl font-bold mb-4";
      case "header-four":
        return "text-lg font-bold mb-4";
      case "header-five":
        return "text-base font-bold mb-4";
      case "header-six":
        return "text-sm font-bold mb-4";
      default:
        return "";
    }
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

  const isEditorEmpty =
  !editorState.getCurrentContent().hasText() &&
  !["unordered-list-item", "ordered-list-item"].includes(
    editorState.getCurrentContent().getBlockMap().first().getType()
  );

  const isBoldActive = editorState.getCurrentInlineStyle().has("BOLD");
  const isItalicActive = editorState.getCurrentInlineStyle().has("ITALIC");
  const isUnderlineActive = editorState.getCurrentInlineStyle().has("UNDERLINE");
  const isStrikethroughActive = editorState.getCurrentInlineStyle().has("STRIKETHROUGH");

  const currentBlockType = editorState.getCurrentContent().getBlockMap().first().getType();
  const isULActive = currentBlockType === "unordered-list-item";
  const isOLActive = currentBlockType === "ordered-list-item";

  const Tools = () => (
    <div
      className={`p-2 border-t border-r border-l rounded-t-md flex gap-2 ${theme === "dark" ? "bg-dark-paper border-dark-text-disabled" : "bg-light-paper border-light-text-disabled"}`}
    >
    <Select
      variant="flushed"
      size="sm"
      value={currentBlockType || "unstyled"}
      onChange={(e) => toggleBlockType(e.target.value)}
    >
      <option value="unstyled">Normal Text</option>
      <option value="header-one">Heading 1</option>
      <option value="header-two">Heading 2</option>
      <option value="header-three">Heading 3</option>
      <option value="header-four">Heading 4</option>
      <option value="header-five">Heading 5</option>
      <option value="header-six">Heading 6</option>
    </Select>
      <IconButton
        type="button"
        onMouseDown={toggleBold}
        aria-label="bold"
        icon={<Icon.FaBold className={isBoldActive && "text-brand"} />}
        variant="text"
        size="xs"
      />
      <IconButton
        type="button"
        onMouseDown={toggleItalic}
        aria-label="italic"
        icon={<Icon.FaItalic className={isItalicActive && "text-brand"} />}
        variant="text"
        size="xs"
      />
      <IconButton
        type="button"
        onMouseDown={toggleUnderline}
        aria-label="underline"
        icon={<Icon.FaUnderline className={isUnderlineActive && "text-brand"} />}
        variant="text"
        size="xs"
      />
      <IconButton
        type="button"
        onMouseDown={toggleStrikethrough}
        aria-label="strikethrough"
        icon={<Icon.FaStrikethrough className={isStrikethroughActive && "text-brand"} />}
        variant="text"
        size="xs"
      />
      <IconButton
        type="button"
        onMouseDown={(e) => { e.preventDefault(); toggleBlockType("unordered-list-item"); }}
        aria-label="UL"
        icon={<Icon.FaList className={isULActive && "text-brand"} />}
        variant="text"
        size="xs"
      />
      <IconButton
        type="button"
        onMouseDown={(e) => { e.preventDefault(); toggleBlockType("ordered-list-item"); }}
        aria-label="OL"
        icon={<Icon.FaListOl className={isOLActive && "text-brand"} />}
        variant="text"
        size="xs"
      />
    </div>
  );

  const EditorWrapper = () => (
    <div
      className={`border rounded-b-md p-2 min-h-52 max-h-52 overflow-y-auto cursor-text relative ${
        isFocused
          ? "border-brand"
          : theme === "dark"
          ? "border-dark-text-disabled hover:border-dark-text-primary"
          : "border-light-text-disabled hover:border-light-text-primary"
      }`}
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
      <DraftEditor
        ref={editorRef}
        editorState={editorState}
        onChange={handleEditorChange}
        blockStyleFn={blockStyleFn}
        {...props}
      />
    </div>
  );

  return (
    <div
      ref={editorContainerRef}
      className={`rounded-md ${theme === "dark" ? "bg-dark-paper" : "bg-light-paper"} ${className}`}
    >
      <div>
        <Tools />
      </div>
      <div>
        <EditorWrapper />
      </div>
    </div>
  );
};

export default TextEditor;
