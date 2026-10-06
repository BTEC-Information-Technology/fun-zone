import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const ro = {
  main: { hint: 'Fotografiază un text și extrage-l automat.' },
  scan: { hint: 'Încadrează textul', processing: 'Se recunoaște textul…', noCamera: 'Camera nu este disponibilă.', denied: 'Acces la cameră refuzat.' },
  crop: { hint: 'Trage cu degetul ca să selectezi zona de recunoscut.', whole: 'Tot', ok: 'Recunoaște' },
  editor: { empty: 'Niciun text recunoscut. Editează aici sau încearcă din nou.', placeholder: 'Textul recunoscut apare aici…' },
  btn: { start: 'Start', gallery: 'Galerie', share: 'Distribuie', done: 'Gata', copy: 'Copiază', cancel: 'Anulează', crop: 'Decupare' },
  toast: { copied: 'Text copiat' },
  help: {
    title: 'Cum se folosește',
    items: [
      'Apasă „Start” ca să fotografiezi textul — sau „Galerie” ca să alegi o poză existentă.',
      'Folosește lanterna și zoom-ul (1–5) pentru un text cât mai clar.',
      'Butonul mare face poza și te lasă să selectezi zona dorită; „Tot” ia toată poza.',
      'Textul apare într-un editor: îl editezi, îl copiezi sau îl distribui (email, WhatsApp…).',
    ],
  },
};
const en = {
  main: { hint: 'Photograph some text and extract it automatically.' },
  scan: { hint: 'Frame the text', processing: 'Recognizing text…', noCamera: 'Camera unavailable.', denied: 'Camera access denied.' },
  crop: { hint: 'Drag to select the area to recognize.', whole: 'All', ok: 'Recognize' },
  editor: { empty: 'No text recognized. Edit here or try again.', placeholder: 'Recognized text appears here…' },
  btn: { start: 'Start', gallery: 'Gallery', share: 'Share', done: 'Done', copy: 'Copy', cancel: 'Cancel', crop: 'Crop' },
  toast: { copied: 'Text copied' },
  help: {
    title: 'How to use',
    items: [
      'Tap “Start” to photograph text — or “Gallery” to pick an existing photo.',
      'Use the flash and zoom (1–5) for the clearest possible shot.',
      'The big button takes the photo and lets you select the area; “All” uses the whole photo.',
      'The text shows up in an editor: edit it, copy it, or share it (email, WhatsApp…).',
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
