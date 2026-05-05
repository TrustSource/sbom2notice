import { describe, it, expect, beforeEach } from "vitest";
import {
  saveNotice,
  loadNotice,
  loadIndex,
  removeNotice,
  loadAllNotices,
} from "@/utils/storage";
import type { NoticeDoc } from "@/types/notice";

const sampleDoc = (label = "a"): NoticeDoc => ({
  version: "1.0.0",
  completedPercent: 50,
  licenses: [
    {
      licenseId: "MIT",
      name: "MIT",
      text: `text-${label}`,
      components: [{ name: label, version: "1" }],
    },
  ],
});

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads a notice by id", () => {
    saveNotice("id-1", sampleDoc("hello"));
    const loaded = loadNotice("id-1");
    expect(loaded).not.toBeNull();
    expect(loaded?.licenses[0].text).toBe("text-hello");
  });

  it("returns null for unknown id", () => {
    expect(loadNotice("missing")).toBeNull();
  });

  it("returns null when stored value is corrupt JSON", () => {
    localStorage.setItem("notice:bad", "{not json");
    expect(loadNotice("bad")).toBeNull();
  });

  it("indexes saved notices and avoids duplicates", () => {
    saveNotice("id-1", sampleDoc());
    saveNotice("id-1", sampleDoc("updated"));
    saveNotice("id-2", sampleDoc());
    expect(loadIndex().sort()).toEqual(["id-1", "id-2"]);
  });

  it("removes a notice and updates the index", () => {
    saveNotice("id-1", sampleDoc());
    saveNotice("id-2", sampleDoc());
    removeNotice("id-1");
    expect(loadNotice("id-1")).toBeNull();
    expect(loadIndex()).toEqual(["id-2"]);
  });

  it("returns empty index when none stored", () => {
    expect(loadIndex()).toEqual([]);
  });

  it("returns empty index when stored value is corrupt", () => {
    localStorage.setItem("notice:index", "not-json");
    expect(loadIndex()).toEqual([]);
  });

  it("loadAllNotices returns saved docs in index order", () => {
    saveNotice("id-1", sampleDoc("first"));
    saveNotice("id-2", sampleDoc("second"));
    const all = loadAllNotices();
    expect(all.map((x) => x.id)).toEqual(["id-1", "id-2"]);
    expect(all[0].doc.licenses[0].text).toBe("text-first");
  });

  it("loadAllNotices skips entries that fail to load", () => {
    saveNotice("id-1", sampleDoc());
    // index references an id whose payload is missing
    const idx = JSON.parse(localStorage.getItem("notice:index")!);
    idx.push("id-ghost");
    localStorage.setItem("notice:index", JSON.stringify(idx));
    const all = loadAllNotices();
    expect(all.map((x) => x.id)).toEqual(["id-1"]);
  });
});
