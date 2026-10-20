import { z } from "zod";

const cycloneDxSchema = z.object({
  bomFormat: z.literal("CycloneDX"),
  specVersion: z.string(),
  version: z.number().optional(),
  components: z.array(z.any()).optional()
});

const spdxSchema = z.object({
  spdxVersion: z.string(),
  dataLicense: z.string().optional(),
  SPDXID: z.string().optional(),
  packages: z.array(z.any()).optional()
});

export type SbomKind = "cyclonedx" | "spdx";

export function detectSbomKind(obj: unknown): SbomKind | null {
  if (typeof obj !== "object" || obj === null) return null;
  if ((obj as any).bomFormat === "CycloneDX") return "cyclonedx";
  if (typeof (obj as any).spdxVersion === "string") return "spdx";
  return null;
}

export function validateSbom(obj: unknown) {
  const kind = detectSbomKind(obj);
  if (!kind) {
    return {
      ok: false as const,
      error: "Unsupported or unknown SBOM format. Expected CycloneDX JSON or SPDX JSON."
    };
  }
  if (kind === "cyclonedx") {
    const parsed = cycloneDxSchema.safeParse(obj);
    return parsed.success
      ? { ok: true as const, kind: "cyclonedx" as const, data: parsed.data }
      : { ok: false as const, error: parsed.error.message };
  }
  const parsed = spdxSchema.safeParse(obj);
  return parsed.success
    ? { ok: true as const, kind: "spdx" as const, data: parsed.data }
    : { ok: false as const, error: parsed.error.message };
}
