import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Card } from "./card";
import { Field, FieldError } from "./field";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

describe("Card", () => {
  it("renders a div slot with surface tokens", () => {
    render(<Card data-testid="card">body</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveClass("bg-card", "border-border");
    expect(card).not.toHaveClass("hover:border-input");
  });

  it("adds the hover affordance only when interactive", () => {
    render(
      <Card interactive data-testid="card">
        body
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("hover:border-input");
  });

  it("composes onto a semantic child with asChild", () => {
    render(
      <ul>
        <Card asChild className="p-6">
          <li>item</li>
        </Card>
      </ul>,
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("data-slot", "card");
    expect(item).toHaveClass("p-6", "bg-card");
  });
});

describe("Field / FieldError", () => {
  it("renders the field wrapper", () => {
    render(<Field data-testid="field">x</Field>);
    expect(screen.getByTestId("field")).toHaveAttribute("data-slot", "field");
  });

  it.each([undefined, null, "", false])(
    "renders nothing without a message (%j)",
    (message) => {
      const { container } = render(
        <FieldError id="e">{message as string}</FieldError>,
      );
      expect(container).toBeEmptyDOMElement();
    },
  );

  it("renders the message with a decorative icon", () => {
    render(<FieldError id="name-error">Tell me your name</FieldError>);
    const error = screen.getByText("Tell me your name");
    expect(error).toHaveAttribute("id", "name-error");
    expect(error.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(error).toHaveClass("text-destructive");
  });
});

describe("Input", () => {
  it("is labelled, typed into and forwards its ref", async () => {
    const user = userEvent.setup({ delay: null });
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" ref={ref} onChange={onChange} />
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("data-slot", "input");
    await user.type(input, "a@b.co");
    expect(input).toHaveValue("a@b.co");
    expect(onChange).toHaveBeenCalledTimes(6);
  });

  it("exposes invalid and disabled states", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Input aria-label="Name" aria-invalid disabled />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toBeInvalid();
    expect(input).toBeDisabled();
    expect(input).toHaveClass("aria-invalid:border-destructive");
    await user.type(input, "nope");
    expect(input).toHaveValue("");
  });
});

describe("Textarea", () => {
  it("respects maxLength and forwards its ref", async () => {
    const user = userEvent.setup({ delay: null });
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Message" maxLength={5} ref={ref} />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    expect(ref.current).toBe(textarea);
    await user.type(textarea, "1234567");
    expect(textarea).toHaveValue("12345");
  });

  it("keeps multi-line input", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Textarea aria-label="Message" />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    await user.type(textarea, "a{Enter}b");
    expect(textarea).toHaveValue("a\nb");
  });
});

describe("Label", () => {
  it("renders a <label> that focuses its control on click", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    );
    const label = screen.getByText("Name");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("data-slot", "label");
    await user.click(label);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();
  });

  it("prevents text selection on double-click", () => {
    render(<Label htmlFor="n">Name</Label>);
    const notCancelled = fireEvent.mouseDown(screen.getByText("Name"), {
      detail: 2,
    });
    expect(notCancelled).toBe(false);
  });
});
