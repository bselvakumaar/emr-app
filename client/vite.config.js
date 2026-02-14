import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(process.cwd(), 'client'),
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  },
  preview: {
    port: 5173
  }
});
