import { createI18n } from 'vue-i18n'
import en from '../i18n/locales/en.json'
import fa from '../i18n/locales/fa.json'
import ar from '../i18n/locales/ar.json'

export type SupportedLocale = 'en' | 'fa' | 'ar'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fa,
    ar
  }
})
