<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiGlobalLoaders />
</template>
<script setup lang="ts">
const { settings } = useSiteSettings()
const { locale, setLocaleFromSettings } = useI18n()
const layoutOverrides = useLayoutOverrides()
const route = useRoute()

const direction = computed(() => settings.value.general.direction ?? 'ltr')
const themeCss = computed(() => {
  const light = settings.value.theme?.light
  const dark = settings.value.theme?.dark
  return `:root{--color-primary:${light?.primary};--color-secondary:${light?.secondary};--color-accent:${light?.accent};--color-neutral:${light?.neutral};}[data-theme="dark"]{--color-primary:${dark?.primary};--color-secondary:${dark?.secondary};--color-accent:${dark?.accent};--color-neutral:${dark?.neutral};}`
})

watch(
  () => settings.value.general.language,
  (value) => {
    setLocaleFromSettings(value)
  },
  { immediate: true }
)

useHead(() => ({
  titleTemplate: (titleChunk?: string) => {
    const defaultTitle = settings.value.seo.defaultTitle || settings.value.seo.siteName
    if (route.path === '/' || !titleChunk) return defaultTitle
    return settings.value.seo.titleSuffix ? `${titleChunk} | ${settings.value.seo.titleSuffix}` : titleChunk
  },
  meta: [
    settings.value.seo.defaultDescription ? { name: 'description', content: settings.value.seo.defaultDescription } : undefined,
    settings.value.seo.robots ? { name: 'robots', content: settings.value.seo.robots } : undefined,
    settings.value.seo.googleSiteVerification ? { name: 'google-site-verification', content: settings.value.seo.googleSiteVerification } : undefined,
    settings.value.seo.bingSiteVerification ? { name: 'msvalidate.01', content: settings.value.seo.bingSiteVerification } : undefined,
    settings.value.seo.yandexVerification ? { name: 'yandex-verification', content: settings.value.seo.yandexVerification } : undefined,
  ].filter(Boolean),
  htmlAttrs: {
    dir: direction.value,
    lang: locale.value,
    class: direction.value,
    'data-theme': settings.value.theme?.preset || 'light',
  },
  style: [{ children: themeCss.value }],
}))
</script>
