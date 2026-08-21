import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In dev, the Vite server proxies /api to the backend so the app can
    // always call a relative "/api" path - same as it will in production
    // when Express serves the built frontend itself. No CORS needed either
    // way since the browser only ever talks to one origin.
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Build straight into Backend/public so Express can serve it as static
    // files - this is what makes the single-domain deployment work.
    outDir: "../Backend/public",
    emptyOutDir: true,
  },
});
