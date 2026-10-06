import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  a11y: { fullscreen: 'Ecran complet', exitFullscreen: 'Ieși din ecranul complet', language: 'Schimbă limba' },
  nav: { privacy: 'Confidențialitate' },
  ad: 'Reclamă',
  help: {
    title: 'Cum se folosește',
    items: [
      'Apasă cifrele și operațiile pentru a calcula.',
      '± schimbă semnul, % împarte la 100, ⌫ șterge ultima cifră.',
      'C resetează totul.',
      'Merge și de la tastatură (cifre, + − × ÷, Enter, Backspace).',
    ],
  },
};
const en = {
  a11y: { fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', language: 'Change language' },
  nav: { privacy: 'Privacy' },
  ad: 'Ad',
  help: {
    title: 'How to use',
    items: [
      'Tap digits and operations to calculate.',
      '± toggles the sign, % divides by 100, ⌫ deletes the last digit.',
      'C clears everything.',
      'The keyboard works too (digits, + − × ÷, Enter, Backspace).',
    ],
  },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ro: { translation: ro }, en: { translation: en } },
    fallbackLng: 'ro',
    supportedLngs: ['ro', 'en'],
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'], lookupLocalStorage: 'funzone:lang' },
    interpolation: { escapeValue: false },
  });

export const LANGUAGES = ['ro', 'en'];

export default i18n;
