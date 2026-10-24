import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  sendContactMessage,
  type SendContactResult,
} from "@/app/actions/contact";
import { contact } from "@/lib/data";

import { ContactForm } from "./contact-form";

// The server action is the network boundary: replace it so no test can send.
vi.mock("@/app/actions/contact", () => ({ sendContactMessage: vi.fn() }));
const sendAction = vi.mocked(sendContactMessage);

// `sonner` is mocked for every unit test in vitest.setup.ts.
const toastMock = vi.mocked(toast);

/** A pending action result the test settles explicitly. */
function deferredResult() {
  let settle!: (result: SendContactResult) => void;
  let fail!: (error: Error) => void;
  sendAction.mockImplementationOnce(
    () =>
      new Promise<SendContactResult>((resolve, reject) => {
        settle = resolve;
        fail = reject;
      }),
  );
  return {
    resolve: (result: SendContactResult) => act(async () => settle(result)),
    reject: (error: Error) => act(async () => fail(error)),
  };
}

const fields = {
  name: () => screen.getByRole("textbox", { name: "Name" }),
  email: () => screen.getByRole("textbox", { name: "Email" }),
  message: () => screen.getByRole("textbox", { name: "Message" }),
  submit: () => screen.getByRole("button", { name: "Send message" }),
  refine: () => screen.getByRole("button", { name: /refine|refining/i }),
  subject: () => screen.getByRole("textbox", { name: "Subject" }),
};

function setup(options?: { fakeTimers?: boolean }) {
  if (options?.fakeTimers) {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  }
  const user = userEvent.setup(options?.fakeTimers ? { delay: null } : {});
  render(<ContactForm />);
  return user;
}

/**
 * The result's state (alert, errors) can commit a moment before the transition
 * ends and the button flips back from "Sending…", so wait for the button.
 */
const submitReady = () => screen.findByRole("button", { name: "Send message" });

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(fields.name(), "Jane Doe");
  await user.type(fields.email(), "jane@example.com");
  // Pasted: real input events, far fewer of them, so long flows stay quick.
  await user.click(fields.subject());
  await user.paste("Consulting");
  await user.click(fields.message());
  await user.paste("Let's work together");
}

