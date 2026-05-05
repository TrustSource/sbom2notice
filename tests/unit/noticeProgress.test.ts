import { describe, it, expect } from "vitest";
import {
  computeProgress,
  isComponentComplete,
  isLicenseComplete,
} from "@/utils/noticeProgress";
import type { NoticeDoc } from "@/types/notice";

describe("isComponentComplete", () => {
  it("requires a name and either version or purl", () => {
    expect(isComponentComplete({ name: "x", version: "1.0" })).toBe(true);
    expect(isComponentComplete({ name: "x", purl: "pkg:npm/x@1" })).toBe(true);
    expect(isComponentComplete({ name: "x" })).toBe(false);
    expect(isComponentComplete({ name: "" } as never)).toBe(false);
  });
});

describe("isLicenseComplete", () => {
  it("requires id, name, text, and complete components", () => {
    expect(
      isLicenseComplete({
        licenseId: "MIT",
        name: "MIT",
        text: "...",
        components: [{ name: "x", version: "1" }],
      }),
    ).toBe(true);
  });

  it("rejects when text is missing", () => {
    expect(
      isLicenseComplete({
        licenseId: "MIT",
        name: "MIT",
        components: [{ name: "x", version: "1" }],
      }),
    ).toBe(false);
  });

  it("rejects when any component is incomplete", () => {
    expect(
      isLicenseComplete({
        licenseId: "MIT",
        name: "MIT",
        text: "...",
        components: [{ name: "x" }],
      }),
    ).toBe(false);
  });
});

describe("computeProgress", () => {
  const emptyDoc: NoticeDoc = {
    version: "1.0.0",
    completedPercent: 0,
    licenses: [],
  };

  it("returns 0 for empty docs", () => {
    expect(computeProgress(emptyDoc)).toEqual({
      totalComponents: 0,
      completeComponents: 0,
      licensesCount: 0,
      completeLicenses: 0,
      percent: 0,
      allComplete: false,
    });
  });

  it("computes partial completion as a rounded ratio", () => {
    const doc: NoticeDoc = {
      version: "1.0.0",
      completedPercent: 0,
      licenses: [
        {
          licenseId: "MIT",
          name: "MIT",
          text: "...",
          components: [
            { name: "a", version: "1" },
            { name: "b" },
            { name: "c", version: "1" },
          ],
        },
      ],
    };
    const p = computeProgress(doc);
    expect(p.totalComponents).toBe(3);
    expect(p.completeComponents).toBe(2);
    expect(p.percent).toBe(67);
    expect(p.allComplete).toBe(false);
  });

  it("returns 100 / allComplete=true when fully populated", () => {
    const doc: NoticeDoc = {
      version: "1.0.0",
      completedPercent: 0,
      licenses: [
        {
          licenseId: "MIT",
          name: "MIT",
          text: "license text",
          components: [{ name: "a", version: "1" }],
        },
      ],
    };
    const p = computeProgress(doc);
    expect(p.percent).toBe(100);
    expect(p.allComplete).toBe(true);
  });
});
