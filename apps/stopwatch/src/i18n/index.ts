import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  mode: { stopwatch: 'Cronometru', timer: 'Temporizator' },
  btn: { start: 'Start', pause: 'Pauză', resume: 'Continuă', reset: 'Resetează', lap: 'Tură', dismiss: 'Oprește alarma' },
  laps: { title: 'Ture', col: 'Tură', split: 'Interval', total: 'Total' },
  timer: { hours: 'Ore', minutes: 'Minute', seconds: 'Secunde', done: 'Timpul a expirat!' },
  help: {
    title: 'Cum se folosește',
    items: [
      '„Cronometru”: Start, apoi Tură pentru intervale; Reset oricând.',
      '„Temporizator”: setezi ore/minute/secunde (sau o presetare) și pornești.',
      'Când ajunge la zero, temporizatorul sună (alarmă).',
      'Pauză/Continuă funcționează la ambele.',
    ],
  },
};
const en = {
  mode: { stopwatch: 'Stopwatch', timer: 'Timer' },
  btn: { start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset', lap: 'Lap', dismiss: 'Stop alarm' },
  laps: { title: 'Laps', col: 'Lap', split: 'Split', total: 'Total' },
  timer: { hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', done: "Time's up!" },
  help: {
    title: 'How to use',
    items: [
      '“Stopwatch”: Start, then Lap for splits; Reset anytime.',
      '“Timer”: set hours/minutes/seconds (or a preset) and start.',
      'When it reaches zero, the timer rings (alarm).',
      'Pause/Resume works for both.',
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
