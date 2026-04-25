import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: "text",
      thresholds: {
        statements: 80,
      },
    },
    environment: "jsdom",
    maxWorkers: 1,
    watch: false,
  },
});
