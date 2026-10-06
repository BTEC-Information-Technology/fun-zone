import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from './icons';

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface Props {
  languages: LanguageOption[];
  current: string;
  onChange: (code: string) => void;
  /** Accessibility label (aria-label). */
  label?: string;
}

/**
 * Shared language selector (dropdown with flag + name), decoupled from the app
 * state — each app passes `current` + `onChange`. Used identically in all the
 * platform's apps.
 */
export function LanguageSelector({ languages, current, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const cur = languages.find((l) => l.code === current) ?? languages[0];

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md p-2 text-neutral-200 transition-colors hover:bg-white/10"
      >
        <span className="text-xl leading-none">{cur?.flag}</span>
        <ChevronDownIcon />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 min-w-44 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-xl"
        >
          {languages.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === current}
                onClick={() => select(l.code)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/10 ${
                  l.code === current ? 'bg-white/5 font-medium' : ''
                }`}
              >
                <span className="text-xl leading-none">{l.flag}</span>
                <span>{l.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
