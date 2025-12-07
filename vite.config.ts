import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

const isContentScript = process.env.BUILD_TARGET === 'content';
const isBackgroundScript = process.env.BUILD_TARGET === 'background';
const isInjectedScript = process.env.BUILD_TARGET === 'injected';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@popup': resolve(__dirname, 'src/popup'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@shared': resolve(__dirname, 'src/types'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: !isContentScript && !isBackgroundScript && !isInjectedScript,
    rollupOptions: isContentScript
      ? {
          input: resolve(__dirname, 'src/content/index.ts'),
          output: {
            entryFileNames: 'content.js',
            format: 'iife',
            inlineDynamicImports: true,
          },
          preserveEntrySignatures: false,
        }
      : isBackgroundScript
        ? {
            input: resolve(__dirname, 'src/background/index.ts'),
            output: {
              entryFileNames: 'background.js',
              format: 'iife',
              inlineDynamicImports: true,
            },
            preserveEntrySignatures: false,
          }
        : isInjectedScript
          ? {
              input: resolve(__dirname, 'src/content/injected.ts'),
              output: {
                entryFileNames: 'injected.js',
                format: 'iife',
                inlineDynamicImports: true,
              },
              preserveEntrySignatures: false,
            }
          : {
              input: {
                popup: resolve(__dirname, 'src/popup/index.html'),
              },
              output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                format: 'es',
              },
            },
  },
  publicDir: isContentScript || isBackgroundScript || isInjectedScript ? false : 'public',
});
