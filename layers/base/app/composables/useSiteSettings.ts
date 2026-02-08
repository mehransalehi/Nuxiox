import { defaultSettings, type SiteSettings } from '~~/layers/base/utils/settings'

export const useSiteSettings = () => {
  const { data } = useFetch<SiteSettings>('/api/settings/public', {
    key: 'site-settings',
    default: () => structuredClone(defaultSettings),
  })

  const settings = computed(() => data.value ?? structuredClone(defaultSettings))

  return { settings }
}
