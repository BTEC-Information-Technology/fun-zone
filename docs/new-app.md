# Adding a new app

Every app in this monorepo follows the same template, so a new one is mostly a
matter of copying an existing app (for example `apps/2048` or `apps/calculator`),
renaming it, and registering it in three places: the root `package.json`, its own
`wrangler.jsonc`, and the portal catalog.

Throughout this page, `<app>` is the short, lowercase identifier of the app. It is
used as the folder name, the npm workspace name, the Cloudflare Worker name and
the subdomain (`<app>.fun-zone.app`). If the subdomain must differ from the folder
name (as `apps/textscan` is served at `text.fun-zone.app`), only `wrangler.jsonc`
and the catalog entry change; everything else keeps using the folder name.

## 1. Folder layout

```
apps/<app>/
  package.json          name "<app>", scripts dev / build / preview / test
  vite.config.ts        @funzone/ui alias, adsense() plugin, VitePWA manifest
  tsconfig.json
  tailwind.config.js    content glob must include ../../packages/ui/src
  postcss.config.js
  index.html
  wrangler.jsonc        Cloudflare Worker + custom domains (see section 4)
  public/               favicon.ico, apple-touch-icon.png, icon-192.png,
                        icon-512.png, maskable-512.png
  src/
    main.tsx            imports ./i18n and ./index.css, renders <App />
    App.tsx             wraps the UI in <AppShell>
    index.css           Tailwind directives
    i18n/index.ts       ro / en resources (i18next)
    lib/                pure, testable game/utility logic + *.test.ts
    components/
```

### package.json

```json
{
  "name": "<app>",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@funzone/ui": "*",
    "i18next": "...",
    "i18next-browser-languagedetector": "...",
    "react": "...",
    "react-dom": "...",
    "react-i18next": "..."
  }
}
```

Copy the `devDependencies` block (Vite, React plugin, Tailwind, PostCSS,
TypeScript, `vite-plugin-pwa`, Vitest) from an existing app so versions stay
aligned across the workspace.

### vite.config.ts

Three things are mandatory:

1. the `@funzone/ui` alias pointing at the shared package **source** (the package
   is not pre-built; apps compile it together with their own code);
2. the `adsense()` plugin, which injects the AdSense tags into `index.html` at
   build time when a publisher ID is configured (see `docs/deploy.md`);
3. the `VitePWA` manifest, so the app is installable and works offline.

```ts
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
        name: '<App name>',
        short_name: '<App name>',
        description: '...',
        lang: 'ro',
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
```

Do **not** add the AdSense `<script>` tag to `index.html` by hand; the plugin
does it, and only when a valid `VITE_ADSENSE_CLIENT` is present.

### tailwind.config.js

The shared components carry their own Tailwind classes, so the app's content
glob must include the package source or those classes will be purged:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

### i18n (ro / en)

Each app ships its own `src/i18n/index.ts` built on `i18next` +
`react-i18next` + `i18next-browser-languagedetector`, with `ro` and `en`
resources inline, `fallbackLng: 'ro'`, `supportedLngs: ['ro', 'en']` and the
language persisted in `localStorage` under the key **`funzone:lang`**. Using the
same key everywhere means a visitor who picks English in one app gets English in
all of them. Keep every user-facing string in both languages.

### Icons

`public/` needs `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`,
`icon-512.png` and `maskable-512.png` (the manifest references them). The portal
also needs a card image for the catalog; see section 5.

## 2. Using `@funzone/ui`

`src/App.tsx` wraps the whole UI in `AppShell`, which provides the standard
header (title, language selector, fullscreen and install buttons, optional help
dialog), the `/privacy` page, the footer, the orientation-aware layout and the
ad banners. The banners are mounted only for the current orientation and render
a neutral placeholder when AdSense is not configured.

```tsx
import { AppShell, FitBox } from '@funzone/ui';

export default function App() {
  return (
    <AppShell appName="My App" accent="text-amber-400" help={{ items: [...] }}>
      <FitBox ratio={1}>{/* square board, fills the box with h-full w-full */}</FitBox>
    </AppShell>
  );
}
```

