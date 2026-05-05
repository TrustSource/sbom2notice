import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    exclude: ["node_modules", ".next", "out", "tests/e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["utils/**", "lib/**"],
      exclude: ["**/*.d.ts", "tests/**"],
    },
  },
});
