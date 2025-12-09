import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@popup': resolve(__dirname, 'src/popup'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@shared': resolve(__dirname, 'src/types'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/lib/test/setup.ts',
  },
});
