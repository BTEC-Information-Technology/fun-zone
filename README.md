# fun-zone

Small, static games and utilities, each shipped as a progressive web app on its own
subdomain of [fun-zone.app](https://fun-zone.app) and [play-zone.app](https://play-zone.app).
No backend, no accounts, no tracking beyond non-intrusive ad banners.

| App | Live | Folder |
|---|---|---|
| Portal (catalog) | [fun-zone.app](https://fun-zone.app) | `apps/portal` |
| 2048 | [2048.fun-zone.app](https://2048.fun-zone.app) | `apps/2048` |
| Calculator | [calculator.fun-zone.app](https://calculator.fun-zone.app) | `apps/calculator` |
| Memory | [memory.fun-zone.app](https://memory.fun-zone.app) | `apps/memory` |
| Nibbles | [nibbles.fun-zone.app](https://nibbles.fun-zone.app) | `apps/nibbles` |
| Shopping list | [shopping.fun-zone.app](https://shopping.fun-zone.app) | `apps/shopping` |
| Stopwatch | [stopwatch.fun-zone.app](https://stopwatch.fun-zone.app) | `apps/stopwatch` |
| Sudoku | [sudoku.fun-zone.app](https://sudoku.fun-zone.app) | `apps/sudoku` |
| Text scan (OCR) | [text.fun-zone.app](https://text.fun-zone.app) | `apps/textscan` |
| Tic-tac-toe | [tictactoe.fun-zone.app](https://tictactoe.fun-zone.app) | `apps/tictactoe` |
| Unit converter | [units.fun-zone.app](https://units.fun-zone.app) | `apps/units` |

Every app is also reachable under the same subdomain of `play-zone.app`.
[Chrono Drift](https://github.com/BTEC-Information-Technology/chronodrift), the 3D
endless runner, lives in its own repository.

## Stack

- Vite 5, React 18, TypeScript, Tailwind CSS, `vite-plugin-pwa`
- npm workspaces: `apps/*` plus the shared `packages/ui` (`@funzone/ui`)
- Each app is a Cloudflare Worker serving static assets, configured by its own `wrangler.jsonc`
- Bilingual UI (English / Romanian) through per-app i18n locale files

## Getting started

```sh
npm install
npm run dev:2048        # any app: dev:<app>
npm run build:2048      # type-check + production build into apps/2048/dist
npm run test:2048       # vitest
npm run build           # build every app
```

Node 20 (see `.nvmrc`).

### AdSense

Banners are rendered by `AdBanner` from `@funzone/ui`. The publisher ID is **not** in the
repository: copy `.env.example` to `.env.local` and set `VITE_ADSENSE_CLIENT` to enable real
ads locally; without it the apps show a development placeholder. In Cloudflare the same
variable is set as a build variable on each Worker. See [docs/deploy.md](docs/deploy.md).

## Documentation

- [docs/new-app.md](docs/new-app.md): how to add an app (structure, scripts, `wrangler.jsonc`, portal catalog)
- [docs/deploy.md](docs/deploy.md): Cloudflare Workers Builds settings and manual deploy
- [docs/build-apk.md](docs/build-apk.md): packaging an app as an Android APK (TWA)
- [packages/README.md](packages/README.md): the shared UI package

## License

[MIT](LICENSE)
