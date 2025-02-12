import React from "react";
import * as Icon from "react-icons/fa";
import { IconButton } from "..";
import { useThemeStore } from "../../store/themeStore";

const BottomBar = ({ onUndo, isUndoDisabled, onRedo, isRedoDisabled, characterCount }) => {
  const { theme } = useThemeStore();

  return (
    <div
      className={`px-2 border-b border-r border-l rounded-b-md flex flex-wrap items-center justify-between gap-0 ${
        theme === "dark" ? "bg-dark-paper border-dark-text-disabled" : "bg-light-paper border-light-text-disabled"
      }`}
    >
      <div className="flex flex-wrap items-center justify-center">
        <IconButton
          onClick={onUndo}
          aria-label="Undo"
          icon={<Icon.FaUndo />}
          variant="text"
          size="xs"
          isDisabled={isUndoDisabled}
        />
        <IconButton
          onClick={onRedo}
          aria-label="Redo"
          icon={<Icon.FaRedo />}
          variant="text"
          size="xs"
          isDisabled={isRedoDisabled}
        />
      </div>
      <div className="text-xs font-light">{characterCount} Characters</div>
    </div>
  );
};

export default BottomBar;
