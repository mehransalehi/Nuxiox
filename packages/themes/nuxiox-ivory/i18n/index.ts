import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fa from './locales/fa.json';
import ar from './locales/ar.json';

const i18n = createI18n({
  legacy: false, // use Composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fa,
    ar,
  },
});

export default i18n;
