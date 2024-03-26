import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8140,
    open: true,
    // #region
    proxy: {
      "/api": {
        target: "http://220.191.224.191/api",
        changeOrigin: true,
        rewrite(path) {
          return path.replace("/api", "");
        },
      },
    },
    // #endregion
  },
});
