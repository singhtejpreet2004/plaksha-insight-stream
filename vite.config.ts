import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/stream': {
        target: 'http://10.1.40.46:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream/, '/stream')
      },
      '/api/stats': {
        target: 'http://10.1.40.46:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats/, '/stats')
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
