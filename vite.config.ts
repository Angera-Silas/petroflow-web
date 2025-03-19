import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8081', // Redirect API calls to backend
    },
    hmr: true, // Enable Hot Module Replacement
    watch: {
      usePolling: true, // Use polling for file changes
    },
  },
  build: {
    target: 'esnext', // Ensure compatibility with modern JavaScript features
    rollupOptions: {
      input: './index.html', // Ensure proper entry point for the build
    },
  },
});