import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMounted } from "./use-mounted";

function Probe() {
  return <span>{useMounted() ? "mounted" : "server"}</span>;
}

describe("useMounted", () => {
  it("is false during server rendering", () => {
    expect(renderToString(<Probe />)).toContain("server");
  });

  it("is true for a client-only render", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });

  it("hydrates with the server value, then flips to true without a mismatch", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Probe />);
    document.body.append(container);
    const onRecoverableError = vi.fn();

    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <Probe />, { onRecoverableError });
    });

    expect(container.textContent).toBe("mounted");
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();

    act(() => root.unmount());
    container.remove();
  });
});
