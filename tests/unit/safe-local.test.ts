import { describe, it, expect, beforeEach, vi } from "vitest";
import { safeGet, safeSet, safeRemove, safeSetDebounced } from "@/lib/safe-local";

describe("safe-local (browser env)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("safeGet returns null for missing keys", () => {
    expect(safeGet("missing")).toBeNull();
  });

  it("safeSet then safeGet round-trips a value", () => {
    safeSet("k", "v");
    expect(safeGet("k")).toBe("v");
  });

  it("safeRemove deletes a stored value", () => {
    safeSet("k", "v");
    safeRemove("k");
    expect(safeGet("k")).toBeNull();
  });

  it("safeSetDebounced writes after the debounce window", () => {
    vi.useFakeTimers();
    safeSetDebounced("k", "v", 100);
    expect(safeGet("k")).toBeNull();
    vi.advanceTimersByTime(150);
    expect(safeGet("k")).toBe("v");
  });

  it("safeSetDebounced coalesces rapid writes", () => {
    vi.useFakeTimers();
    safeSetDebounced("k", "first", 100);
    safeSetDebounced("k", "second", 100);
    safeSetDebounced("k", "final", 100);
    vi.advanceTimersByTime(150);
    expect(safeGet("k")).toBe("final");
  });

  it("swallows storage errors instead of throwing", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => safeSet("k", "v")).not.toThrow();
    spy.mockRestore();
  });
});
