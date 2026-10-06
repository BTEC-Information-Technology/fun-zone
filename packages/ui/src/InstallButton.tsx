import { useState } from 'react';
import { useInstallPrompt } from './useInstallPrompt';

const LABELS = {
  ro: {
    install: 'Adaugă pe ecranul de start',
    title: 'Adaugă pe ecranul de start',
    steps: [
      'Apasă butonul Share (pătrat cu o săgeată în sus).',
      'Alege „Pe ecranul principal” / „Add to Home Screen”.',
      'Confirmă cu „Adaugă” / „Add”.',
    ],
    close: 'Am înțeles',
  },
  en: {
    install: 'Add to home screen',
    title: 'Add to home screen',
    steps: [
      'Tap the Share button (a square with an up arrow).',
      'Choose “Add to Home Screen”.',
      'Confirm with “Add”.',
    ],
    close: 'Got it',
  },
};

interface Props {
  /** Current language (i18n.language) for the labels. */
  lang: string;
  className?: string;
}

/** “Add to home screen” button. Hidden if installation is not available. */
export function InstallButton({ lang, className }: Props) {
  const { canInstall, isIOS, promptInstall } = useInstallPrompt();
  const [showIOS, setShowIOS] = useState(false);
  const L = (lang || 'ro').slice(0, 2) === 'en' ? LABELS.en : LABELS.ro;

  if (!canInstall && !isIOS) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => (canInstall ? void promptInstall() : setShowIOS(true))}
        aria-label={L.install}
        title={L.install}
        className={className ?? 'rounded-md p-2 text-neutral-200 transition-colors hover:bg-white/10'}
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v11m0 0l-4-4m4 4l4-4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
        </svg>
      </button>

      {showIOS && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setShowIOS(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-center text-xl font-bold text-neutral-100">{L.title}</p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-200">
              {L.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => setShowIOS(false)}
              className="mt-5 w-full rounded-lg bg-white/10 py-2.5 font-semibold text-neutral-100 transition-colors hover:bg-white/20"
            >
              {L.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
