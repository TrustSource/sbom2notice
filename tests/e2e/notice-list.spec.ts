import { test, expect } from "@playwright/test";

const seedNotice = (id = "test-notice-1") => ({
  id,
  doc: {
    name: "seeded-bom",
    sourceFileName: "seeded-bom.cdx.json",
    createdAt: new Date().toISOString(),
    version: "1.0.0",
    completedPercent: 100,
    writtenOffer: null,
    licenses: [
      {
        licenseId: "MIT",
        name: "MIT License",
        text: "MIT license text...",
        components: [
          { name: "lodash", version: "4.17.21", purl: "pkg:npm/lodash@4.17.21" },
          { name: "react", version: "19.0.0", purl: "pkg:npm/react@19.0.0" },
        ],
      },
    ],
  },
});

test.describe("Notice list", () => {
  test.beforeEach(async ({ page }) => {
    const seed = seedNotice();
    await page.addInitScript((s) => {
      window.localStorage.clear();
      window.localStorage.setItem(`notice:${s.id}`, JSON.stringify(s.doc));
      window.localStorage.setItem("notice:index", JSON.stringify([s.id]));
    }, seed);
  });

  test("renders saved notices in the table", async ({ page }) => {
    await page.goto("/notice");
    await expect(page.getByRole("heading", { name: /your local notice drafts/i })).toBeVisible();
    await expect(page.getByRole("cell", { name: "seeded-bom" })).toBeVisible();
    await expect(page.getByRole("cell", { name: /100% \(2 components\)/ })).toBeVisible();
  });

  test("opens a notice from the Open button", async ({ page }) => {
    await page.goto("/notice");
    await page.getByRole("link", { name: /open/i }).first().click();
    await expect(page).toHaveURL(/\/notice\/?\?id=test-notice-1/);
  });

  test("deletes a notice after confirming the prompt", async ({ page }) => {
    await page.goto("/notice");
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /delete/i }).click();

    await expect(page.getByRole("cell", { name: "seeded-bom" })).toHaveCount(0);
    await expect(page.getByText(/no local notices yet/i)).toBeVisible();

    const remaining = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("notice:index") ?? "[]"),
    );
    expect(remaining).toEqual([]);
  });

  test("exports a notice as JSON via the export menu", async ({ page }) => {
    await page.goto("/notice");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /export/i }).click();
    await page.getByRole("menuitem", { name: /json/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test("shows the empty state when no notices are stored", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/notice");
    await expect(page.getByText(/no local notices yet/i)).toBeVisible();
  });
});
