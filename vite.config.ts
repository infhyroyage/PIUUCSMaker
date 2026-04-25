import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/PIUUCSMaker/" : "/",
  resolve: {
    alias: {
      // daisyUIのpackage.jsonのbrowserが./daisyui.cssとなっているため、Viteでの解決がCSSに寄ってしまう
      // Tailwind CSS v4のglobal.cssの@plugin "daisyui"は、Node上でJSプラグインをimportする必要があるため、エントリをindex.jsに固定する
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
