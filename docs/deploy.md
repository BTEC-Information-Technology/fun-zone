# Deployment

All apps are fully static (Vite build to `dist/`). Each app, including the
portal, is published as a **separate Cloudflare Worker** that serves its static
assets, and each Worker is built and deployed by **Cloudflare Workers Builds**
on every push to `main`. There is no shared backend and no server-side code.

| App        | Worker name       | Domains                                           |
|------------|-------------------|---------------------------------------------------|
| portal     | `fun-zone-portal` | `fun-zone.app` / `play-zone.app` (apex)           |
| every other app | `<app>`      | `<app>.fun-zone.app` and `<app>.play-zone.app`    |

The subdomain normally equals the folder name; `apps/textscan` is the exception
and is served at `text.fun-zone.app` / `text.play-zone.app`.

## Prerequisites (account level, once)

- The zones `fun-zone.app` and `play-zone.app` exist in the Cloudflare account.
  Custom domains are attached to each Worker from its `wrangler.jsonc`
  (`custom_domain: true`), which creates the DNS record and the TLS certificate
  automatically on the first deploy. Nothing has to be configured in the DNS
  panel by hand.
- The GitHub repository is connected to Cloudflare (Workers & Pages, Connect to
  Git).

## Creating the Worker for an app (once per app)

In the Cloudflare dashboard: **Workers & Pages -> Create -> Workers -> Import a
repository**, pick this repository, then set:

| Setting           | Value                                                   |
|-------------------|---------------------------------------------------------|
| Production branch | `main`                                                  |
| Root directory    | `/` (the repository root, so workspaces resolve)        |
| Build command     | `npm run build --workspace <app>`                       |
| Deploy command    | `npx wrangler deploy --config apps/<app>/wrangler.jsonc` |
| Node version      | taken from `.nvmrc` (20); `NODE_VERSION=20` is an optional explicit variable |

For the portal use `--workspace portal` and `apps/portal/wrangler.jsonc`. For
`2048`, whose package name is numeric, use `--workspace apps/2048`.

Save and deploy. The first build installs the whole workspace, builds only the
selected app and runs `wrangler deploy` with that app's config, which creates the
Worker, uploads `apps/<app>/dist` and attaches both custom domains. From then on
each push to `main` redeploys the Worker. The `workers.dev` route can be
disabled in the Worker settings if you only want the custom domains.

## Build variable: `VITE_ADSENSE_CLIENT`

Ads are rendered by `AdBanner` from `@funzone/ui`. The AdSense publisher ID is
**never committed**; see `.env.example` at the repository root. It is read at
build time by the `adsense()` Vite plugin (`packages/ui/vite/adsense.ts`) from:

1. the process environment (this is how Cloudflare passes it), or
2. a `.env` / `.env.local` file at the repository root or in the app folder.

In Cloudflare, add it under the Worker's **Settings -> Variables and Secrets**
as a build-time variable:

```
VITE_ADSENSE_CLIENT = ca-pub-XXXXXXXXXXXXXXXX
```

The variable is optional. When it is missing or does not match `ca-pub-<digits>`
nothing is injected into `index.html` and the banners show a neutral placeholder,
which is also what you get in local development. The ad-unit slot IDs live in
`packages/ui/src/adsense.ts`; a placement stays a placeholder until its slot is
filled in. The `ads.txt` file is served by the portal from the apex domains.

## Manual deploy from a terminal

Useful for a first deploy, or to publish without waiting for a push. Log in once
(opens the browser for OAuth):

```
npx wrangler login
```

Then build and deploy the app:

```
npm run build:<app>
npx wrangler deploy --config apps/<app>/wrangler.jsonc
```

Set `VITE_ADSENSE_CLIENT` in a root `.env.local` (git-ignored) before building
if you want real ads in a manual build.

## Adding a new app to the portal

The portal's catalog (`apps/portal/src/data/catalog.json`) is baked into the
portal build, so after adding or changing an entry the portal has to be rebuilt
and deployed too, either by pushing to `main` (the portal Worker rebuilds on its
own) or manually:

```
npm run build:portal
npx wrangler deploy --config apps/portal/wrangler.jsonc
```

Until then the new app is live on its subdomain but not listed on the portal.

## Local development

```
npm install            # once, at the repository root
npm run dev:<app>      # Vite dev server
npm run build:<app>    # type-check + production build to apps/<app>/dist
npm run test:<app>     # Vitest
```

PWA features (install prompt, offline cache) require HTTPS or `localhost`, so
they behave the same locally as on Cloudflare.
