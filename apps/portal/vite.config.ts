/// <reference types="vitest/config" />
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { adsense } from '../../packages/ui/vite/adsense';

/** DEV plugin: writes the admin data to src/data/*.json (local only). */
function adminSavePlugin(): Plugin {
  const ALLOWED = new Set(['catalog', 'categories', 'tags']);
  return {
    name: 'portal-admin-save',
    configureServer(server) {
      server.middlewares.use('/__admin/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const { file, data } = JSON.parse(body) as { file: string; data: unknown };
            if (!ALLOWED.has(file)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'file not allowed' }));
              return;
            }
            const target = resolve(import.meta.dirname, 'src/data', `${file}.json`);
            writeFileSync(target, JSON.stringify(data, null, 2) + '\n', 'utf8');
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
      });

      // Card image upload -> public/images/apps/<id>.<ext>
      server.middlewares.use('/__admin/upload', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const { id, ext, data } = JSON.parse(body) as { id: string; ext: string; data: string };
            const safeId = String(id).replace(/[^a-z0-9_-]/gi, '');
            const safeExt = String(ext).replace(/[^a-z0-9]/gi, '').toLowerCase() || 'png';
            if (!safeId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'invalid id' }));
              return;
            }
            const dir = resolve(import.meta.dirname, 'public/images/apps');
            mkdirSync(dir, { recursive: true });
            const fname = `${safeId}.${safeExt}`;
            writeFileSync(resolve(dir, fname), Buffer.from(data, 'base64'));
            res.end(JSON.stringify({ path: `/images/apps/${fname}` }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@funzone/ui': resolve(import.meta.dirname, '../../packages/ui/src/index.ts'),
    },
  },
  plugins: [
    react(),
    adsense(),
    adminSavePlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'fun-zone',
        short_name: 'fun-zone',
        description: 'Mini apps and light games, free, running in the browser.',
        lang: 'en',
        theme_color: '#0f0f14',
        background_color: '#0f0f14',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        // Real files (e.g. ads.txt) must NOT be served with the SPA shell by the SW.
        navigateFallbackDenylist: [/\/ads\.txt$/],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
});