describe("ContactForm", () => {
  beforeEach(() => {
    sendAction.mockReset();
    sendAction.mockResolvedValue({ ok: true });
  });

  it("renders labelled fields and a disabled refine action", () => {
    setup();
    expect(screen.getByRole("form", { name: "Contact form" })).toHaveAttribute(
      "novalidate",
    );
    expect(fields.name()).toHaveAttribute("autocomplete", "name");
    expect(fields.name()).toHaveAttribute("maxlength", "100");
    expect(fields.email()).toHaveAttribute("maxlength", "254");
    expect(fields.email()).toHaveAttribute("type", "email");
    expect(fields.email()).toHaveAttribute("autocomplete", "email");
    expect(fields.message()).toHaveAttribute(
      "maxlength",
      String(contact.messageMaxLength),
    );
    expect(fields.message()).toHaveAttribute(
      "placeholder",
      contact.messagePlaceholder,
    );

    expect(fields.subject()).toHaveValue("");
    expect(fields.subject()).toHaveAttribute("maxlength", "120");
    expect(fields.subject()).toHaveAttribute(
      "placeholder",
      contact.subjectPlaceholder,
    );
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(fields.refine()).toBeDisabled();
    expect(
      screen.getByText(`0 / ${contact.messageMaxLength}`),
    ).toBeInTheDocument();
  });

  it("shows every error, marks fields invalid and focuses the first one", async () => {
    const user = setup();
    await user.click(fields.submit());

    expect(fields.name()).toHaveFocus();
    expect(fields.name()).toBeInvalid();
    expect(fields.name()).toHaveAccessibleDescription("Tell me your name");
    expect(fields.email()).toHaveAccessibleDescription(
      "Enter a valid email address",
    );
    expect(fields.subject()).toHaveAccessibleDescription("Add a subject");
    expect(fields.message()).toHaveAccessibleDescription("Add a short message");
    expect(sendAction).not.toHaveBeenCalled();
  });

  it("focuses the first invalid field in form order", async () => {
    const user = setup();
    await user.type(fields.name(), "Jane");
    await user.click(fields.submit());
    expect(fields.email()).toHaveFocus();

    await user.type(fields.email(), "jane@example.com");
    await user.click(fields.submit());
    expect(fields.subject()).toHaveFocus();

    await user.type(fields.subject(), "Hello");
    await user.click(fields.submit());
    expect(fields.message()).toHaveFocus();
    expect(fields.subject()).not.toBeInvalid();
    expect(fields.name()).not.toBeInvalid();
    expect(fields.email()).not.toBeInvalid();
  });

  it("rejects a malformed email", async () => {
    const user = setup();
    await user.type(fields.name(), "Jane");
    await user.type(fields.email(), "jane@example");
    await user.type(fields.subject(), "Hello");
    await user.type(fields.message(), "Hi");
    await user.click(fields.submit());
    expect(fields.email()).toHaveFocus();
    expect(fields.email()).toHaveAccessibleDescription(
      "Enter a valid email address",
    );
  });

  it("clears only the edited field's error as the visitor types", async () => {
    const user = setup();
    await user.click(fields.submit());
    await user.type(fields.name(), "J");
    expect(fields.name()).not.toBeInvalid();
    expect(fields.name()).not.toHaveAccessibleDescription();
    expect(screen.queryByText("Tell me your name")).not.toBeInTheDocument();
    expect(fields.email()).toBeInvalid();
    expect(fields.message()).toBeInvalid();
  });

  it("caps the subject at its limit", async () => {
    const user = setup();
    await user.click(fields.subject());
    await user.paste("s".repeat(130));
    expect(fields.subject()).toHaveValue("s".repeat(120));
  });

  it("counts message characters", async () => {
    const user = setup();
    await user.type(fields.message(), "Hello");
    expect(
      screen.getByText(`5 / ${contact.messageMaxLength}`),
    ).toBeInTheDocument();
    expect(fields.refine()).toBeEnabled();
  });

  it("keeps refine disabled for a whitespace-only message", async () => {
    const user = setup();
    await user.type(fields.message(), "   ");
    expect(fields.refine()).toBeDisabled();
  });

  it("refines the message after the simulated latency", async () => {
    const user = setup({ fakeTimers: true });
    await user.type(fields.message(), "  hello    there ");
    await user.click(fields.refine());

    expect(fields.refine()).toHaveAccessibleName("Refining…");
    expect(fields.refine()).toBeDisabled();
    act(() => vi.advanceTimersByTime(1099));
    expect(fields.message()).toHaveValue("  hello    there ");

    act(() => vi.advanceTimersByTime(1));
    expect(fields.message()).toHaveValue("Hello there.");
    expect(fields.refine()).toHaveAccessibleName("Refined");
    expect(
      screen.getByText(`12 / ${contact.messageMaxLength}`),
    ).toBeInTheDocument();
  });

  it("cancels a pending refine when the visitor keeps typing", async () => {
    const user = setup({ fakeTimers: true });
    await user.type(fields.message(), "hello");
    await user.click(fields.refine());
    await user.type(fields.message(), " world");
    act(() => vi.advanceTimersByTime(2000));
    expect(fields.message()).toHaveValue("hello world");
    expect(fields.refine()).toHaveAccessibleName("Refine with AI");
  });

  it("returns to the idle label when a refined message is edited", async () => {
    const user = setup({ fakeTimers: true });
    await user.type(fields.message(), "hi");
    await user.click(fields.refine());
    act(() => vi.advanceTimersByTime(1100));
    expect(fields.refine()).toHaveAccessibleName("Refined");
    await user.type(fields.message(), "!");
    expect(fields.refine()).toHaveAccessibleName("Refine with AI");
  });

  it("clears the refine timer on unmount", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const user = userEvent.setup({ delay: null });
    const { unmount } = render(<ContactForm />);
    await user.type(fields.message(), "hello");
    await user.click(fields.refine());
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  // Was QA-08: refine used to push a full message to 1001 / 1000.
  it("never lets refine push the message past the character limit", async () => {
    const user = setup({ fakeTimers: true });
    const atLimit = "a".repeat(contact.messageMaxLength);
    await user.click(fields.message());
    await user.paste(atLimit);
    expect(fields.message()).toHaveValue(atLimit);
    await user.click(fields.refine());
    act(() => vi.advanceTimersByTime(1100));
    expect(
      (fields.message() as HTMLTextAreaElement).value.length,
    ).toBeLessThanOrEqual(contact.messageMaxLength);
    expect(
      screen.getByText(
        `${contact.messageMaxLength} / ${contact.messageMaxLength}`,
      ),
    ).toBeInTheDocument();
  });

  it("keeps paragraph breaks when refining", async () => {
    const user = setup({ fakeTimers: true });
    await user.click(fields.message());
    await user.paste("hi sam\n\nwe need   help");
    await user.click(fields.refine());
    act(() => vi.advanceTimersByTime(1100));
    expect(fields.message()).toHaveValue("Hi sam.\n\nWe need help.");
  });

  it("never deletes the visitor's own words to fit the limit", async () => {
    const user = setup({ fakeTimers: true });
    // Two unpunctuated paragraphs, exactly at the limit: refine adds 2 periods.
    const first = "x".repeat(495);
    const second = `${"y".repeat(498)}final`;
    const message = `${first}\n\n${second}`;
    expect(message).toHaveLength(contact.messageMaxLength);
    await user.click(fields.message());
    await user.paste(message);
    await user.click(fields.refine());
    act(() => vi.advanceTimersByTime(1100));
    expect((fields.message() as HTMLTextAreaElement).value).toContain("final");
  });
});

describe("ContactForm submission (server action mocked)", () => {
  beforeEach(() => {
    sendAction.mockReset();
    sendAction.mockResolvedValue({ ok: true });
    toastMock.success.mockClear();
    toastMock.error.mockClear();
  });

  it("sends the form values plus the (empty) honeypot to the action", async () => {
    const user = setup();
    await fillValidForm(user);
    await user.click(fields.submit());
    expect(sendAction).toHaveBeenCalledExactlyOnceWith({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Consulting",
      message: "Let's work together",
      website: "",
    });
  });

  it("shows a busy, disabled “Sending…” button while the action is pending", async () => {
    const user = setup();
    const pending = deferredResult();
    await fillValidForm(user);
    await user.click(fields.submit());

    const busy = screen.getByRole("button", { name: "Sending…" });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute("aria-busy", "true");
    expect(busy).toHaveAttribute("type", "submit");
    expect(busy.querySelector("svg")).toHaveClass("animate-spin");
    expect(screen.queryByRole("button", { name: "Send message" })).toBeNull();

    await pending.resolve({ ok: true });
    expect(screen.queryByRole("button", { name: "Sending…" })).toBeNull();
  });

  it("does not submit twice while a send is pending", async () => {
    const user = setup();
    const pending = deferredResult();
    await fillValidForm(user);
    await user.click(fields.submit());
    // Disabled button, Enter in a field, and a programmatic submit all no-op.
    await user.click(screen.getByRole("button", { name: "Sending…" }));
    await user.type(fields.name(), "{Enter}");
    fireEvent.submit(screen.getByRole("form", { name: "Contact form" }));
    expect(sendAction).toHaveBeenCalledTimes(1);
    await pending.resolve({ ok: true });
    expect(sendAction).toHaveBeenCalledTimes(1);
  });

  it("raises a success snackbar, clears the form and keeps focus on Send", async () => {
    const user = setup();
    await fillValidForm(user);
    await user.click(fields.submit());

    await vi.waitFor(() => expect(fields.submit()).toHaveFocus());
    expect(toastMock.success).toHaveBeenCalledExactlyOnceWith("Message sent", {
      description:
        "Thanks for reaching out — I’ll get back to you within two business days.",
    });
    expect(toastMock.error).not.toHaveBeenCalled();
    // No separate success card: the form stays, ready for another message.
    expect(screen.getByRole("form", { name: "Contact form" })).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(fields.name()).toHaveValue("");
    expect(fields.email()).toHaveValue("");
    expect(fields.message()).toHaveValue("");
    expect(fields.subject()).toHaveValue("");
    expect(fields.refine()).toHaveAccessibleName("Refine with AI");
    expect(fields.submit()).toBeEnabled();
  });

  it("can send a second message straight away", async () => {
    const user = setup();
    await fillValidForm(user);
    await user.click(fields.submit());
    await vi.waitFor(() => expect(fields.name()).toHaveValue(""));
    await fillValidForm(user);
    await user.click(await submitReady());
    await vi.waitFor(() => expect(toastMock.success).toHaveBeenCalledTimes(2));
    expect(sendAction).toHaveBeenCalledTimes(2);
  });

  it("submits with Enter from a text field", async () => {
    const user = setup();
    await fillValidForm(user);
    await user.type(fields.name(), "{Enter}");
    expect(sendAction).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(toastMock.success).toHaveBeenCalledOnce());
  });

  it.each([
    [{ email: "Enter a valid email address" }, "email"],
    [{ message: "Keep your message under 1000 characters" }, "message"],
    [
      {
        message: "Add a short message",
        name: "Keep your name under 100 characters",
      },
      "name",
    ],
  ] as const)(
    "shows server field errors %j and focuses the first invalid field",
    async (errors, focused) => {
      sendAction.mockResolvedValueOnce({ ok: false, errors });
      const user = setup();
      await fillValidForm(user);
      await user.click(fields.submit());

      await vi.waitFor(() => expect(fields[focused]()).toHaveFocus());
      for (const [field, text] of Object.entries(errors)) {
        const input = fields[field as "name" | "email" | "message"]();
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription(text);
      }
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(await submitReady()).toBeEnabled();
    },
  );

  it("clears a server field error as soon as the visitor edits that field", async () => {
    sendAction.mockResolvedValueOnce({
      ok: false,
      errors: { email: "Enter a valid email address" },
    });
    const user = setup();
    await fillValidForm(user);
    await user.click(fields.submit());
    await vi.waitFor(() => expect(fields.email()).toBeInvalid());
    await user.type(fields.email(), "m");
    expect(fields.email()).not.toBeInvalid();
  });

  it("raises an error snackbar when sending fails and keeps what the visitor typed", async () => {
    sendAction.mockResolvedValueOnce({ ok: false, error: "send-failed" });
    const user = setup();
    await fillValidForm(user);
    await user.click(fields.submit());

    await vi.waitFor(() => expect(toastMock.error).toHaveBeenCalledOnce());
    expect(toastMock.error).toHaveBeenCalledWith("Couldn’t send your message", {
      description: "Check your connection and try again.",
      duration: 6000,
    });
    expect(toastMock.success).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fields.name()).toHaveValue("Jane Doe");
    expect(fields.message()).toHaveValue("Let's work together");
    expect(fields.subject()).toHaveValue("Consulting");
    expect(await submitReady()).toBeEnabled();
  });

  it("raises a fresh snackbar for each failed attempt", async () => {
    sendAction.mockResolvedValue({ ok: false, error: "send-failed" });
    const user = setup();
    await fillValidForm(user);
    await user.click(fields.submit());
    await vi.waitFor(() => expect(toastMock.error).toHaveBeenCalledOnce());
    await user.click(await submitReady());
    await vi.waitFor(() => expect(toastMock.error).toHaveBeenCalledTimes(2));
    expect(sendAction).toHaveBeenCalledTimes(2);
  });

  it("sends the kept message on retry and then clears it", async () => {
    sendAction.mockResolvedValueOnce({ ok: false, error: "send-failed" });
    const user = setup();
    await fillValidForm(user);
    await user.click(fields.submit());
    await vi.waitFor(() => expect(toastMock.error).toHaveBeenCalledOnce());

    const retry = deferredResult();
    await user.click(await submitReady());
    expect(sendAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: "Let's work together" }),
    );
    await retry.resolve({ ok: true });
    expect(toastMock.success).toHaveBeenCalledOnce();
    expect(fields.message()).toHaveValue("");
  });


  it("passes a filled honeypot through to the action", async () => {
    const user = setup();
    const honeypot = document.querySelector<HTMLInputElement>(
      'input[name="website"]',
    )!;
    // Hidden from people and assistive tech; only a bot would fill it.
    expect(honeypot.closest("[hidden]")).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(
      screen.queryByRole("textbox", { name: "Website" }),
    ).not.toBeInTheDocument();

    fireEvent.change(honeypot, { target: { value: "https://spam.example" } });
    await fillValidForm(user);
    await user.click(fields.submit());
    expect(sendAction).toHaveBeenCalledWith(
      expect.objectContaining({ website: "https://spam.example" }),
    );
  });

  it("does not call the action when client-side validation fails", async () => {
    const user = setup();
    await user.type(fields.name(), "n");
    await user.click(fields.submit());
    expect(sendAction).not.toHaveBeenCalled();
    expect(fields.email()).toHaveFocus();
  });

  it("survives a network failure (the action promise rejects) with an error snackbar", async () => {
    const user = setup();
    const pending = deferredResult();
    await fillValidForm(user);
    await user.click(fields.submit());
    vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      await pending.reject(new TypeError("Failed to fetch"));
    } catch {
      // Today the rejection escapes act(); the assertions below say why
      // that matters to the visitor.
    }
    expect(
      screen.getByRole("form", { name: "Contact form" }),
    ).toBeInTheDocument();
    expect(toastMock.error).toHaveBeenCalledWith(
      "Couldn’t send your message",
      expect.anything(),
    );
    expect(fields.message()).toHaveValue("Let's work together");
  });
});
