import { test, expect } from "@playwright/test";

test.describe("Static legal pages", () => {
  test("renders the privacy page", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /privacy/i }).first()).toBeVisible();
  });

  test("renders the terms page", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /terms/i }).first()).toBeVisible();
  });

  test("renders the imprint page", async ({ page }) => {
    await page.goto("/imprint");
    await expect(page.getByRole("heading", { name: /imprint/i }).first()).toBeVisible();
  });
});
