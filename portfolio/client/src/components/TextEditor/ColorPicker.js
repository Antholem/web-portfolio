import React, { forwardRef } from "react";
import { useThemeStore } from "../../store/themeStore";
import Compact from '@uiw/react-color-compact';

const ColorPicker = forwardRef(({ color, onChange }, ref) => {
    const { theme } = useThemeStore();

    return (
      <Compact
        ref={ref}
        color={color}
        onChange={onChange}
        style={{
          backgroundColor: theme === "dark" ? "#1A1A1A" : "#ffffff",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
        }}
      />
    );
});

export default ColorPicker;
