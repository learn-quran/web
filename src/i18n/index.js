import i18n from 'i18next';

// Translations
import en from './en.json';
import ar from './ar.json';

i18n.init({
  lng: 'en',
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
});

export function strings(name, params = {}) {
  return i18n.t(name, params);
}

export default i18n;
