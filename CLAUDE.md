# fun-zone: notes for coding agents

- Public repository. Everything committed here is English: code, comments, docs, commit
  messages. User-facing text goes through each app's i18n locale files (`en.json`, `ro.json`).
- Never commit secrets or account identifiers. The AdSense publisher ID comes only from the
  `VITE_ADSENSE_CLIENT` build variable (`.env.local` locally, Cloudflare build variable in CI).
- Read `docs/new-app.md` before adding an app and `docs/deploy.md` before touching deploys.
  Each app has its own `wrangler.jsonc` declaring the worker name and both custom domains.
- Cloudflare Workers Builds deploys every app on push to `main`; do not run `wrangler deploy`
  from an agent session unless asked.
- Commands run from the repo root: `npm run dev:<app>`, `build:<app>`, `test:<app>`.
- This repo may be checked out as a git submodule inside a private parent repo. Work on the
  `main` branch inside the submodule (not a detached HEAD), push here first, then update the
  submodule pointer in the parent.
