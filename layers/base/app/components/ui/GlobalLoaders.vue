<script setup lang="ts">
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

const loadingStore = useLoadingStore()

const logoPulse = ref(0)

onMounted(() => {
  const nuxtApp = useNuxtApp()

  const stopInitialLoader = () => {
    window.setTimeout(() => loadingStore.stopPageLoading(), 250)
  }

  if (document.readyState === 'complete') {
    stopInitialLoader()
  } else {
    window.addEventListener('load', stopInitialLoader, { once: true })
  }

  nuxtApp.hook('page:start', () => {
    loadingStore.startPageLoading()
  })

  nuxtApp.hook('page:finish', () => {
    window.setTimeout(() => loadingStore.stopPageLoading(), 250)
  })

  const pulseInterval = window.setInterval(() => {
    logoPulse.value = (logoPulse.value + 1) % 3
  }, 400)

  onUnmounted(() => {
    window.clearInterval(pulseInterval)
  })
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="loadingStore.pageLoading"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-base-100/90 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="text-3xl font-black tracking-wider text-primary">
          Nuxiox<span :class="logoPulse === 1 ? 'opacity-60' : logoPulse === 2 ? 'opacity-30' : 'opacity-100'">●</span>
        </div>
        <span class="loading loading-dots loading-lg text-primary" />
      </div>
    </div>
  </Transition>

  <Transition name="slide">
    <div v-if="loadingStore.hasActionLoading" class="fixed inset-x-0 top-0 z-[90] h-1 overflow-hidden bg-primary/15">
      <div class="h-full w-1/2 animate-action-progress rounded-e-full bg-primary" />
    </div>
  </Transition>
</template>
