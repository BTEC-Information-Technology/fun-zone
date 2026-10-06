import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InstallButton, LanguageSelector, languageOptions } from '@funzone/ui';
import { LANGUAGES } from '../i18n';
import { useFullscreen } from '../hooks/useFullscreen';
import { EnterFullscreenIcon, ExitFullscreenIcon, MenuIcon } from './icons';

export type Page = 'play' | 'help';

interface Props {
  page: Page;
  onNavigate: (page: Page) => void;
}

export function AppBar({ page, onNavigate }: Props) {
  const { t, i18n } = useTranslation();
  const { isFullscreen, supported, toggle } = useFullscreen();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

  const items: { page: Page; key: string }[] = [
    { page: 'play', key: 'menu.play' },
    { page: 'help', key: 'menu.help' },
  ];

  return (
    <header className="flex h-12 flex-none items-center gap-1 border-b border-white/10 px-2">
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t('a11y.menu')}
          className="rounded-md p-2 text-neutral-200 transition-colors hover:bg-white/10"
        >
          <MenuIcon />
        </button>
        {menuOpen && (
          <ul className="absolute left-0 z-50 mt-1 min-w-40 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-xl">
            {items.map((it) => (
              <li key={it.page}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(it.page);
                    setMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                    page === it.page ? 'bg-white/5 font-medium text-white' : 'text-neutral-200'
                  }`}
                >
                  {t(it.key)}
                </button>
              </li>
            ))}
            <li>
              <a
                href="/privacy"
                className="block w-full px-4 py-2.5 text-left text-sm text-neutral-200 transition-colors hover:bg-white/10"
              >
                {t('menu.privacy')}
              </a>
            </li>
          </ul>
        )}
      </div>

      <span className="flex-1 select-none text-center text-lg font-semibold tracking-wide text-green-400">
        Nibbles
      </span>

      <InstallButton lang={i18n.language} />

      <LanguageSelector
        languages={languageOptions(LANGUAGES)}
        current={i18n.language}
        onChange={(code) => void i18n.changeLanguage(code)}
        label={t('a11y.language')}
      />

      {supported && (
        <button
          type="button"
          onClick={toggle}
          aria-label={isFullscreen ? t('a11y.exitFullscreen') : t('a11y.fullscreen')}
          className="rounded-md p-2 text-neutral-200 transition-colors hover:bg-white/10"
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
        </button>
      )}
    </header>
  );
}
