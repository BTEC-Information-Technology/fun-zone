# packages/

Shared code used by the apps in `apps/`. Packages are consumed as **source**
(no build step): each app aliases the package to its `src/index.ts` in
`vite.config.ts` and compiles it together with its own code, which is why app
Tailwind configs must include `../../packages/ui/src` in their content glob.

## `ui` (`@funzone/ui`)

The common page template and the small set of components every app needs:

- `AppShell`: standard header (title, language selector, fullscreen and install
  buttons, optional help dialog), the `/privacy` page, footer, orientation-aware
  layout and ad placement. Apps render their content as its children.
- `FitBox`: fixed-aspect container that is width-driven in portrait and
  height-driven in landscape, for boards and grids.
- `AdBanner`: AdSense banner unit that renders a neutral placeholder until a
  publisher ID and slot are configured (`src/adsense.ts`).
- `FullscreenButton` / `useFullscreen`, `InstallButton` / `useInstallPrompt`,
  `LanguageSelector` (+ `LANGUAGE_META`, `languageOptions`),
  `PrivacyPolicy` / `privacyUrl`, `useOrientation` / `useShellOrientation`.
- `vite/adsense.ts`: Vite plugin that injects the AdSense tags into
  `index.html` at build time from the `VITE_ADSENSE_CLIENT` variable (see
  `docs/deploy.md`).

All labels inside the package are provided in Romanian and English and follow
the language selected in the app (`i18next`, storage key `funzone:lang`).

## Future packages

Only `ui` exists today. When a second consumer appears, further shared pieces
may be extracted into sibling packages so their API is shaped by real usage,
for example:

- `i18n/`: shared i18next bootstrap and common translations
- `core/`: local-storage helpers, PWA utilities, common hooks
- `config/`: shared ESLint / TypeScript / Tailwind base configuration

Add a new package as `packages/<name>` with a `package.json` named
`@funzone/<name>`, `"main": "src/index.ts"`, and alias it in the consuming
apps' `vite.config.ts` the same way `@funzone/ui` is aliased.
