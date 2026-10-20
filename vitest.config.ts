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
    // Node 25+ ships a global localStorage that shadows happy-dom's and is undefined without --localstorage-file
    execArgv: ["--no-experimental-webstorage"],
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