- `appName`: shown in the header and on the privacy page.
- `accent`: Tailwind text colour class for the title.
- `header` (optional): a custom header element replacing the standard one.
- `help` (optional): adds a "?" button that opens a modal with the given items.
- Fixed-aspect content (boards, grids) goes inside `<FitBox ratio={...}>`: in
  portrait the box is width-driven, in landscape it is height-driven and capped
  at `min(width, height * ratio)`. Free-flowing content (calculator, converter)
  needs no `FitBox`; it is centred automatically.

Other exports you may need: `useShellOrientation`, `useOrientation`,
`useFullscreen`, `useInstallPrompt`, `LanguageSelector`, `AdBanner`,
`PrivacyPolicy`. See `packages/README.md`.

Keep the core logic (game rules, conversions, parsers) in pure modules under
`src/lib/` with Vitest tests next to them (`*.test.ts`).

## 3. Root `package.json` scripts

Add the three convenience scripts for the new workspace:

```json
"dev:<app>": "npm run dev --workspace <app>",
"build:<app>": "npm run build --workspace <app>",
"test:<app>": "npm run test --workspace <app>"
```

If the package name is purely numeric (as with `2048`), reference the workspace
by path instead: `--workspace apps/2048`.

Then install from the repo root so the workspace link is created:

```
npm install
npm run dev:<app>
```

## 4. `wrangler.jsonc` (mandatory)

Each app is deployed as its own Cloudflare Worker serving static assets, and the
Worker configuration lives in `apps/<app>/wrangler.jsonc`. It must declare the
Worker name, the `dist` assets directory with SPA fallback, and **both** custom
domains so a single `wrangler deploy` creates the Worker and attaches the
domains:

```jsonc
{
  // Build:  npm run build:<app>
  // Deploy: npx wrangler deploy --config apps/<app>/wrangler.jsonc
  "name": "<app>",
  "compatibility_date": "2025-01-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  },
  "routes": [
    { "pattern": "<app>.fun-zone.app", "custom_domain": true },
    { "pattern": "<app>.play-zone.app", "custom_domain": true }
  ]
}
```

- `name` is the Worker name; keep it equal to the folder name.
- `custom_domain: true` makes Cloudflare create the DNS record and TLS
  certificate automatically on the first deploy.
- `not_found_handling: single-page-application` serves `index.html` for unknown
  paths, which is what makes `/privacy` work on a direct visit.

Deployment itself (automatic on push and manual) is described in
`docs/deploy.md`.

## 5. Register the app in the portal

The portal (`apps/portal`) renders the catalog from
`apps/portal/src/data/catalog.json`. Add an entry:

```json
{
  "id": "<app>",
  "name": "<App name>",
  "url": "https://<app>.fun-zone.app",
  "image": "/images/apps/<app>.png",
  "description": {
    "ro": "...",
    "en": "..."
  },
  "categories": ["puzzle"],
  "tags": ["single_player", "offline", "free"]
}
```

- `categories` and `tags` must use ids defined in `categories.json` and
  `tags.json` in the same folder (add new ones there, with `ro` and `en`
  labels, if needed).
- Put the card image in `apps/portal/public/images/apps/<app>.png`.

The portal is a separate Worker, so it must be rebuilt and deployed after the
catalog changes for the new app to appear.

## Checklist

- [ ] `apps/<app>/` created from the template, `package.json` name is `<app>`
- [ ] `vite.config.ts` has the `@funzone/ui` alias, `adsense()` and the PWA manifest
- [ ] `tailwind.config.js` content includes `../../packages/ui/src`
- [ ] `src/i18n/index.ts` with `ro` and `en`, storage key `funzone:lang`
- [ ] icons in `public/`
- [ ] `App.tsx` uses `AppShell` (and `FitBox` for fixed-ratio content)
- [ ] core logic in `src/lib` with tests; `npm run test:<app>` passes
- [ ] `dev:<app>`, `build:<app>`, `test:<app>` scripts in the root `package.json`
- [ ] `wrangler.jsonc` with the Worker name and both custom domains
- [ ] catalog entry + card image in the portal
- [ ] Cloudflare Worker project created (see `docs/deploy.md`)
