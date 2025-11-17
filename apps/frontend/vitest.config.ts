import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration
 *
 * Configures Vitest for React component testing with:
 * - jsdom environment for DOM APIs (document, navigator, etc.)
 * - React Testing Library support
 * - Path aliases matching vite.config.ts
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for DOM APIs (document, navigator, window, etc.)
    environment: 'jsdom',
    // Setup files to run before each test file
    setupFiles: ['./src/test/setup.ts'],
    // Globals enabled - allows using describe, it, expect without imports
    globals: true,
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/__mocks__',
      ],
      // Fix for test-exclude compatibility issue
      all: true,
      include: ['src/**/*.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@kompass/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
