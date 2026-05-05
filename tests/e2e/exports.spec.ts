import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import type { NoticeDoc } from "../../types/notice";

const NOTICE_ID = "export-test-1";

const completeNotice: NoticeDoc = {
  name: "exportable",
  sourceFileName: "exportable.cdx.json",
  createdAt: new Date("2026-01-01").toISOString(),
  version: "1.0.0",
  writtenOffer: null,
  completedPercent: 100,
  licenses: [
    {
      licenseId: "MIT",
      name: "MIT License",
      text: "Permission is hereby granted, free of charge...",
      components: [
        {
          name: "lodash",
          version: "4.17.21",
          purl: "pkg:npm/lodash@4.17.21",
          homepage: "https://lodash.com",
          sources: ["https://github.com/lodash/lodash"],
          copyrights: ["Copyright OpenJS Foundation"],
        },
        { name: "react", version: "19.0.0" },
      ],
    },
  ],
};

const seedDoc = async ({ page }: { page: import("@playwright/test").Page }) => {
  await page.addInitScript(
    ({ id, doc }) => {
      window.localStorage.clear();
      window.localStorage.setItem(`notice:${id}`, JSON.stringify(doc));
      window.localStorage.setItem("notice:index", JSON.stringify([id]));
    },
    { id: NOTICE_ID, doc: completeNotice as unknown as Record<string, unknown> },
  );
};

const readDownload = async (download: import("@playwright/test").Download) => {
  const path = await download.path();
  return await fs.readFile(path, "utf-8");
};

test.describe("Notice editor exports", () => {
  test.beforeEach(seedDoc);

  test("JSON export downloads the full doc with recomputed percent", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /export/i }).click();
    await page.getByRole("menuitem", { name: /json/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("exportable.json");

    const parsed = JSON.parse(await readDownload(download));
    expect(parsed.name).toBe("exportable");
    expect(parsed.completedPercent).toBe(100);
    expect(parsed.licenses[0].licenseId).toBe("MIT");
    expect(parsed.licenses[0].components).toHaveLength(2);
  });

  test("CSV export includes header and one row per component", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /export/i }).click();
    await page.getByRole("menuitem", { name: /csv/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("exportable.csv");

    const csv = await readDownload(download);
    const lines = csv.trim().split("\n");
    expect(lines[0]).toContain("licenseId");
    expect(lines[0]).toContain("componentName");
    expect(lines).toHaveLength(3); // header + 2 components
    expect(lines[1]).toContain("lodash");
    expect(lines[1]).toContain("4.17.21");
    expect(lines[2]).toContain("react");
  });

  test("Markdown export contains title, license heading, and component bullets", async ({ page }) => {
    await page.goto(`/notice?id=${NOTICE_ID}`);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /export/i }).click();
    await page.getByRole("menuitem", { name: /markdown/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("exportable.md");

    const md = await readDownload(download);
    expect(md).toMatch(/^# exportable/m);
    expect(md).toMatch(/^## MIT — MIT License/m);
    expect(md).toMatch(/### License Text/);
    expect(md).toMatch(/- \*\*lodash @ 4\.17\.21\*\*/);
    expect(md).toMatch(/- \*\*react @ 19\.0\.0\*\*/);
  });
});

test.describe("Notice list exports", () => {
  test.beforeEach(seedDoc);

  test("CSV export from the list works and includes the seeded component", async ({ page }) => {
    await page.goto("/notice");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /export/i }).click();
    await page.getByRole("menuitem", { name: /csv/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
    const csv = await readDownload(download);
    expect(csv).toContain("lodash");
  });

  test("Markdown export from the list works and uses the notice name as title", async ({ page }) => {
    await page.goto("/notice");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /export/i }).click();
    await page.getByRole("menuitem", { name: /markdown/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("exportable.md");
    const md = await readDownload(download);
    expect(md).toMatch(/^# exportable/m);
  });
});
