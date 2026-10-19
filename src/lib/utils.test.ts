// @vitest-environment node
import { describe, expect, it } from "vitest";

import { cn, padIndex } from "./utils";

describe("cn", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false, null, undefined, 0, "", "b")).toBe("a b");
  });

  it("supports clsx object and array syntax", () => {
    expect(cn(["a", ["b"]], { c: true, d: false })).toBe("a b c");
  });

  it("lets later Tailwind utilities override conflicting earlier ones", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("text-muted-foreground", "text-foreground")).toBe(
      "text-foreground",
    );
  });

  it("keeps project-specific font-size and colour utilities apart", () => {
    // Arbitrary font sizes and colour tokens are different groups: both survive.
    expect(cn("text-[14px]", "text-foreground")).toBe(
      "text-[14px] text-foreground",
    );
  });

  it("returns an empty string with no input", () => {
    expect(cn()).toBe("");
  });
});

describe("padIndex", () => {
  it.each([
    [0, "00"],
    [1, "01"],
    [9, "09"],
    [10, "10"],
    [99, "99"],
    [100, "100"],
  ])("pads %i to %s", (input, expected) => {
    expect(padIndex(input)).toBe(expected);
  });

  it("does not truncate or pad negative numbers to a misleading value", () => {
    expect(padIndex(-1)).toBe("-1");
  });
});
