import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  a11y: { fullscreen: 'Ecran complet', exitFullscreen: 'Ieși din ecranul complet', language: 'Schimbă limba' },
  nav: { privacy: 'Confidențialitate' },
  mode: { label: 'Mod', twoPlayers: '2 jucători', vsAi: 'Vs calculator' },
  diff: { label: 'Dificultate', easy: 'Ușor', hard: 'Imposibil' },
  turn: { x: 'Rândul lui X', o: 'Rândul lui O', thinking: 'Calculatorul gândește…' },
  result: { win: '{{player}} a câștigat!', draw: 'Remiză!' },
  score: { x: 'X', o: 'O', draw: 'Remize' },
  btn: { newRound: 'Rundă nouă', resetScore: 'Resetează scorul' },
  ad: 'Reclamă',
  help: {
    title: 'Cum se joacă',
    items: [
      'Alege „2 jucători” sau „Vs calculator”.',
      'Puneți X și O pe rând, atingând o căsuță.',
      'Câștigi cu 3 simboluri la rând: pe orizontală, verticală sau diagonală.',
      'La „Vs calculator” alegi dificultatea: Ușor sau Imposibil.',
    ],
  },
};
const en = {
  a11y: { fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', language: 'Change language' },
  nav: { privacy: 'Privacy' },
  mode: { label: 'Mode', twoPlayers: '2 players', vsAi: 'Vs computer' },
  diff: { label: 'Difficulty', easy: 'Easy', hard: 'Impossible' },
  turn: { x: "X's turn", o: "O's turn", thinking: 'Computer is thinking…' },
  result: { win: '{{player}} wins!', draw: 'Draw!' },
  score: { x: 'X', o: 'O', draw: 'Draws' },
  btn: { newRound: 'New round', resetScore: 'Reset score' },
  ad: 'Ad',
  help: {
    title: 'How to play',
    items: [
      'Choose “2 players” or “Vs computer”.',
      'Place X and O in turns by tapping a cell.',
      'Win with 3 in a row: horizontal, vertical or diagonal.',
      'In “Vs computer” pick the difficulty: Easy or Impossible.',
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
