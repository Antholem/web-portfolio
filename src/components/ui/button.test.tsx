import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button, buttonVariants } from "./button";

describe("Button", () => {
  it("renders a native button with the default variant and size", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveClass("bg-primary", "text-primary-foreground", "h-11");
  });

  // Variant classes are design-token utilities: the class *is* the contract here.
  it.each([
    ["default", ["bg-primary"]],
    ["secondary", ["bg-secondary", "text-secondary-foreground"]],
    ["outline", ["border-input", "bg-transparent"]],
    ["ghost", ["bg-transparent", "text-muted-foreground"]],
    ["link", ["underline", "h-auto", "p-0"]],
    ["destructive", ["bg-destructive-solid", "text-white"]],
  ] as const)("variant=%s uses its tokens", (variant, classes) => {
    render(<Button variant={variant}>x</Button>);
    expect(screen.getByRole("button")).toHaveClass(...classes);
  });

  it.each([
    ["default", "h-11"],
    ["sm", "h-9"],
    ["lg", "h-13"],
    ["icon", "size-10"],
    ["icon-sm", "size-9"],
  ] as const)("size=%s sets %s", (size, cls) => {
    render(
      <Button size={size} aria-label="x">
        x
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass(cls);
  });

  it("lets a caller's className override conflicting utilities", () => {
    render(
      <Button size="sm" className="h-8 px-2.5">
        x
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8", "px-2.5");
    expect(button).not.toHaveClass("h-9", "px-3.5");
  });

  it("composes onto its child with asChild (no nested button)", () => {
    render(
      <Button asChild variant="outline" size="sm">
        <a href="#contact">Let’s talk</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Let’s talk" });
    expect(link).toHaveAttribute("href", "#contact");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).toHaveClass("border-input", "h-9");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("fires onClick, and not when disabled", async () => {
    const user = userEvent.setup({ delay: null });
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is keyboard operable", async () => {
    const user = userEvent.setup({ delay: null });
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("passes through type and forwards its ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} type="submit">
        Send
      </Button>,
    );
    expect(ref.current).toBe(screen.getByRole("button"));
    expect(ref.current).toHaveAttribute("type", "submit");
  });

  it("exposes buttonVariants for non-button elements", () => {
    expect(buttonVariants({ variant: "ghost", size: "icon" })).toContain(
      "size-10",
    );
  });
});
