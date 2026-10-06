import type { LanguageOption } from './LanguageSelector';

/**
 * Language metadata shared between apps (native name + “flag”).
 * Flag emojis render as letters on Windows desktop, but correctly on mobile.
 */
export const LANGUAGE_META: Record<string, { name: string; flag: string }> = {
  ro: { name: 'Română', flag: '🇷🇴' },
  en: { name: 'English', flag: '🇬🇧' },
};

export function languageOptions(codes: readonly string[]): LanguageOption[] {
  return codes.map((c) => ({
    code: c,
    name: LANGUAGE_META[c]?.name ?? c,
    flag: LANGUAGE_META[c]?.flag ?? '',
  }));
}
