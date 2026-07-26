import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Dedicated Vite config for building the Admin Dashboard as a standalone SPA.
// Output goes to dist-admin/ so the admin Vercel project can deploy it independently.
export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  root: path.resolve(__dirname, 'admin'),
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist-admin'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'admin/index.html'),
    },
  },
});
