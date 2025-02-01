import React from "react";
import * as Icon from "react-icons/fa";
import { Divider, IconButton, Select } from "./";
import { useThemeStore } from "../store/themeStore";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Heading } from "@tiptap/extension-heading";

const TextEditor = ({ placeholder, value, onChange }) => {
  const { theme } = useThemeStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({ placeholder }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
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

  const toggleRedo = (event) => {
    event.preventDefault();
    editor.chain().focus().redo().run();
  };

  const toggleUndo = (event) => {
    event.preventDefault();
    editor.chain().focus().undo().run();
  };

  const handleStyleChange = (event) => {
    switch (event.target.value) {
      case "heading-one":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading-two":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading-three":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "heading-four":
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case "heading-five":
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      case "heading-six":
        editor.chain().focus().toggleHeading({ level: 6 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
        break;
    }
  };

  const handleActiveStyle = () => {
    if (editor) {
      if (editor.isActive("heading", { level: 1 })) {
        return "heading-one";
      } else if (editor.isActive("heading", { level: 2 })) {
        return "heading-two";
      } else if (editor.isActive("heading", { level: 3 })) {
        return "heading-three";
      } else if (editor.isActive("heading", { level: 4 })) {
        return "heading-four";
      } else if (editor.isActive("heading", { level: 5 })) {
        return "heading-five";
      } else if (editor.isActive("heading", { level: 6 })) {
        return "heading-six";
      } else {
        return "paragraph";
      }
    }
    return "paragraph";
  };

  return (
    <div>
      <div
        className={`p-2 border-t border-r border-l rounded-t-md flex flex-wrap gap-1 ${theme === "dark"
          ? "bg-dark-paper border-dark-text-disabled"
          : "bg-light-paper border-light-text-disabled"}`}
      >
        <Select
          variant="flushed"
          size="sm"
          value={handleActiveStyle()}
          onChange={handleStyleChange}
        >
          <option value="paragraph">Normal</option>
          <option value="heading-one">Heading 1</option>
          <option value="heading-two">Heading 2</option>
          <option value="heading-three">Heading 3</option>
          <option value="heading-four">Heading 4</option>
          <option value="heading-five">Heading 5</option>
          <option value="heading-six">Heading 6</option>
        </Select>
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
        <Divider direction="vertical" />
        <IconButton
          onClick={toggleUndo}
          aria-label="Undo"
          icon={<Icon.FaUndo />}
          variant="text"
          size="xs"
          isDisabled={!editor.can().undo()}
        />
        <IconButton
          onClick={toggleRedo}
          aria-label="Redo"
          icon={<Icon.FaRedo />}
          variant="text"
          size="xs"
          isDisabled={!editor.can().redo()}
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
