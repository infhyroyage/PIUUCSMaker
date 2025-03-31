import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/PIUUCSMaker/" : "/",
  plugins: [react(), tailwindcss()],
}));
