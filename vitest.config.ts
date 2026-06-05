import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ["./__tests__/setup.ts"],
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/components/**", "src/hooks/**", "src/services/**"],
      thresholds: {
        statements: 80,
      },
    },
    environment: "jsdom",
    maxWorkers: 1,
    watch: false,
  },
});
