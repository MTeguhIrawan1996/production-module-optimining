import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    default: require('./public/locales/en/default.json'),
    allComponents: require('./public/locales/en/allComponents.json'),
    profile: require('./public/locales/en/profile.json'),
  },
  id: {
    default: require('./public/locales/id/default.json'),
    allComponents: require('./public/locales/id/allComponents.json'),
    profile: require('./public/locales/id/profile.json'),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: 'default',
    lng: 'id',
    ns: ['default', 'allComponents', 'profile'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    resources: resources,
  });

export default i18n;
