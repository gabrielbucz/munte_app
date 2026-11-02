import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
  optimizeDeps: {
    include: ['@angular/core', '@angular/common', '@angular/router', '@angular/platform-browser', 'rxjs'],
  },
});