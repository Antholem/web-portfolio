import React, { useState, useRef } from "react";
import * as Icon from "react-icons/fa";
import { Divider, IconButton, Select } from "../..";
import { useThemeStore } from "../../../store/themeStore";
import ColorPicker from "../ColorPicker";

const ToolBar = ({ editor }) => {
  const { theme } = useThemeStore();
  const [highlightColor, setHighlightColor] = useState(null);
  const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
  const [fontColor, setFontColor] = useState(null);
  const [showFontColorPicker, setShowFontColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

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
    editor.chain().focus().toggleCode().run();
  };

  const toggleBulletList = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleOrderedList().run();
  };

  const toggleAlignLeft = (event) => {
    event.preventDefault();
    editor.chain().focus().setTextAlign("left").run();
  };

  const toggleAlignCenter = (event) => {
    event.preventDefault();
    editor.chain().focus().setTextAlign("center").run();
  };

  const toggleAlignRight = (event) => {
    event.preventDefault();
    editor.chain().focus().setTextAlign("right").run();
  };

  const toggleUnderline = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleUnderline().run();
  };

  const toggleSubscript = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleSubscript().run();
    editor.chain().focus().unsetSuperscript().run();
  };

  const toggleSuperscript = (event) => {
    event.preventDefault();
    editor.chain().focus().toggleSuperscript().run()
    editor.chain().focus().unsetSubscript().run();
  };

  const toggleLiftItem = (event) => {
    event.preventDefault();
    editor.chain().focus().liftListItem("listItem").run();
  };

  const toggleSinkItem = (event) => {
    event.preventDefault();
    editor.chain().focus().sinkListItem("listItem").run();
  };

  const handleStyleChange = (option) => {
    if (!editor) return;

    switch (option) {
      case "heading-one":
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case "heading-two":
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case "heading-three":
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
      case "heading-four":
        editor.chain().focus().setHeading({ level: 4 }).run();
        break;
      case "heading-five":
        editor.chain().focus().setHeading({ level: 5 }).run();
        break;
      case "heading-six":
        editor.chain().focus().setHeading({ level: 6 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
        break;
    };
  };

  const handleActiveStyle = () => {
    if (!editor) return "paragraph";
    if (editor.isActive("heading", { level: 1 })) return "heading-one";
    if (editor.isActive("heading", { level: 2 })) return "heading-two";
    if (editor.isActive("heading", { level: 3 })) return "heading-three";
    if (editor.isActive("heading", { level: 4 })) return "heading-four";
    if (editor.isActive("heading", { level: 5 })) return "heading-five";
    if (editor.isActive("heading", { level: 6 })) return "heading-six";

    return "paragraph";
  };

  const toggleHighlightColorPicker = (event) => {
    event.preventDefault();
    setShowHighlightColorPicker((prev) => !prev);
  };

  const handleHighlightColorChange = (color) => {
    setHighlightColor(color.hex);
    editor.chain().focus().toggleHighlight({ color: color.hex }).run();
    setShowHighlightColorPicker(false);
  };

  const toggleFontColorPicker = (event) => {
    event.preventDefault();
    setShowFontColorPicker((prev) => !prev);
  };

  const handleFontColorChange = (color) => {
    setFontColor(color.hex);
    editor.chain().focus().setColor(color.hex).run();
    setShowFontColorPicker(false);
  };
  
  return (
    <div
        className={`p-2 border-t border-r border-l rounded-t-md flex flex-wrap gap-1 ${theme === "dark"
          ? "bg-dark-paper border-dark-text-disabled"
          : "bg-light-paper border-light-text-disabled"
          }`}
      >
        <Select 
          onChange={handleStyleChange} 
          value={handleActiveStyle()} 
          variant="unstyled" 
          size="xs"
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading-one">Heading 1</option>
          <option value="heading-two">Heading 2</option>
          <option value="heading-three">Heading 3</option>
          <option value="heading-four">Heading 4</option>
          <option value="heading-five">Heading 5</option>
          <option value="heading-six">Heading 6</option>
        </Select>
        <Divider direction="vertical" />
        <div className="relative">
            <IconButton
            onClick={toggleHighlightColorPicker}
            aria-label="Highlight"
            icon={<Icon.FaHighlighter style={{ color: editor.getAttributes("highlight")?.color }} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
            />
            {showHighlightColorPicker && (
            <div className="absolute z-10">
                <ColorPicker
                ref={colorPickerRef}
                color={highlightColor}
                onChange={handleHighlightColorChange}
                />
            </div>
            )}
        </div>
        <div className="relative">
            <IconButton
            onClick={toggleFontColorPicker}
            aria-label="FontColor"
            icon={<Icon.FaFont style={{ color: editor.getAttributes("textStyle").color }} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
            />
            {showFontColorPicker && (
            <div className="absolute z-10">
                <ColorPicker
                ref={colorPickerRef}
                color={fontColor}
                onChange={handleFontColorChange}
                />
            </div>
            )}
        </div>
        <IconButton
            onClick={toggleBold}
            aria-label="Bold"
            icon={<Icon.FaBold className={`${editor.isActive("bold") && "text-brand"}`} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
        />
        <IconButton
            onClick={toggleItalic}
            aria-label="Italic"
            icon={<Icon.FaItalic className={`${editor.isActive("italic") && "text-brand"}`} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
        />
        <IconButton
            onClick={toggleUnderline}
            aria-label="Underline"
            icon={<Icon.FaUnderline className={`${editor.isActive("underline") && "text-brand"}`} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
        />
        <IconButton
            onClick={toggleStrike}
            aria-label="Strike"
            icon={<Icon.FaStrikethrough className={`${editor.isActive("strike") && "text-brand"}`} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
        />
        <Divider direction="vertical" />
        <IconButton
            onClick={toggleCode}
            aria-label="Code"
            icon={<Icon.FaCode className={`${editor.isActive("code") && "text-brand"}`} />}
            variant="text"
            size="xs"
        />
        <IconButton
            onClick={toggleSubscript}
            aria-label="Subscript"
            icon={<Icon.FaSubscript className={`${editor.isActive("subscript") && "text-brand"}`} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
        />
        <IconButton
            onClick={toggleSuperscript}
            aria-label="Superscript"
            icon={<Icon.FaSuperscript className={`${editor.isActive("superscript") && "text-brand"}`} />}
            variant="text"
            size="xs"
            isDisabled={editor.isActive("code")}
        />
        <Divider direction="vertical" />
        <IconButton
            onClick={toggleBulletList}
            aria-label="Bullet List"
            icon={<Icon.FaListUl className={`${editor.isActive("bulletList") && "text-brand"}`} />}
            variant="text"
            size="xs"
        />
        <IconButton
            onClick={toggleOrderedList}
            aria-label="Ordered List"
            icon={<Icon.FaListOl className={`${editor.isActive("orderedList") && "text-brand"}`} />}
            variant="text"
            size="xs"
        />
        <IconButton
            onClick={toggleLiftItem}
            aria-label="Lift List"
            icon={<Icon.FaOutdent />}
            variant="text"
            size="xs"
            isDisabled={!editor.can().liftListItem("listItem")}
        />
        <IconButton
            onClick={toggleSinkItem}
            aria-label="Sink List"
            icon={<Icon.FaIndent />}
            variant="text"
            size="xs"
            isDisabled={!editor.can().sinkListItem("listItem")}
        />
        <Divider direction="vertical" />
        <IconButton
            onClick={toggleAlignLeft}
            aria-label="Align Left"
            icon={<Icon.FaAlignLeft className={`${editor.isActive({ textAlign: "left" }) && "text-brand"}`} />}
            variant="text"
            size="xs"
        />
        <IconButton
            onClick={toggleAlignCenter}
            aria-label="Align Center"
            icon={<Icon.FaAlignCenter className={`${editor.isActive({ textAlign: "center" }) && "text-brand"}`} />}
            variant="text"
            size="xs"
        />
        <IconButton
            onClick={toggleAlignRight}
            aria-label="Align Right"
            icon={<Icon.FaAlignRight className={`${editor.isActive({ textAlign: "right" }) && "text-brand"}`} />}
            variant="text"
            size="xs"
        />
    </div>
  );
};

export default ToolBar;
