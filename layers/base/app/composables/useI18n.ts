type Locale = 'en' | 'fa'
import { baseMessages } from '../i18n/messages'


const messages = baseMessages

const getValueByPath = (obj: Record<string, any>, path: string) =>
  path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)

export const useI18n = () => {
  const localeCookie = useCookie<Locale | null>('site-locale', {
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  const locale = useState<Locale>('locale', () => localeCookie.value ?? 'en')

  const setLocale = (value: Locale, options: { persist?: boolean } = {}) => {
    locale.value = value
    if (options.persist !== false) {
      localeCookie.value = value
    }
  }

  const setLocaleFromSettings = (settingsLocale?: Locale) => {
    if (localeCookie.value) {
      locale.value = localeCookie.value
      return
    }
    if (settingsLocale) {
      setLocale(settingsLocale, { persist: false })
    }
  }

  const t = (key: string) => {
    const current = messages[locale.value] as Record<string, any>
    const value = getValueByPath(current, key)
    return value ?? key
  }

  const availableLocales = computed(() => [
    { value: 'en', label: t('languages.english') },
    { value: 'fa', label: t('languages.persian') },
  ])

  return {
    locale,
    setLocale,
    setLocaleFromSettings,
    t,
    availableLocales,
  }
}
