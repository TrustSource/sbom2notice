import { describe, it, expect } from "vitest";
import {
  sbomToNotice,
  detectFormat,
  convertSpdxToNotice,
  convertCycloneDxToNotice,
} from "@/utils/sbomToNotice";
import {
  cycloneDxBasic,
  cycloneDxWithExpression,
  cycloneDxWithModifications,
  cycloneDxNoLicense,
  cycloneDxWithCustomLicenseText,
  spdxBasic,
  spdxWithNoassertion,
  spdxWithLicenseInfoFromFiles,
  spdxWithMixedLicenseInfoFromFiles,
  spdxEmpty,
} from "./fixtures/sboms";

describe("detectFormat", () => {
  it("identifies CycloneDX", () => {
    expect(detectFormat(cycloneDxBasic)).toBe("cyclonedx");
  });
  it("identifies SPDX", () => {
    expect(detectFormat(spdxBasic)).toBe("spdx");
  });
  it("returns null for unknown", () => {
    expect(detectFormat({ foo: "bar" })).toBeNull();
  });
});

describe("sbomToNotice (dispatcher)", () => {
  it("routes CycloneDX docs to convertCycloneDxToNotice", () => {
    const doc = sbomToNotice(cycloneDxBasic);
    expect(doc.licenses.length).toBeGreaterThan(0);
    expect(doc.version).toBe("1.0.0");
  });

  it("routes SPDX docs to convertSpdxToNotice", () => {
    const doc = sbomToNotice(spdxBasic);
    expect(doc.licenses.length).toBeGreaterThan(0);
  });

  it("respects custom schema version", () => {
    const doc = sbomToNotice(spdxBasic, "2.5.0");
    expect(doc.version).toBe("2.5.0");
  });

  it("throws on unsupported formats", () => {
    expect(() => sbomToNotice({ foo: "bar" })).toThrow(/unsupported/i);
  });
});

describe("convertSpdxToNotice", () => {
  it("groups packages by license id", () => {
    const doc = convertSpdxToNotice(spdxBasic);
    const mit = doc.licenses.find((l) => l.licenseId === "MIT");
    expect(mit).toBeDefined();
    expect(mit?.components).toHaveLength(2);
    expect(mit?.components.map((c) => c.name).sort()).toEqual(["express", "lodash"]);
  });

  it("populates license name + text from spdx-license-list for known IDs", () => {
    const doc = convertSpdxToNotice(spdxBasic);
    const mit = doc.licenses.find((l) => l.licenseId === "MIT");
    expect(mit?.name).toBeTruthy();
    expect(mit?.text).toBeTruthy();
    expect(mit?.text).toMatch(/permission is hereby granted/i);
  });

  it("extracts purl, homepage, copyrights, and sources", () => {
    const doc = convertSpdxToNotice(spdxBasic);
    const express = doc.licenses
      .flatMap((l) => l.components)
      .find((c) => c.name === "express");
    expect(express?.purl).toBe("pkg:npm/express@4.18.2");
    expect(express?.homepage).toBe("https://expressjs.com");
    expect(express?.copyrights).toEqual([
      "Copyright (c) 2009-2014 TJ Holowaychuk",
    ]);
    expect(express?.sources).toContain("https://expressjs.com");
    expect(express?.sources).toContain("https://github.com/expressjs/express");
  });

  it("treats NOASSERTION/NONE as unknown license", () => {
    const doc = convertSpdxToNotice(spdxWithNoassertion);
    expect(doc.licenses).toHaveLength(1);
    expect(doc.licenses[0].licenseId).toBe("UNKNOWN");
    expect(doc.completedPercent).toBe(0);
  });

  it("falls back to licenseInfoFromFiles when concluded/declared are unset", () => {
    const doc = convertSpdxToNotice(spdxWithLicenseInfoFromFiles);
    expect(doc.licenses[0].licenseId).toBe("BSD-3-CLAUSE");
    expect(doc.completedPercent).toBe(100);
  });

  // Documents a current limitation: getLicenseIdFromSpdx picks the first
  // truthy entry in licenseInfoFromFiles, so a leading "NOASSERTION" hides
  // the real license behind it. If this test ever flips, update the
  // assertion — the fallback got smarter.
  it("does NOT yet skip leading NOASSERTION entries in licenseInfoFromFiles", () => {
    const doc = convertSpdxToNotice(spdxWithMixedLicenseInfoFromFiles);
    expect(doc.licenses[0].licenseId).toBe("UNKNOWN");
  });

  it("returns 0% for empty package list", () => {
    const doc = convertSpdxToNotice(spdxEmpty);
    expect(doc.completedPercent).toBe(0);
    expect(doc.licenses).toHaveLength(0);
  });

  it("uppercases license keys for consistent grouping", () => {
    const doc = convertSpdxToNotice({
      spdxVersion: "SPDX-2.3",
      packages: [
        { name: "a", versionInfo: "1", licenseConcluded: "mit" },
        { name: "b", versionInfo: "1", licenseConcluded: "MIT" },
      ],
    });
    expect(doc.licenses).toHaveLength(1);
    expect(doc.licenses[0].licenseId).toBe("MIT");
    expect(doc.licenses[0].components).toHaveLength(2);
  });
});

describe("convertCycloneDxToNotice", () => {
  it("groups components by license id", () => {
    const doc = convertCycloneDxToNotice(cycloneDxBasic);
    const mit = doc.licenses.find((l) => l.licenseId === "MIT");
    expect(mit?.components.map((c) => c.name).sort()).toEqual(["lodash", "react"]);
    expect(doc.completedPercent).toBe(100);
  });

  it("uses license expression when no id is present", () => {
    const doc = convertCycloneDxToNotice(cycloneDxWithExpression);
    const lic = doc.licenses[0];
    expect(lic.licenseId).toBe("MIT OR APACHE-2.0");
    expect(lic.components[0].name).toBe("dual-licensed-pkg");
  });

  it("captures modifications metadata", () => {
    const doc = convertCycloneDxToNotice(cycloneDxWithModifications);
    const comp = doc.licenses[0].components[0];
    expect(comp.modifications).toEqual(
      expect.arrayContaining(["modified:true", "pedigree:patches"]),
    );
  });

  it("marks components without licenses as UNKNOWN and reflects in progress", () => {
    const doc = convertCycloneDxToNotice(cycloneDxNoLicense);
    expect(doc.licenses[0].licenseId).toBe("UNKNOWN");
    expect(doc.completedPercent).toBe(0);
  });

  it("uses inline license name and text when provided in custom licenses", () => {
    const doc = convertCycloneDxToNotice(cycloneDxWithCustomLicenseText);
    const lic = doc.licenses.find((l) => l.licenseId === "MYCUSTOM-1.0");
    expect(lic?.name).toBe("My Custom License");
    expect(lic?.text).toMatch(/Permission is hereby granted/);
  });

  it("returns empty 0% doc when components missing", () => {
    const doc = convertCycloneDxToNotice({ bomFormat: "CycloneDX", specVersion: "1.5" });
    expect(doc.licenses).toHaveLength(0);
    expect(doc.completedPercent).toBe(0);
  });
});
