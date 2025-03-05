import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    // Pre-bundle the icon sets you plan to use.
    include: ["react-icons/fa", "react-icons/md", "react-icons/gi"]
  },
});
