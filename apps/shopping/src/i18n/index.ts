import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  btn: { add: 'Adaugă produs', reset: 'Resetează lista', ok: 'OK', cancel: 'Anulează' },
  form: { name: 'Denumire produs', price: 'Preț', qty: 'Bucăți', namePh: 'ex. Lapte' },
  list: { empty: 'Coșul e gol. Apasă „Adaugă produs”.', total: 'Total', each: 'buc.' },
  reset: { confirm: 'Ștergi toate produsele din listă?' },
  help: {
    title: 'Cum se folosește',
    items: [
      'Apasă „Adaugă produs” și completează denumirea, prețul și numărul de bucăți.',
      'Apasă OK ca să adaugi produsul în listă.',
      'În listă poți edita ✏️ sau șterge 🗑️ fiecare produs; jos vezi totalul.',
      'Lista se salvează automat — nu se pierde dacă închizi aplicația.',
    ],
  },
};
const en = {
  btn: { add: 'Add product', reset: 'Reset list', ok: 'OK', cancel: 'Cancel' },
  form: { name: 'Product name', price: 'Price', qty: 'Quantity', namePh: 'e.g. Milk' },
  list: { empty: 'Cart is empty. Tap “Add product”.', total: 'Total', each: 'pcs' },
  reset: { confirm: 'Delete all products from the list?' },
  help: {
    title: 'How to use',
    items: [
      'Tap “Add product” and fill in the name, price and quantity.',
      'Press OK to add the product to the list.',
      'In the list you can edit ✏️ or delete 🗑️ each product; the total is at the bottom.',
      'The list saves automatically — it won’t be lost if you close the app.',
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
