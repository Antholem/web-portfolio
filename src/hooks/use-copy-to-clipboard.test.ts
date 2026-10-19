import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCopyToClipboard } from "./use-copy-to-clipboard";

function stubClipboard(writeText: (text: string) => Promise<void>) {
  const spy = vi.fn(writeText);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: spy },
  });
  return spy;
}

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    // @ts-expect-error -- remove the per-test stub
    delete navigator.clipboard;
  });

  it("starts idle: neither copied nor failed", () => {
    stubClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current).toEqual({
      copied: false,
      failed: false,
      copy: expect.any(Function),
    });
  });

  it("writes the text, flags success and resets after the default 1600ms", async () => {
    const writeText = stubClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.copy("hello@example.com");
    });

    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledExactlyOnceWith("hello@example.com");
    expect(result.current.copied).toBe(true);
    expect(result.current.failed).toBe(false);

    act(() => vi.advanceTimersByTime(1599));
    expect(result.current.copied).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.copied).toBe(false);
  });

  it("honours a custom reset delay", async () => {
    stubClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard(300));
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current.copied).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.copied).toBe(false);
  });

  it("restarts the reset timer on a repeat copy", async () => {
    stubClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard(1000));
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => vi.advanceTimersByTime(800));
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => vi.advanceTimersByTime(800));
    expect(result.current.copied).toBe(true);
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(200));
    expect(result.current.copied).toBe(false);
  });

  it("returns false and flags failure (then resets) when the clipboard rejects", async () => {
    stubClipboard(() => Promise.reject(new DOMException("denied")));
    const { result } = renderHook(() => useCopyToClipboard());
    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.copy("x");
    });
    expect(ok).toBe(false);
    expect(result.current.copied).toBe(false);
    expect(result.current.failed).toBe(true);

    act(() => vi.advanceTimersByTime(1600));
    expect(result.current.failed).toBe(false);
  });

  it("flags failure when the Clipboard API is unavailable (insecure context)", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.copy("x");
    });
    expect(ok).toBe(false);
    expect(result.current.failed).toBe(true);
  });

  it("a success after a failure clears the failure (and vice versa)", async () => {
    let fail = true;
    stubClipboard(() =>
      fail ? Promise.reject(new Error("denied")) : Promise.resolve(),
    );
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current).toMatchObject({ copied: false, failed: true });

    fail = false;
    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current).toMatchObject({ copied: true, failed: false });
    expect(vi.getTimerCount()).toBe(1);

    fail = true;
    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current).toMatchObject({ copied: false, failed: true });
    expect(vi.getTimerCount()).toBe(1);
  });

  it("keeps a stable copy function across renders", () => {
    stubClipboard(() => Promise.resolve());
    const { result, rerender } = renderHook(() => useCopyToClipboard());
    const first = result.current.copy;
    rerender();
    expect(result.current.copy).toBe(first);
  });

  it("clears its pending reset timer on unmount", async () => {
    stubClipboard(() => Promise.resolve());
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("x");
    });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  // Was QA-10: a timer was scheduled after unmount.
  it.each([
    ["resolves", true],
    ["rejects", false],
  ] as const)(
    "schedules nothing if unmounted before the write %s",
    async (_, succeeds) => {
      let resolve!: () => void;
      let reject!: (error: Error) => void;
      stubClipboard(
        () =>
          new Promise<void>((res, rej) => {
            resolve = res;
            reject = rej;
          }),
      );
      const { result, unmount } = renderHook(() => useCopyToClipboard());
      let pending!: Promise<boolean>;
      act(() => {
        pending = result.current.copy("x");
      });
      unmount();
      const errors = vi.spyOn(console, "error").mockImplementation(() => {});
      await act(async () => {
        if (succeeds) resolve();
        else reject(new Error("denied"));
        await expect(pending).resolves.toBe(succeeds);
      });
      expect(vi.getTimerCount()).toBe(0);
      expect(errors).not.toHaveBeenCalled();
    },
  );
});
