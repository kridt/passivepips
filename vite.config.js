import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import blogPlugin from "./vite-plugin-blog.js";

export default defineConfig({
  plugins: [react(), blogPlugin()],
  assetsInclude: ["**/*.md"],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ["recharts"],
          "framer-motion": ["framer-motion"],
        },
      },
    },
  },
});
