import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Spins up a throwaway local Postgres cluster and runs every migration
    // against it once per test run, so lib/__tests__/db/* can exercise real
    // constraints/triggers/RLS rather than mocks (see vitest.global-setup.ts).
    globalSetup: ["./vitest.global-setup.ts"],
    hookTimeout: 30000,
    exclude: ["node_modules", ".next", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
      exclude: ["lib/__tests__/**", "lib/db/test-harness/**", "**/*.d.ts"],
      // Target: 85%+ on business logic (lib/) once real logic lands (PRD Section 7.2).
      // Thresholds are intentionally not enforced yet — lib/ has no business logic
      // at this scaffolding phase, so a hard gate here would fail for the wrong reason.
    },
  },
});
