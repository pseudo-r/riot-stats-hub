
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    exclude: ['e2e/**', 'node_modules/**'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/lor-data': {
        target: 'https://dd.b.pvp.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lor-data/, ''),
        secure: true,
      },
    },
  },
});
