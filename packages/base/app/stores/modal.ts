import { defineStore } from 'pinia'

/**
 * Global modal store for theme sections.
 *
 * Sections that need to open a booking form or a full-screen image
 * should call `modalStore.openBooking()` / `modalStore.openImage(url)` directly.
 * The modals themselves render in the layout (default.vue) and read the store state.
 *
 * Usage in a section component:
 *   import { useModalStore } from '~~/packages/base/app/stores/modal'
 *   const modalStore = useModalStore()
 *   modalStore.openBooking()
 *   modalStore.openImage('https://...')
 */
export const useModalStore = defineStore('modal', () => {
  const isBookingOpen = ref(false)
  const selectedImage = ref<string | null>(null)

  function openBooking() {
    isBookingOpen.value = true
  }

  function closeBooking() {
    isBookingOpen.value = false
  }

  function openImage(url: string) {
    selectedImage.value = url
  }

  function closeImage() {
    selectedImage.value = null
  }

  return {
    isBookingOpen,
    selectedImage,
    openBooking,
    closeBooking,
    openImage,
    closeImage,
  }
})
