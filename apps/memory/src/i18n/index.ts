import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  diff: { label: 'Dificultate', easy: 'Ușor', medium: 'Mediu', hard: 'Greu' },
  hud: { moves: 'Mutări', time: 'Timp', best: 'Record' },
  btn: { newGame: 'Joc nou', again: 'Din nou', gotIt: 'Am înțeles', help: 'Cum se joacă' },
  win: { title: 'Bravo! 🎉', moves: '{{n}} mutări', record: 'Record nou!' },
  help: {
    title: 'Cum se joacă',
    items: [
      'Toate cartonașele sunt cu fața în jos.',
      'Atinge două cartonașe ca să le întorci.',
      'Dacă au același simbol, rămân descoperite (pereche găsită).',
      'Dacă nu se potrivesc, se întorc la loc — ține minte unde erau!',
      'Găsește toate perechile din cât mai puține mutări și cât mai repede.',
    ],
  },
};
const en = {
  diff: { label: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard' },
  hud: { moves: 'Moves', time: 'Time', best: 'Best' },
  btn: { newGame: 'New game', again: 'Play again', gotIt: 'Got it', help: 'How to play' },
  win: { title: 'Well done! 🎉', moves: '{{n}} moves', record: 'New record!' },
  help: {
    title: 'How to play',
    items: [
      'All cards start face down.',
      'Tap two cards to flip them.',
      'If they share the same symbol, they stay revealed (a pair).',
      "If they don't match, they flip back — remember where they were!",
      'Find all pairs in as few moves and as little time as possible.',
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
