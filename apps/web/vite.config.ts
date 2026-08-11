import { webEnv } from "@forgeai/config/web";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: webEnv.WEB_PORT,
    proxy: {
      "/api": webEnv.API_URL
    }
  }
});
