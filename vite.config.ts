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
      '/api/stream/5000': {
        target: 'http://10.1.40.46:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/5000/, '/stream')
      },
      '/api/stats/5000': {
        target: 'http://10.1.40.46:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/5000/, '/stats')
      },
      '/api/stream/5001': {
        target: 'http://10.1.40.46:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/5001/, '/stream')
      },
      '/api/stats/5001': {
        target: 'http://10.1.40.46:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/5001/, '/stats')
      },
      '/api/stream/5002': {
        target: 'http://10.1.40.46:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/5002/, '/stream')
      },
      '/api/stats/5002': {
        target: 'http://10.1.40.46:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/5002/, '/stats')
      },
      '/api/stream/5003': {
        target: 'http://10.1.40.46:5003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/5003/, '/stream')
      },
      '/api/stats/5003': {
        target: 'http://10.1.40.46:5003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/5003/, '/stats')
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
