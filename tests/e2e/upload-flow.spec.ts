import { test, expect } from "@playwright/test";
import path from "node:path";

const FIXTURES = path.resolve(__dirname, "fixtures");

test.describe("Upload SBOM flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("converts a CycloneDX file and lands on the notice page with stored data", async ({ page }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(FIXTURES, "sample-cyclonedx.json"));

    await page.waitForURL(/\/notice\/?\?id=/);

    const stored = await page.evaluate(() => {
      const idx = JSON.parse(localStorage.getItem("notice:index") ?? "[]") as string[];
      const id = idx[0];
      const raw = id ? localStorage.getItem(`notice:${id}`) : null;
      return { id, doc: raw ? JSON.parse(raw) : null };
    });

    expect(stored.id).toBeTruthy();
    expect(stored.doc).toBeTruthy();
    expect(stored.doc.sourceFileName).toBe("sample-cyclonedx.json");
    expect(stored.doc.licenses.length).toBeGreaterThan(0);
    const mit = stored.doc.licenses.find((l: { licenseId: string }) => l.licenseId === "MIT");
    expect(mit).toBeDefined();
    expect(mit.components).toHaveLength(3);
  });

  test("converts an SPDX file and lands on the notice page", async ({ page }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(FIXTURES, "sample-spdx.json"));

    await page.waitForURL(/\/notice\/?\?id=/);

    const licenseIds = await page.evaluate(() => {
      const idx = JSON.parse(localStorage.getItem("notice:index") ?? "[]") as string[];
      const raw = localStorage.getItem(`notice:${idx[0]}`);
      const doc = raw ? JSON.parse(raw) : null;
      return (doc?.licenses ?? []).map((l: { licenseId: string }) => l.licenseId).sort();
    });

    expect(licenseIds).toEqual(["MIT", "ZLIB"]);
  });

  test("rejects an invalid SBOM with a visible error message", async ({ page }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(FIXTURES, "invalid.json"));

    const error = page.getByRole("status");
    await expect(error).toBeVisible();
    await expect(error).toContainText(/unsupported|unknown/i);

    await expect(page).toHaveURL(/\/$/);
  });
});
