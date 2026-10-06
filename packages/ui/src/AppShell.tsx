import { createContext, useContext, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AdBanner } from './AdBanner';
import { FullscreenButton } from './FullscreenButton';
import { InstallButton } from './InstallButton';
import { LanguageSelector } from './LanguageSelector';
import { languageOptions } from './languages';
import { PrivacyPolicy } from './PrivacyPolicy';
import { privacyUrl } from './privacyUrl';
import { useOrientation, type Orientation } from './useOrientation';

const OrientationContext = createContext<Orientation>('portrait');

/** Current orientation, read from inside an AppShell (for FitBox etc.). */
export function useShellOrientation(): Orientation {
  return useContext(OrientationContext);
}

const LABELS = {
  ro: {
    language: 'Schimbă limba',
    fullscreen: 'Ecran complet',
    exitFullscreen: 'Ieși din ecranul complet',
    privacy: 'Confidențialitate',
    back: 'Înapoi',
    ad: 'Reclamă',
    help: 'Ajutor',
    gotIt: 'Am înțeles',
  },
  en: {
    language: 'Change language',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    privacy: 'Privacy',
    back: 'Back',
    ad: 'Ad',
    help: 'Help',
    gotIt: 'Got it',
  },
};

const LANGS = ['ro', 'en'];

interface Props {
  /** App name — title in the header and on the privacy page. */
  appName: string;
  /** Tailwind class for the title colour (e.g. 'text-amber-400'). */
  accent?: string;
  /** Custom header (e.g. Nibbles with a menu). Default: the standard header. */
  header?: ReactNode;
  /** Optional help: “?” button in the header + modal with the rules. */
  help?: { title?: string; items: string[] };
  children: ReactNode;
}

/**
 * Common page template for the apps:
 *  - PORTRAIT: header + top banner (320×50) + content at 95% width (automatic
 *    height, pushes the bottom strip down) + bottom banner (300×250) + footer.
 *  - LANDSCAPE: header + [side strip | content | side strip] on 100dvh.
 *  - Mounts ONLY the banners active for the current orientation (does not load
 *    hidden slots). Also centralizes the /privacy page.
 */
export function AppShell({ appName, accent = 'text-neutral-100', header, help, children }: Props) {
  const { i18n } = useTranslation();
  const orientation = useOrientation();
  const [showHelp, setShowHelp] = useState(false);
  const L = (i18n.language || 'ro').slice(0, 2) === 'en' ? LABELS.en : LABELS.ro;

  const isPrivacy =
    typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '/privacy';

  if (isPrivacy) {
    return (
      <div className="flex h-full flex-col">
        <header className="flex h-12 flex-none items-center gap-3 border-b border-white/10 px-3">
          <a href="/" className={`text-sm ${accent} hover:underline`}>
            {L.back}
          </a>
          <span className="font-semibold tracking-wide">{appName}</span>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <PrivacyPolicy lang={i18n.language} />
        </main>
      </div>
    );
  }

  const headerNode = header ?? (
    <header className="flex h-12 flex-none items-center gap-1 border-b border-white/10 px-2">
      {help ? (
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          aria-label={help.title ?? L.help}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-md text-base font-bold text-neutral-200 transition-colors hover:bg-white/10"
        >
          ?
        </button>
      ) : null}
      <span className={`flex-1 select-none text-center text-lg font-semibold tracking-wide ${accent}`}>
        {appName}
      </span>
      <InstallButton lang={i18n.language} />
      <LanguageSelector
        languages={languageOptions(LANGS)}
        current={i18n.language}
        onChange={(code) => void i18n.changeLanguage(code)}
        label={L.language}
      />
      <FullscreenButton labelEnter={L.fullscreen} labelExit={L.exitFullscreen} />
    </header>
  );

  const portrait = orientation === 'portrait';

  // A SINGLE tree: the portrait/landscape differences are done via the CSS variants
  // `portrait:`/`landscape:`. Only the active banners are mounted (in fixed slots,
  // so `<main>` does not remount), hence the content keeps its state on rotation.
  return (
    <OrientationContext.Provider value={orientation}>
      <div className="flex min-h-[100dvh] flex-col landscape:h-[100dvh] landscape:min-h-0">
        {headerNode}
        {portrait ? <AdBanner placement="top" label={L.ad} className="py-1" /> : null}
        <div className="flex min-h-0 flex-none landscape:flex-1">
          {!portrait ? <AdBanner placement="side" label={L.ad} /> : null}
          <main className="mx-auto flex w-[95%] flex-none flex-col pt-2 landscape:mx-0 landscape:min-h-0 landscape:min-w-0 landscape:w-auto landscape:flex-1 landscape:items-center landscape:justify-center landscape:px-4 landscape:py-2">
            {children}
          </main>
          {!portrait ? <AdBanner placement="side" label={L.ad} /> : null}
        </div>
        {portrait ? (
          <AdBanner placement="bottom" label={L.ad} className="mt-2 border-t border-white/10 py-3" />
        ) : null}
        {portrait ? (
          <footer className="flex-none border-t border-white/10 px-4 py-2 text-center text-xs text-neutral-500">
            <a
              href={privacyUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neutral-300"
            >
              {L.privacy}
            </a>
          </footer>
        ) : null}
      </div>

      {help && showHelp ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className={`mb-3 text-center text-xl font-bold ${accent}`}>{help.title ?? L.help}</p>
            <ul className="space-y-2 text-left text-sm text-neutral-200">
              {help.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-neutral-500">•</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full rounded-lg bg-white/10 py-2.5 font-semibold text-neutral-100 transition-colors hover:bg-white/20"
            >
              {L.gotIt}
            </button>
          </div>
        </div>
      ) : null}
    </OrientationContext.Provider>
  );
}
