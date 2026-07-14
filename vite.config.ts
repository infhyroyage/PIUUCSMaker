import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/PIUUCSMaker/" : "/",
  resolve: {
    alias: {
      // Because browser in daisyUI package.json is ./daisyui.css, Vite resolves daisyUI to CSS
      // Tailwind CSS v4 global.css @plugin "daisyui" needs to import the JS plugin on Node, so fix the entry to index.js
      daisyui: path.join(
        fileURLToPath(new URL(".", import.meta.url)),
        "node_modules",
        "daisyui",
        "index.js",
      ),
    },
  },
  plugins: [react(), tailwindcss()],
}));
