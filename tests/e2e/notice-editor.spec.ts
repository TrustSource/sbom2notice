import { test, expect } from "@playwright/test";
import type { NoticeDoc } from "../../types/notice";

const NOTICE_ID = "edit-test-1";

const incompleteNotice: NoticeDoc = {
  name: "to-edit",
  sourceFileName: "to-edit.cdx.json",
  createdAt: new Date("2026-01-01").toISOString(),
  version: "1.0.0",
  writtenOffer: null,
  // Intentionally not 100; the editor recomputes on save.
  completedPercent: 50,
  licenses: [
    {
      // Missing name + text → license is "Incomplete" until both are filled.
      licenseId: "MIT",
      components: [
        { name: "lodash", version: "4.17.21", purl: "pkg:npm/lodash@4.17.21" },
      ],
    },
  ],
};

const readDoc = async (page: import("@playwright/test").Page, id: string) => {
  return await page.evaluate((i) => {
    const raw = localStorage.getItem(`notice:${i}`);
    return raw ? (JSON.parse(raw) as NoticeDoc) : null;
  }, id);
};

test.describe("Notice editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ({ id, doc }) => {
        window.localStorage.clear();
        window.localStorage.setItem(`notice:${id}`, JSON.stringify(doc));
        window.localStorage.setItem("notice:index", JSON.stringify([id]));
      },
      { id: NOTICE_ID, doc: incompleteNotice as unknown as Record<string, unknown> },
    );
  });

  test("renders header, progress bar, and the seeded license row", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    await expect(page.getByText("to-edit").first()).toBeVisible();
    const progressbar = page.getByRole("progressbar");
    await expect(progressbar).toBeVisible();
    await expect(progressbar).toHaveAttribute("aria-valuenow", /\d+/);

    // The MIT license row exists and is marked incomplete (name + text missing).
    await expect(page.getByText("MIT", { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/incomplete/i).first()).toBeVisible();
  });

  test("shows the missing state when the id does not exist", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/notice?id=does-not-exist");
    await expect(page.getByText(/notice not found/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /go home/i })).toBeVisible();
  });

  test("edits the document name and persists it on save", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    const nameInput = page.locator('input[placeholder="My-project NOTICE"]');
    await nameInput.fill("renamed-notice");

    await page.getByRole("button", { name: /^save$/i }).click();

    const stored = await readDoc(page, NOTICE_ID);
    expect(stored?.name).toBe("renamed-notice");
  });

  test("filling the license name + text marks it complete and bumps progress to 100%", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    // Open the MIT license accordion.
    await page.getByRole("button", { name: /^MIT/ }).first().click();

    await page.locator('input[placeholder*="MIT License"]').first().fill("MIT License");
    await page.locator('textarea[placeholder*="license text"]').first().fill("Permission is hereby granted...");

    await page.getByRole("button", { name: /^save$/i }).click();

    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

    const stored = await readDoc(page, NOTICE_ID);
    expect(stored?.completedPercent).toBe(100);
    expect(stored?.licenses[0].name).toBe("MIT License");
    expect(stored?.licenses[0].text).toMatch(/permission is hereby granted/i);
  });

  test("Add license appends a new UNKNOWN block", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    const initial = await page.locator('[id^="lic-"]').count();
    await page.getByRole("button", { name: /add license/i }).click();
    await expect(page.locator('[id^="lic-"]')).toHaveCount(initial + 1);

    await page.getByRole("button", { name: /^save$/i }).click();

    const stored = await readDoc(page, NOTICE_ID);
    expect(stored?.licenses).toHaveLength(2);
    expect(stored?.licenses[1].licenseId).toBe("UNKNOWN");
  });

  test("Collapse all / Open all toggles license accordions", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    await page.getByRole("button", { name: /open all/i }).click();
    // Once open, the inline License params section should be visible.
    await expect(page.getByText(/license params/i)).toBeVisible();

    await page.getByRole("button", { name: /collapse all/i }).click();
    await expect(page.getByText(/license params/i)).toHaveCount(0);
  });
});
