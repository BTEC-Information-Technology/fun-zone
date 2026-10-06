import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  a11y: { fullscreen: 'Ecran complet', exitFullscreen: 'Ieși din ecranul complet', language: 'Schimbă limba' },
  nav: { privacy: 'Confidențialitate' },
  hud: { score: 'Scor', best: 'Record' },
  btn: { newGame: 'Joc nou', undo: 'Înapoi' },
  over: { title: 'Joc terminat', won: 'Ai ajuns la 2048!', keepGoing: 'Continuă', tryAgain: 'Încearcă din nou' },
  hint: 'Glisează sau folosește săgețile pentru a muta plăcile.',
  ad: 'Reclamă',
  help: {
    title: 'Cum se joacă',
    items: [
      'Glisează (sau folosește săgețile) ca să muți toate plăcile.',
      'Plăcile cu același număr se contopesc și se dublează.',
      'După fiecare mutare apare o placă nouă (2 sau 4).',
      'Ajungi la placa 2048 ca să câștigi (poți continua).',
      '„Înapoi” anulează până la 3 mutări.',
    ],
  },
};
const en = {
  a11y: { fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', language: 'Change language' },
  nav: { privacy: 'Privacy' },
  hud: { score: 'Score', best: 'Best' },
  btn: { newGame: 'New game', undo: 'Undo' },
  over: { title: 'Game over', won: 'You reached 2048!', keepGoing: 'Keep going', tryAgain: 'Try again' },
  hint: 'Swipe or use the arrow keys to move the tiles.',
  ad: 'Ad',
  help: {
    title: 'How to play',
    items: [
      'Swipe (or use the arrow keys) to move all tiles.',
      'Tiles with the same number merge and double.',
      'A new tile (2 or 4) appears after each move.',
      'Reach the 2048 tile to win (you can keep going).',
      '“Undo” reverts up to 3 moves.',
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
