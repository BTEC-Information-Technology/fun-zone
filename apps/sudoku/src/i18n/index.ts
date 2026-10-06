import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  diff: { easy: 'Ușor', medium: 'Mediu', hard: 'Greu' },
  btn: { newGame: 'Joc nou', notes: 'Notițe', erase: 'Șterge', again: 'Din nou' },
  hud: { time: 'Timp' },
  win: { title: 'Rezolvat! 🎉' },
  loading: 'Se generează…',
  help: {
    title: 'Cum se joacă',
    items: [
      'Completează grila cu cifre de la 1 la 9.',
      'Fiecare rând conține cifrele 1–9, fără repetare.',
      'Fiecare coloană conține cifrele 1–9, fără repetare.',
      'Fiecare bloc 3×3 conține cifrele 1–9, fără repetare.',
      'Atinge o celulă, apoi o cifră. „Notițe” adaugă cifre mici ajutătoare.',
    ],
  },
};
const en = {
  diff: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
  btn: { newGame: 'New game', notes: 'Notes', erase: 'Erase', again: 'Play again' },
  hud: { time: 'Time' },
  win: { title: 'Solved! 🎉' },
  loading: 'Generating…',
  help: {
    title: 'How to play',
    items: [
      'Fill the grid with digits from 1 to 9.',
      'Each row contains digits 1–9 with no repeats.',
      'Each column contains digits 1–9 with no repeats.',
      'Each 3×3 box contains digits 1–9 with no repeats.',
      'Tap a cell, then a digit. “Notes” adds small helper digits.',
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
