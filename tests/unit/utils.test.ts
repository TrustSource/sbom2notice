import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges plain class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", false && "skip", undefined, null, "bar")).toBe("foo bar");
  });

  it("dedupes conflicting tailwind utilities (later wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm text-lg")).toBe("text-lg");
  });

  it("handles arrays and objects via clsx", () => {
    expect(cn(["foo", { bar: true, baz: false }])).toBe("foo bar");
  });
});
