<script setup lang="ts">
const { settings } = useSiteSettings()
const { locale, setLocale} = useI18n()
const layoutOverrides = useLayoutOverrides()
const route = useRoute()

const direction = computed(() => settings.value.general.direction ?? 'ltr')

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
    settings.value.seo.googleSiteVerification ? { name: 'google-site-verification', content: settings.value.seo.googleSiteVerification } : undefined,
    settings.value.seo.bingSiteVerification ? { name: 'msvalidate.01', content: settings.value.seo.bingSiteVerification } : undefined,
    settings.value.seo.yandexVerification ? { name: 'yandex-verification', content: settings.value.seo.yandexVerification } : undefined,
  ].filter(Boolean),
  htmlAttrs: {
    dir: direction.value,
    lang: locale.value,
    class: direction.value,
  },
}))
</script>

<template>
  <UiToastStack />

  <div v-if="settings.general.showSidebar" class="drawer lg:drawer-open rtl:drawer-end">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col">
      <SiteNavbar
        v-if="!layoutOverrides.hideNavbar"
        :menus="settings.navbar.menus"
        :dark-logo="settings.navbar.darkLogo"
        :light-logo="settings.navbar.lightLogo"
        :info="settings.navbar.info"
        :show-sidebar="settings.general.showSidebar"
      />
      <main class="flex-1 container mx-auto px-4 py-8">
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
    <div class="drawer-side">
      <label for="main-drawer" :aria-label="$t('common.closeSidebar') as any" class="drawer-overlay" />
      <SiteSidebar :menus="settings.navbar.menus" />
    </div>
  </div>

  <div v-else class="flex min-h-screen flex-col">
    <SiteNavbar
      v-if="!layoutOverrides.hideNavbar"
      :menus="settings.navbar.menus"
      :dark-logo="settings.navbar.darkLogo"
      :light-logo="settings.navbar.lightLogo"
      :info="settings.navbar.info"
      :show-sidebar="settings.general.showSidebar"
    />
    <main class="flex-1 container mx-auto px-4 py-8">
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
</template>
