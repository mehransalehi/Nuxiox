import { defineStore } from 'pinia'
import { ref } from 'vue'

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
    closeImage
  }
})
