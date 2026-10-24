"use client";

import { useEffect } from "react";

const MAX_FRAMES = 20;
const STABLE_FRAMES = 3;
const MAX_SMOOTH_CORRECTIONS = 3;
// Fallback when `scrollend` never fires (no scroll needed, or no support).
const SCROLL_END_FALLBACK_MS = 1200;

// Shared links can carry a malformed fragment such as "#100%".
const decodeFragment = (fragment: string) => {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
};

function isAligned(target: HTMLElement) {
  const top = target.getBoundingClientRect().top;
  const atBottom =
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight - 1;
  return Math.abs(top) <= 1 || (atBottom && top > 0);
}

const smoothScrolling = () =>
  getComputedStyle(document.documentElement).scrollBehavior === "smooth";

/** Calls `done` once the current scroll settles; returns a canceller. */
function afterScrollEnd(done: () => void) {
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    window.removeEventListener("scrollend", finish);
    clearTimeout(timer);
    done();
  };
  window.addEventListener("scrollend", finish);
  const timer = setTimeout(finish, SCROLL_END_FALLBACK_MS);
  return () => {
    finished = true;
    window.removeEventListener("scrollend", finish);
    clearTimeout(timer);
  };
}

/**
 * Sections below the fold use `content-visibility: auto`, so the browser
 * resolves an anchor jump against placeholder heights; as the sections it
 * passes render at their real size, the target drifts.
 *
 * Instant scrolling: re-align for a few frames after the jump.
 * Smooth scrolling: re-aligning every frame would restart the glide, so wait
 * for it to finish (`scrollend`) and glide again if it landed short.
 * Either way, stop as soon as the visitor scrolls themselves.
 */
function AnchorScrollSettler() {
  useEffect(() => {
    let frame = 0;
    let cancelScrollWait = () => {};
    const cancel = () => {
      cancelAnimationFrame(frame);
      cancelScrollWait();
    };

    const settleInstantly = (target: HTMLElement) => {
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

    const settleSmoothly = (target: HTMLElement) => {
      let corrections = 0;
      const check = () => {
        if (isAligned(target) || corrections++ >= MAX_SMOOTH_CORRECTIONS)
          return;
        target.scrollIntoView({ block: "start" });
        cancelScrollWait = afterScrollEnd(check);
      };
      cancelScrollWait = afterScrollEnd(check);
    };

    const settle = (id: string) => {
      // Any new jump supersedes a pending settle — including ones with no
      // target (#top), or the old one would pull the page back when it ends.
      cancel();
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      if (smoothScrolling()) settleSmoothly(target);
      else settleInstantly(target);
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
