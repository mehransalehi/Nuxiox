<script setup lang="ts">
const { settings } = useSiteSettings()
const { locale, setLocaleFromSettings, t } = useI18n()
const layoutOverrides = useLayoutOverrides()

const direction = computed(() => settings.value.general.direction ?? 'ltr')

watch(
  () => settings.value.general.language,
  (value) => {
    setLocaleFromSettings(value)
  },
  { immediate: true }
)

useHead(() => ({
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
      <label for="main-drawer" :aria-label="t('common.closeSidebar') as any" class="drawer-overlay" />
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
