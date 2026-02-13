import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const pageLoading = ref(true)
  const actionLoadingCount = ref(0)

  const startPageLoading = () => {
    pageLoading.value = true
  }

  const stopPageLoading = () => {
    pageLoading.value = false
  }

  const startActionLoading = () => {
    actionLoadingCount.value += 1
  }

  const stopActionLoading = () => {
    actionLoadingCount.value = Math.max(0, actionLoadingCount.value - 1)
  }

  const withActionLoading = async <T>(handler: () => Promise<T>) => {
    startActionLoading()
    try {
      return await handler()
    } finally {
      stopActionLoading()
    }
  }

  const hasActionLoading = computed(() => actionLoadingCount.value > 0)

  return {
    pageLoading,
    hasActionLoading,
    startPageLoading,
    stopPageLoading,
    startActionLoading,
    stopActionLoading,
    withActionLoading,
  }
})
