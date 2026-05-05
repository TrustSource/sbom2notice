import { describe, it, expect } from "vitest";
import { detectSbomKind, validateSbom } from "@/utils/sbomValidators";
import {
  cycloneDxBasic,
  spdxBasic,
  spdxEmpty,
  garbage,
} from "./fixtures/sboms";

describe("detectSbomKind", () => {
  it("identifies CycloneDX by bomFormat", () => {
    expect(detectSbomKind(cycloneDxBasic)).toBe("cyclonedx");
  });

  it("identifies SPDX by spdxVersion", () => {
    expect(detectSbomKind(spdxBasic)).toBe("spdx");
  });

  it("returns null for unknown shape", () => {
    expect(detectSbomKind(garbage)).toBeNull();
  });

  it("returns null for null/undefined/primitives", () => {
    expect(detectSbomKind(null)).toBeNull();
    expect(detectSbomKind(undefined)).toBeNull();
    expect(detectSbomKind("string")).toBeNull();
    expect(detectSbomKind(42)).toBeNull();
  });
});

describe("validateSbom", () => {
  it("accepts a valid CycloneDX document", () => {
    const result = validateSbom(cycloneDxBasic);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.kind).toBe("cyclonedx");
      expect(result.data.bomFormat).toBe("CycloneDX");
    }
  });

  it("accepts a valid SPDX document", () => {
    const result = validateSbom(spdxBasic);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.kind).toBe("spdx");
      expect(result.data.spdxVersion).toBe("SPDX-2.3");
    }
  });

  it("accepts an empty SPDX document with packages array", () => {
    const result = validateSbom(spdxEmpty);
    expect(result.ok).toBe(true);
  });

  it("rejects unknown formats with descriptive error", () => {
    const result = validateSbom(garbage);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/unsupported|unknown/i);
    }
  });

  it("rejects CycloneDX missing required fields", () => {
    // bomFormat present but specVersion missing → schema rejects
    const broken = { bomFormat: "CycloneDX" };
    const result = validateSbom(broken);
    expect(result.ok).toBe(false);
  });
});
