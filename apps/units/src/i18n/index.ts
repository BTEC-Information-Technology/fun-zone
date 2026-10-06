import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  a11y: { fullscreen: 'Ecran complet', exitFullscreen: 'Ieși din ecranul complet', language: 'Schimbă limba', swap: 'Inversează unitățile' },
  nav: { privacy: 'Confidențialitate' },
  cat: {
    length: 'Lungime',
    mass: 'Masă',
    temperature: 'Temperatură',
    volume: 'Volum',
    area: 'Suprafață',
    speed: 'Viteză',
    time: 'Timp',
    data: 'Date',
  },
  from: 'Din',
  to: 'În',
  value: 'Valoare',
  ad: 'Reclamă',
  help: {
    title: 'Cum se folosește',
    items: [
      'Alege categoria (lungime, masă, temperatură…).',
      'Scrie valoarea de convertit.',
      'Alege unitatea „Din” și unitatea „În”.',
      'Butonul din mijloc inversează cele două unități.',
    ],
  },
};
const en = {
  a11y: { fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', language: 'Change language', swap: 'Swap units' },
  nav: { privacy: 'Privacy' },
  cat: {
    length: 'Length',
    mass: 'Mass',
    temperature: 'Temperature',
    volume: 'Volume',
    area: 'Area',
    speed: 'Speed',
    time: 'Time',
    data: 'Data',
  },
  from: 'From',
  to: 'To',
  value: 'Value',
  ad: 'Ad',
  help: {
    title: 'How to use',
    items: [
      'Pick a category (length, mass, temperature…).',
      'Type the value to convert.',
      'Choose the “From” unit and the “To” unit.',
      'The middle button swaps the two units.',
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
