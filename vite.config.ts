import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
<<<<<<< HEAD
    open: false, // Disable auto-open for headless environment
=======
    open: process.platform === 'win32' ? 'chrome' : true, // Force Chrome on Windows
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
    cors: true, // Enable CORS for development
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
