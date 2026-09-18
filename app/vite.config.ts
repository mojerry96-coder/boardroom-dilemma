/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  base: './',
  plugins: [react()],
  // The preview runner assigns a free port through PORT; 5173 otherwise.
  server: { port: Number(process.env.PORT) || 5173, strictPort: !!process.env.PORT },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
