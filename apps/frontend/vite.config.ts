import path from 'path';

import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'KOMPASS - CRM & Project Management',
        short_name: 'KOMPASS',
        description: 'Integrated CRM and Project Management Tool for Ladenbau',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Shell caching strategy: CacheFirst for HTML, CSS, JS assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Precache shell assets for offline access
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/_/, /^\/login/],
        runtimeCaching: [
          // Shell assets: CacheFirst for fast offline loading
          {
            urlPattern: /\.(?:js|css|html|ico|png|svg|woff|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kompass-shell-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Navigation routes: NetworkFirst with fallback to cache
          {
            urlPattern:
              /^\/(dashboard|customers|opportunities|projects|finance|admin|unauthorized)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'kompass-navigation-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 3, // Fallback to cache after 3s
            },
          },
          // API calls: NetworkFirst, exclude from shell cache
          {
            urlPattern: /^https:\/\/api\.kompass\.local\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'kompass-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // API calls (alternative pattern for localhost)
          {
            urlPattern: /^http:\/\/localhost:\d+\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'kompass-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@kompass/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow access from Docker network
    watch: {
      // Use polling for file watching in Docker (especially on Windows/WSL)
      usePolling: true,
      interval: 1000, // Poll every 1 second
    },
    hmr: {
      // Configure HMR for Docker network
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'pouchdb-vendor': ['pouchdb-browser', 'pouchdb-find'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.spec.{ts,tsx}',
        '**/*.test.{ts,tsx}',
      ],
      thresholds: {
        // Global coverage thresholds (matches backend jest.config.js)
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Component coverage thresholds
        './src/features/**/components/**/*.{ts,tsx}': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
