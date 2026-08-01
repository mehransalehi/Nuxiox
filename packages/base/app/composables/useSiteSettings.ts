import { defaultSettings, type SiteSettings } from '~~/packages/base/utils/settings'

export const useSiteSettings = () => {
  const { data, refresh } = useAsyncData<SiteSettings>('site-settings', () =>
    $fetch('/api/settings/public').catch(() => structuredClone(defaultSettings)),
    {
      default: () => structuredClone(defaultSettings),
      watch: [],
    },
  )

  const settings = computed(() => {
    if (data.value && typeof data.value === 'object') return data.value
    return structuredClone(defaultSettings)
  })

  return { settings, refreshSettings: refresh }
}