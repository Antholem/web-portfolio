"use client";

import { useEffect } from "react";

const MAX_FRAMES = 20;

// Shared links can carry a malformed fragment such as "#100%".
const decodeFragment = (fragment: string) => {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
};
const STABLE_FRAMES = 3;

function isAligned(target: HTMLElement) {
  const top = target.getBoundingClientRect().top;
  const atBottom =
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight - 1;
  return Math.abs(top) <= 1 || (atBottom && top > 0);
}

/**
 * Sections below the fold use `content-visibility: auto`, so the browser
 * resolves an anchor jump against placeholder heights; as the sections it
 * passes render at their real size, the target drifts. Re-align for a few
 * frames after a jump, and stop as soon as the visitor scrolls themselves.
 */
function AnchorScrollSettler() {
  useEffect(() => {
    let frame = 0;
    const cancel = () => cancelAnimationFrame(frame);

    const settle = (id: string) => {
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      cancel();
      let remaining = MAX_FRAMES;
      let stable = 0;
      const tick = () => {
        if (isAligned(target)) {
          if (++stable >= STABLE_FRAMES) return;
        } else {
          stable = 0;
          target.scrollIntoView({ block: "start" });
        }
        if (--remaining > 0) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const href = (event.target as Element | null)
        ?.closest?.('a[href^="#"]')
        ?.getAttribute("href");
      if (href) settle(decodeFragment(href.slice(1)));
    };
    const onHashChange = () =>
      settle(decodeFragment(window.location.hash.slice(1)));

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    if (window.location.hash) onHashChange();

    return () => {
      cancel();
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, []);

  return null;
}

export { AnchorScrollSettler };
