import React from "react";
import * as Icon from "react-icons/fa";
import { IconButton, OsCommand, Tooltip } from "../..";
import { useThemeStore } from "../../../store/themeStore";

const BottomBar = ({ editor, variant }) => {
  const { theme } = useThemeStore();

  if (!editor) return null;

  const toggleRedo = (event) => {
    event.preventDefault();
    editor.chain().focus().redo().run();
  };

  const toggleUndo = (event) => {
    event.preventDefault();
    editor.chain().focus().undo().run();
  };

  const baseStyles = "px-2 border-b border-r border-l rounded-b-md flex flex-wrap items-center justify-between gap-0";

  const variantStyles = {
    outline: theme === "dark"
      ? "bg-dark border-dark-text-disabled"
      : "bg-light border-light-text-disabled",

    filled: theme === "dark"
      ? "bg-dark-paper border-dark-text-disabled"
      : "bg-light-paper border-light-text-disabled", 
    
    flushed: theme === "dark"
      ? "bg-dark-paper border-dark-paper"
      : "bg-light-paper border-light-paper", 
  };

  const appliedVariantStyles = variantStyles[variant] || variantStyles["filled"];

  return (
    <div
      className={`${baseStyles} ${appliedVariantStyles}`}
    >
      <div className="flex flex-wrap items-center justify-center">
        <Tooltip
          placement="bottom"
          label={`Undo (${OsCommand()} + Z)`}
          ariaLabel="Tooltip Undo"
        >
          <IconButton
            onClick={toggleUndo}
            aria-label="Undo"
            icon={<Icon.FaUndo />}
            variant="ghost"
            size="xs"
            isDisabled={!editor.can().undo()}
          />
        </Tooltip>
        <Tooltip
          placement="bottom"
          label={`Redo (${OsCommand()} + Y)`}
          ariaLabel="Tooltip Redo"
        >
          <IconButton
            onClick={toggleRedo}
            aria-label="Redo"
            icon={<Icon.FaRedo />}
            variant="ghost"
            size="xs"
            isDisabled={!editor.can().redo()}
          />
        </Tooltip>
      </div>
      <div className="text-xs font-light">
        {editor.storage.characterCount.characters()} Characters
      </div>
    </div>
  );
};

export default BottomBar;
