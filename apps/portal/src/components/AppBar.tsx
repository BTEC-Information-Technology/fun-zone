import { useTranslation } from 'react-i18next';
import { InstallButton, LanguageSelector, languageOptions } from '@funzone/ui';
import { LANGUAGES } from '../types';
import { useFullscreen } from '../hooks/useFullscreen';
import { EnterFullscreenIcon, ExitFullscreenIcon, FilterIcon } from './icons';

interface Props {
  onOpenFilters: () => void;
  activeFilters: number;
}

export function AppBar({ onOpenFilters, activeFilters }: Props) {
  const { t, i18n } = useTranslation();
  const { isFullscreen, supported, toggle } = useFullscreen();

  return (
    <header className="flex h-12 flex-none items-center gap-1 border-b border-white/10 px-2">
      <button
        type="button"
        onClick={onOpenFilters}
        aria-label={t('a11y.openFilters')}
        className="relative flex items-center gap-1.5 rounded-md px-2 py-2 text-sm text-neutral-200 transition-colors hover:bg-white/10"
      >
        <FilterIcon className="h-5 w-5" />
        <span className="hidden sm:inline">{t('filters.title')}</span>
        {activeFilters > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
            {activeFilters}
          </span>
        )}
      </button>

      <span className="flex-1 select-none text-center text-lg font-semibold tracking-wide">
        fun-zone
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
