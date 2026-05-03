import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@repo/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@repo/ui-components': path.resolve(__dirname, '../../packages/ui-components/src/index.ts'),
      '@repo/feature-x': path.resolve(__dirname, '../../packages/feature-x/src/index.ts'),
      '@repo/feature-y': path.resolve(__dirname, '../../packages/feature-y/src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
