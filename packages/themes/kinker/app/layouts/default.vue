<script setup lang="ts">
import Navbar from '../components/sections/Navbar.vue'
import Footer from '../components/sections/Footer.vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'
import BookingModal from '../components/ui/BookingModal.vue'
import ImageModal from '../components/ui/ImageModal.vue'

const { settings } = useSiteSettings()
const layoutOverrides = useLayoutOverrides()
const { locale } = useI18n()
const modalStore = useModalStore()

const dirAttr = computed(() => (locale.value === 'fa' || locale.value === 'ar') ? 'rtl' : 'ltr')

useHead(() => ({
  htmlAttrs: {
    dir: dirAttr.value,
    lang: locale.value,
    class: dirAttr.value,
  },
}))
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar
      v-if="!layoutOverrides.hideNavbar"
      :menus="settings?.navbar?.menus"
      :dark-logo="settings?.navbar?.darkLogo"
      :light-logo="settings?.navbar?.lightLogo"
      :info="settings?.navbar?.info"
    />

    <main class="flex-1">
      <slot />
    </main>

    <Footer
      v-if="!layoutOverrides.hideFooter"
      :menus="settings?.footer?.menus"
      :dark-logo="settings?.footer?.darkLogo"
      :light-logo="settings?.footer?.lightLogo"
      :info="settings?.footer?.info"
    />

    <BookingModal v-if="modalStore.isBookingOpen" :is-open="modalStore.isBookingOpen" @close="modalStore.closeBooking()" />
    <ImageModal v-if="modalStore.selectedImage" :image-url="modalStore.selectedImage" @close="modalStore.closeImage()" />
  </div>
</template>
