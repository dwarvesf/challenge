import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {languageDetector} from './languageDetector';

import translationEN from '../locales/en/translation.json';
import translationVI from '../locales/vi/translation.json';
import translationAR from '../locales/ar/translation.json';

// the translations
const localesResourse = {
  en_US: {
    translation: translationEN,
  },
  vi_VN: {
    translation: translationVI,
  },
  ar_US: {
    translation: translationAR,
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: localesResourse,
    fallbackLng: 'vi_VN',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
    },
  });

export default i18n;
