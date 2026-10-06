import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ro from './locales/ro.json';
import en from './locales/en.json';

export const LANGUAGES = ['ro', 'en'] as const;
export type LanguageCode = (typeof LANGUAGES)[number];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ro: { translation: ro },
      en: { translation: en },
    },
    fallbackLng: 'ro',
    supportedLngs: LANGUAGES as unknown as string[],
    detection: {
      // the chosen language is saved in local storage
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nibbles:lang',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
