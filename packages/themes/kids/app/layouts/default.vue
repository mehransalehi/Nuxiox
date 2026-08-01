<script setup lang="ts">
const { settings, refreshSettings } = useSiteSettings()
const { locale, setLocale} = useI18n()
const layoutOverrides = useLayoutOverrides()
const route = useRoute()

onMounted(() => refreshSettings())

const direction = computed(() => settings.value.general.direction ?? 'ltr')
const fontClass = computed(() => {
  return locale.value === 'fa'
    ? 'font-[Vazirmatn,sans-serif]'
    : 'font-[Nunito,Vazirmatn,sans-serif]'
})

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
}))
</script>

<template>
  <UiToastStack />
  <div class="min-h-screen" style="background-color: var(--kids-bg); color: var(--kids-text);">
    <!-- Decorative blobs -->
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />

    <div class="relative z-10">
      <SiteNavbar
        v-if="!layoutOverrides.hideNavbar"
        :menus="settings.navbar.menus"
        :dark-logo="settings.navbar.darkLogo"
        :light-logo="settings.navbar.lightLogo"
        :info="settings.navbar.info"
        :show-sidebar="settings.general.showSidebar"
      />

      <main>
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
</template>

<style>
/* Font overrides for headings via Fredoka */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Fredoka', 'Vazirmatn', sans-serif;
  letter-spacing: -0.01em;
}

/* Smooth scroll for anchor links */
html {
  scroll-behavior: smooth;
}

/* Scroll reveal observer setup */
.reveal-sections [data-reveal] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.65, 0, 0.35, 1),
              transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
}

.reveal-sections [data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>