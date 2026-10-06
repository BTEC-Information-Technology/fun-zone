/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { adsense } from '../../packages/ui/vite/adsense';

export default defineConfig({
  resolve: {
    alias: {
      '@funzone/ui': resolve(import.meta.dirname, '../../packages/ui/src/index.ts'),
    },
  },
  plugins: [
    react(),
    adsense(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Stopwatch',
        short_name: 'Stopwatch',
        description: 'Stopwatch with laps and a countdown timer with alarm. Simple, fast, offline.',
        lang: 'en',
        theme_color: '#0b1220',
        background_color: '#0b1220',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
    }),
  ],
  test: { globals: true, environment: 'node' },
});
