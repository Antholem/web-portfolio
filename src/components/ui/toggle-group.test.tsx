import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const OPTIONS = ["One", "Two", "Three"];

function Single({
  variant,
  onValueChange,
  initial = "One",
}: {
  variant?: "segmented" | "chip";
  onValueChange?: (value: string) => void;
  initial?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <ToggleGroup
      type="single"
      variant={variant}
      aria-label="Options"
      value={value}
      onValueChange={(next) => {
        onValueChange?.(next);
        setValue(next);
      }}
    >
      {OPTIONS.map((option) => (
        <ToggleGroupItem key={option} value={option}>
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

describe("ToggleGroup (single)", () => {
  it("renders a labelled radiogroup with one checked radio", () => {
    render(<Single />);
    expect(screen.getByRole("radiogroup", { name: "Options" })).toHaveAttribute(
      "data-slot",
      "toggle-group",
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "One" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Two" })).not.toBeChecked();
    for (const radio of radios) {
      expect(radio).toHaveAttribute("data-slot", "toggle-group-item");
    }
  });

  it("selects on click and reports the value", async () => {
    const user = userEvent.setup({ delay: null });
    const onValueChange = vi.fn();
    render(<Single onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "Two" }));
    expect(onValueChange).toHaveBeenLastCalledWith("Two");
    expect(screen.getByRole("radio", { name: "Two" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "One" })).not.toBeChecked();
  });

  it("reports an empty value when the active item is clicked again (callers must guard)", async () => {
    const user = userEvent.setup({ delay: null });
    const onValueChange = vi.fn();
    render(<Single onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "One" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("uses roving focus: Tab enters on the checked item, arrows move, Space selects", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <>
        <button type="button">before</button>
        <Single initial="Two" />
        <button type="button">after</button>
      </>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole("radio", { name: "Two" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Three" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "One" })).toHaveFocus(); // loops
    await user.keyboard("{End}");
    expect(screen.getByRole("radio", { name: "Three" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "One" })).toHaveFocus();

    // Focus alone does not select; Space/Enter do.
    expect(screen.getByRole("radio", { name: "Two" })).toBeChecked();
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "One" })).toBeChecked();

    // The whole group is one tab stop.
    await user.tab();
    expect(screen.getByRole("button", { name: "after" })).toHaveFocus();
  });

  it("applies the segmented variant by default and passes it to items", () => {
    render(<Single />);
    expect(screen.getByRole("radiogroup")).toHaveClass("bg-muted");
    expect(screen.getByRole("radio", { name: "One" })).toHaveClass(
      "rounded-lg",
      "data-[state=on]:bg-card",
    );
  });

  it("passes the chip variant to items through context", () => {
    render(<Single variant="chip" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("gap-2");
    expect(screen.getByRole("radio", { name: "One" })).toHaveClass(
      "rounded-full",
      "data-[state=on]:bg-foreground",
    );
  });

  it("skips disabled items", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ToggleGroup type="single" aria-label="Options" defaultValue="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b" disabled>
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "C" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "B" })).toBeDisabled();
  });
});

describe("ToggleGroup (multiple)", () => {
  it("renders pressed toggle buttons in a toolbar", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ToggleGroup type="multiple" aria-label="Styles">
        <ToggleGroupItem value="b">Bold</ToggleGroupItem>
        <ToggleGroupItem value="i">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("toolbar", { name: "Styles" })).toBeInTheDocument();
    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });
    await user.click(bold);
    await user.click(italic);
    expect(bold).toHaveAttribute("aria-pressed", "true");
    expect(italic).toHaveAttribute("aria-pressed", "true");
    await user.click(bold);
    expect(bold).toHaveAttribute("aria-pressed", "false");
  });
});
