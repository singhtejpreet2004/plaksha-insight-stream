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
      '/api/stream/6001': {
        target: 'http://10.1.40.46:6001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6001/, '/stream')
      },
      '/api/stats/6001': {
        target: 'http://10.1.40.46:6001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6001/, '/stats')
      },
      '/api/stream/6002': {
        target: 'http://10.1.40.46:6002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6002/, '/stream')
      },
      '/api/stats/6002': {
        target: 'http://10.1.40.46:6002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6002/, '/stats')
      },
      '/api/stream/6003': {
        target: 'http://10.1.40.46:6003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6003/, '/stream')
      },
      '/api/stats/6003': {
        target: 'http://10.1.40.46:6003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6003/, '/stats')
      },
      '/api/stream/6004': {
        target: 'http://10.1.40.46:6004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6004/, '/stream')
      },
      '/api/stats/6004': {
        target: 'http://10.1.40.46:6004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6004/, '/stats')
      },
      '/api/stream/6005': {
        target: 'http://10.1.40.46:6005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6005/, '/stream')
      },
      '/api/stats/6005': {
        target: 'http://10.1.40.46:6005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6005/, '/stats')
      },
      '/api/stream/6006': {
        target: 'http://10.1.40.46:6006',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6006/, '/stream')
      },
      '/api/stats/6006': {
        target: 'http://10.1.40.46:6006',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6006/, '/stats')
      },
      '/api/stream/6007': {
        target: 'http://10.1.40.46:6007',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6007/, '/stream')
      },
      '/api/stats/6007': {
        target: 'http://10.1.40.46:6007',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6007/, '/stats')
      },
      '/api/stream/6014': {
        target: 'http://10.1.40.46:6014',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6014/, '/stream')
      },
      '/api/stats/6014': {
        target: 'http://10.1.40.46:6014',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6014/, '/stats')
      },
      '/api/stream/6015': {
        target: 'http://10.1.40.46:6015',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6015/, '/stream')
      },
      '/api/stats/6015': {
        target: 'http://10.1.40.46:6015',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6015/, '/stats')
      },
      '/api/stream/6016': {
        target: 'http://10.1.40.46:6016',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6016/, '/stream')
      },
      '/api/stats/6016': {
        target: 'http://10.1.40.46:6016',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6016/, '/stats')
      },
      '/api/stream/6017': {
        target: 'http://10.1.40.46:6017',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6017/, '/stream')
      },
      '/api/stats/6017': {
        target: 'http://10.1.40.46:6017',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6017/, '/stats')
      },
      '/api/stream/6018': {
        target: 'http://10.1.40.46:6018',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6018/, '/stream')
      },
      '/api/stats/6018': {
        target: 'http://10.1.40.46:6018',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6018/, '/stats')
      },
      '/api/stream/6019': {
        target: 'http://10.1.40.46:6019',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6019/, '/stream')
      },
      '/api/stats/6019': {
        target: 'http://10.1.40.46:6019',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6019/, '/stats')
      },
      '/api/stream/6020': {
        target: 'http://10.1.40.46:6020',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6020/, '/stream')
      },
      '/api/stats/6020': {
        target: 'http://10.1.40.46:6020',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6020/, '/stats')
      },
      '/api/stream/6021': {
        target: 'http://10.1.40.46:6021',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6021/, '/stream')
      },
      '/api/stats/6021': {
        target: 'http://10.1.40.46:6021',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6021/, '/stats')
      },
      '/api/stream/6023': {
        target: 'http://10.1.40.46:6023',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6023/, '/stream')
      },
      '/api/stats/6023': {
        target: 'http://10.1.40.46:6023',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6023/, '/stats')
      },
      '/api/stream/6024': {
        target: 'http://10.1.40.46:6024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6024/, '/stream')
      },
      '/api/stats/6024': {
        target: 'http://10.1.40.46:6024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6024/, '/stats')
      },
      '/api/stream/6026': {
        target: 'http://10.1.40.46:6026',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6026/, '/stream')
      },
      '/api/stats/6026': {
        target: 'http://10.1.40.46:6026',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6026/, '/stats')
      },
      '/api/stream/6027': {
        target: 'http://10.1.40.46:6027',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6027/, '/stream')
      },
      '/api/stats/6027': {
        target: 'http://10.1.40.46:6027',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6027/, '/stats')
      },
      '/api/stream/6028': {
        target: 'http://10.1.40.46:6028',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6028/, '/stream')
      },
      '/api/stats/6028': {
        target: 'http://10.1.40.46:6028',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6028/, '/stats')
      },
      '/api/stream/6029': {
        target: 'http://10.1.40.46:6029',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6029/, '/stream')
      },
      '/api/stats/6029': {
        target: 'http://10.1.40.46:6029',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6029/, '/stats')
      },
      '/api/stream/6030': {
        target: 'http://10.1.40.46:6030',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6030/, '/stream')
      },
      '/api/stats/6030': {
        target: 'http://10.1.40.46:6030',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6030/, '/stats')
      },
      '/api/stream/6031': {
        target: 'http://10.1.40.46:6031',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6031/, '/stream')
      },
      '/api/stats/6031': {
        target: 'http://10.1.40.46:6031',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6031/, '/stats')
      },
      '/api/stream/6032': {
        target: 'http://10.1.40.46:6032',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6032/, '/stream')
      },
      '/api/stats/6032': {
        target: 'http://10.1.40.46:6032',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6032/, '/stats')
      },
      '/api/stream/6033': {
        target: 'http://10.1.40.46:6033',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6033/, '/stream')
      },
      '/api/stats/6033': {
        target: 'http://10.1.40.46:6033',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6033/, '/stats')
      },
      '/api/stream/6034': {
        target: 'http://10.1.40.46:6034',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6034/, '/stream')
      },
      '/api/stats/6034': {
        target: 'http://10.1.40.46:6034',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6034/, '/stats')
      },
      '/api/stream/6035': {
        target: 'http://10.1.40.46:6035',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stream\/6035/, '/stream')
      },
      '/api/stats/6035': {
        target: 'http://10.1.40.46:6035',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stats\/6035/, '/stats')
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
