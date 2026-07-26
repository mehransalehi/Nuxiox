<script setup lang="ts">
const { settings } = useSiteSettings()
const { locale, setLocale} = useI18n()
const layoutOverrides = useLayoutOverrides()
const route = useRoute()

const direction = computed(() => settings.value.general.direction ?? 'ltr')
const fontClass = computed(() => (locale.value === 'fa' ? 'font-[Vazirmatn,sans-serif]' : 'font-[Inter,sans-serif]'))

/*watch(
  () => settings.value.general.language,
  (value) => {
    setLocale(value)
  },
  { immediate: true }
)*/

useHead(() => ({
  titleTemplate: (titleChunk?: string) => {
    const defaultTitle = settings.value.seo.defaultTitle || settings.value.seo.siteName
    if (route.path === '/' || !titleChunk) return defaultTitle
    return settings.value.seo.titleSuffix ? `${titleChunk} | ${settings.value.seo.titleSuffix}` : titleChunk
  },
  meta: [
    settings.value.seo.defaultDescription ? { name: 'description', content: settings.value.seo.defaultDescription } : undefined,
    settings.value.seo.robots ? { name: 'robots', content: settings.value.seo.robots } : undefined,
  ].filter(Boolean),
  htmlAttrs: {
    dir: direction.value,
    lang: locale.value,
    class: `${direction.value} ${fontClass.value}`,
  },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Vazirmatn:wght@400;500;700;800&display=swap' },
  ],
}))
</script>

<template>
  <UiToastStack />
  <div class="min-h-screen bg-sky-100/70 text-base-content">
    <div class="mx-auto w-full max-w-7xl px-3 py-4 md:px-6 md:py-6">
      <div class="overflow-hidden rounded-[2rem] bg-base-100/95 shadow-xl ring-1 ring-sky-100">
        <SiteNavbar
          v-if="!layoutOverrides.hideNavbar"
          :menus="settings.navbar.menus"
          :dark-logo="settings.navbar.darkLogo"
          :light-logo="settings.navbar.lightLogo"
          :info="settings.navbar.info"
          :show-sidebar="settings.general.showSidebar"
        />

        <main class="px-4 py-6 md:px-8 md:py-10">
          <slot />
        </main>

        <SiteFooter
          v-if="!layoutOverrides.hideFooter"
          :menus="settings.footer.menus"
          :dark-logo="settings.footer.darkLogo"
          :light-logo="settings.footer.lightLogo"
          :info="settings.footer.info"
        />
      </div>
    </div>
  </div>
</template>
