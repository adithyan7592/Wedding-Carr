import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:preview` makes one self-contained HTML file (no backend; RSVPs stay in the browser)
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "preview" ? [viteSingleFile()] : [])],
  build: { outDir: mode === "preview" ? "dist-preview" : "dist" },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        // If the Express server isn't running, answer 503 so the page
        // falls back to browser storage instead of showing an error.
        configure: (proxy) => {
          proxy.on("error", (_err, _req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ offline: true }));
            }
          });
        },
      },
    },
  },
}));
