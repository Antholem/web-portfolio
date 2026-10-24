import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AnchorScrollSettler } from "./anchor-scroll-settler";

/**
 * jsdom has no layout, so each target reports a programmable `top`, and
 * `scrollIntoView` (the settler's correction) snaps it to 0 unless told to
 * keep drifting, like content-visibility sections rendering above it.
 */
function addTarget(id: string, { top = 400, drift = false } = {}) {
  const el = document.createElement("section");
  el.id = id;
  let current = top;
  el.getBoundingClientRect = () =>
    DOMRect.fromRect({ y: current, height: 800 });
  const scrollIntoView = vi.fn(() => {
    current = drift ? current - 1 + 50 : 0;
  });
  el.scrollIntoView = scrollIntoView;
  document.body.append(el);
  return {
    el,
    scrollIntoView,
    setTop: (value: number) => (current = value),
  };
}

function addLink(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = "link";
  const span = document.createElement("span");
  a.append(span);
  document.body.append(a);
  return { a, span };
}

const frame = (count = 1) =>
  act(() => {
    for (let i = 0; i < count; i++) vi.advanceTimersToNextFrame();
  });

describe("AnchorScrollSettler", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["requestAnimationFrame", "cancelAnimationFrame"],
    });
    window.history.replaceState(null, "", "/");
    // Not at the bottom of the page unless a test says so.
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 100_000,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    // @ts-expect-error -- drop the per-test override
    delete document.documentElement.scrollHeight;
  });

  it("renders nothing", () => {
    const { container } = render(<AnchorScrollSettler />);
    expect(container).toBeEmptyDOMElement();
  });

  it("re-aligns the target after an in-page link click, then stops once stable", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("contact", { top: 458 });
    fireEvent.click(addLink("#contact").a);

    expect(target.scrollIntoView).not.toHaveBeenCalled(); // waits a frame
    frame();
    expect(target.scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      block: "start",
    });
    frame(10);
    // Aligned after the first correction: three stable frames and it is done.
    expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("corrects again if the target drifts after aligning", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("work", { top: 300 });
    fireEvent.click(addLink("#work").a);
    frame(); // corrected to 0
    frame(); // stable 1
    target.setTop(120); // a section above finished rendering
    frame();
    expect(target.scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("handles clicks on elements inside the link", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("about");
    fireEvent.click(addLink("#about").span);
    frame();
    expect(target.scrollIntoView).toHaveBeenCalled();
  });

  it("gives up after 20 frames if the target never settles", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("stack", { drift: true });
    fireEvent.click(addLink("#stack").a);
    frame(40);
    expect(target.scrollIntoView).toHaveBeenCalledTimes(20);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("accepts a target below the top when the page cannot scroll further", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: window.innerHeight,
    });
    render(<AnchorScrollSettler />);
    const target = addTarget("contact", { top: 300 });
    fireEvent.click(addLink("#contact").a);
    frame(5);
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  it.each([
    ["middle button", { button: 1 }],
    ["Ctrl", { ctrlKey: true }],
    ["Cmd", { metaKey: true }],
    ["Shift", { shiftKey: true }],
    ["Alt", { altKey: true }],
  ])("ignores %s clicks (new tab / window / download)", (_, init) => {
    render(<AnchorScrollSettler />);
    const target = addTarget("contact");
    fireEvent.click(addLink("#contact").a, init);
    frame(5);
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  it("ignores clicks another handler already cancelled", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("contact");
    const { a } = addLink("#contact");
    a.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(a);
    frame(5);
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  it.each([
    "/about",
    "https://github.com/Antholem",
    "mailto:x@y.z",
    "#",
    "#top",
  ])(
    "ignores links that are not to an existing in-page target (%s)",
    (href) => {
      render(<AnchorScrollSettler />);
      const target = addTarget("about");
      fireEvent.click(addLink(href).a);
      frame(5);
      expect(target.scrollIntoView).not.toHaveBeenCalled();
    },
  );

  it("decodes percent-encoded fragments", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("café");
    fireEvent.click(addLink("#caf%C3%A9").a);
    frame();
    expect(target.scrollIntoView).toHaveBeenCalled();
  });

  it("settles on hashchange (back/forward, typed URLs)", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("services");
    act(() => {
      window.history.replaceState(null, "", "/#services");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    frame();
    expect(target.scrollIntoView).toHaveBeenCalled();
  });

  it("settles on mount when the page loads with a hash", () => {
    const target = addTarget("work");
    window.history.replaceState(null, "", "/#work");
    render(<AnchorScrollSettler />);
    frame();
    expect(target.scrollIntoView).toHaveBeenCalled();
  });

  it.each([
    ["wheel", () => fireEvent.wheel(window)],
    ["touchstart", () => fireEvent.touchStart(window)],
    ["keydown", () => fireEvent.keyDown(window, { key: "ArrowDown" })],
  ])("stops correcting as soon as the visitor scrolls (%s)", (_, scroll) => {
    render(<AnchorScrollSettler />);
    const target = addTarget("stack", { drift: true });
    fireEvent.click(addLink("#stack").a);
    frame(2);
    expect(target.scrollIntoView).toHaveBeenCalledTimes(2);
    act(scroll);
    frame(10);
    expect(target.scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("restarts for a new jump, cancelling the previous one", () => {
    render(<AnchorScrollSettler />);
    const first = addTarget("about", { drift: true });
    const second = addTarget("contact");
    fireEvent.click(addLink("#about").a);
    frame(2);
    fireEvent.click(addLink("#contact").a);
    frame(10);
    expect(first.scrollIntoView).toHaveBeenCalledTimes(2);
    expect(second.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("removes its listeners and pending frame on unmount", () => {
    const { unmount } = render(<AnchorScrollSettler />);
    const target = addTarget("contact", { drift: true });
    fireEvent.click(addLink("#contact").a);
    frame();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(addLink("#contact").a);
    act(() => {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    frame(5);
    expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("tolerates a malformed percent-encoded hash on load", () => {
    window.history.replaceState(null, "", "/#100%");
    expect(() => render(<AnchorScrollSettler />)).not.toThrow();
  });
});

describe("AnchorScrollSettler with smooth scrolling", () => {
  // jsdom delivers the click's hashchange via a (faked) timer; a browser
  // delivers it right away, before the visitor could scroll.
  const deliverHashChange = () => act(() => vi.advanceTimersByTime(1));

  const scrollEnd = () =>
    act(() => {
      window.dispatchEvent(new Event("scrollend"));
    });

  beforeEach(() => {
    // The suite above leaves rAF-only fake timers installed; re-install so
    // setTimeout (the scrollend fallback) is faked too.
    vi.useRealTimers();
    vi.useFakeTimers({
      toFake: [
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "setTimeout",
        "clearTimeout",
      ],
    });
    window.history.replaceState(null, "", "/");
    document.documentElement.style.scrollBehavior = "smooth";
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 100_000,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.style.scrollBehavior = "";
    // @ts-expect-error -- drop the per-test override
    delete document.documentElement.scrollHeight;
    vi.useRealTimers();
  });

  it("does not interrupt the glide: waits for scrollend before correcting", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("contact", { top: 458 });
    fireEvent.click(addLink("#contact").a);
    frame(10);
    expect(target.scrollIntoView).not.toHaveBeenCalled();
    scrollEnd();
    expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("does nothing more once the glide lands aligned", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("about", { top: 0 });
    fireEvent.click(addLink("#about").a);
    scrollEnd();
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  it("corrects at most three times if the target keeps drifting", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("stack", { drift: true });
    fireEvent.click(addLink("#stack").a);
    for (let i = 0; i < 6; i++) scrollEnd();
    expect(target.scrollIntoView).toHaveBeenCalledTimes(3);
  });

  it("falls back to a timer when scrollend never fires", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("work", { top: 300 });
    fireEvent.click(addLink("#work").a);
    deliverHashChange();
    act(() => vi.advanceTimersByTime(1200));
    expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("a jump to #top cancels a pending settle instead of pulling back", () => {
    render(<AnchorScrollSettler />);
    const contact = addTarget("contact", { top: 300 });
    fireEvent.click(addLink("#contact").a);
    deliverHashChange();
    fireEvent.click(addLink("#top").a);
    deliverHashChange();
    scrollEnd();
    act(() => vi.advanceTimersByTime(2000));
    expect(contact.scrollIntoView).not.toHaveBeenCalled();
  });

  it("stops waiting when the visitor scrolls themselves", () => {
    render(<AnchorScrollSettler />);
    const target = addTarget("services", { top: 300 });
    fireEvent.click(addLink("#services").a);
    deliverHashChange();
    fireEvent.wheel(window);
    scrollEnd();
    act(() => vi.advanceTimersByTime(2000));
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });
});
