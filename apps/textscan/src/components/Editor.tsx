import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  text: string;
  onChange: (text: string) => void;
  onDone: () => void;
}

export function Editor({ text, onChange, onDone }: Props) {
  const { t } = useTranslation();
  const [toast, setToast] = useState('');

  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(''), 1500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash(t('toast.copied'));
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ text });
      } catch {
        /* cancelled */
      }
    } else {
      flash(t('toast.copied'));
    }
  };

  const secondary =
    'rounded-lg bg-neutral-800 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-700';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 p-3">
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('editor.placeholder')}
        className="min-h-0 flex-1 resize-none rounded-xl border border-white/10 bg-neutral-900 p-3 text-base leading-relaxed text-neutral-100 focus:border-indigo-400 focus:outline-none"
      />
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" onClick={copy} className={secondary}>
          {t('btn.copy')}
        </button>
        <button
          type="button"
          onClick={share}
          className="rounded-lg bg-indigo-500 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-400"
        >
          {t('btn.share')}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg bg-neutral-700 py-2.5 font-semibold text-neutral-100 transition-colors hover:bg-neutral-600"
        >
          {t('btn.done')}
        </button>
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 rounded-lg bg-black/80 px-4 py-2 text-sm text-neutral-100">
          {toast}
        </div>
      )}
    </div>
  );
}
