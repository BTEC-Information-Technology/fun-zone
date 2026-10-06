import { useTranslation } from 'react-i18next';
import { FullscreenButton, LanguageSelector, languageOptions } from '@funzone/ui';
import { LANGUAGES } from '../i18n';

export function AppBar() {
  const { t, i18n } = useTranslation();
  return (
    <header className="flex h-12 flex-none items-center gap-1 border-b border-white/10 px-2">
      <span className="flex-1 select-none text-center text-lg font-semibold tracking-wide text-violet-300">
        Tic-Tac-Toe
      </span>
      <LanguageSelector
        languages={languageOptions(LANGUAGES)}
        current={i18n.language}
        onChange={(code) => void i18n.changeLanguage(code)}
        label={t('a11y.language')}
      />
      <FullscreenButton labelEnter={t('a11y.fullscreen')} labelExit={t('a11y.exitFullscreen')} />
    </header>
  );
}
