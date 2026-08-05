import en from '../../kindergarten-theme/i18n/locales/en.json';
import fa from '../../kindergarten-theme/i18n/locales/fa.json';
import ar from '../../kindergarten-theme/i18n/locales/ar.json';
import { Locale, TranslationSchema } from '../types';

export const translations: Record<Locale, TranslationSchema> = {
  en: en as unknown as TranslationSchema,
  fa: fa as unknown as TranslationSchema,
  ar: ar as unknown as TranslationSchema,
};
