import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("renders the headline and primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /turn your sbom into a notice file/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /choose sbom file/i })).toBeVisible();
  });

  test("links to the legal pages from the landing card", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("section").first();
    await expect(card.getByRole("link", { name: /privacy/i }).first()).toBeVisible();
    await expect(card.getByRole("link", { name: /imprint/i }).first()).toBeVisible();
  });
});
