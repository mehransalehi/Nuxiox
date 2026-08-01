<script setup lang="ts">
const { settings, refreshSettings } = useSiteSettings()
const { locale } = useI18n()
const layoutOverrides = useLayoutOverrides()
const route = useRoute()

onMounted(() => refreshSettings())

const direction = computed(() => settings.value.general.direction ?? 'ltr')
const fontClass = computed(() =>
  locale.value === 'fa' ? 'font-[Vazirmatn,sans-serif]' : 'font-[Work_Sans,Vazirmatn,sans-serif]'
)

useHead(() => ({
  titleTemplate: (t?: string) => t || settings.value.seo.defaultTitle || 'Dentalis',
  htmlAttrs: { dir: direction.value, lang: locale.value, class: `${direction.value} ${fontClass.value}` },
}))
</script>

<template>
  <UiToastStack />
  <div class="relative" style="background: var(--d-bg);">
    <!-- Three.js Canvas -->
    <canvas id="three-canvas" ref="threeCanvas" />

    <!-- Navbar -->
    <TheNavbar
      v-if="!layoutOverrides.hideNavbar"
      :menus="settings.navbar.menus"
      :info="settings.navbar.info"
    />

    <main>
      <slot />
    </main>

    <TheFooter :menus="settings.footer.menus" :info="settings.footer.info" />
  </div>
</template>

<script lang="ts">
export default {
  mounted() {
    const { init, cleanup } = useThreeParticles()
    const canvas = document.getElementById('three-canvas') as HTMLCanvasElement
    if (canvas) init(canvas)
    this._cleanup = cleanup
  },
  beforeUnmount() {
    this._cleanup?.()
  }
}
</script>