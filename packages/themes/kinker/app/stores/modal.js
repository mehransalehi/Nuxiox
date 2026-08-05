import { ref } from 'vue'

export function useModalStore() {
  const isBookingOpen = ref(false)
  const activeImageUrl = ref(null)

  function openBooking() {
    isBookingOpen.value = true
  }

  function closeBooking() {
    isBookingOpen.value = false
  }

  function openImage(url) {
    activeImageUrl.value = url
  }

  function closeImage() {
    activeImageUrl.value = null
  }

  return {
    isBookingOpen,
    activeImageUrl,
    openBooking,
    closeBooking,
    openImage,
    closeImage
  }
}
