import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      all: false,
      enabled: true,
      provider: "v8",
      reporter: "text",
      thresholds: {
        statements: 80,
      },
    },
    environment: "jsdom",
    maxWorkers: 1,
    minWorkers: 1,
    watch: false,
  },
});
