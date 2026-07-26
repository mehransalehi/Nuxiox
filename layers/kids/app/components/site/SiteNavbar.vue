<script setup lang="ts">
import type { InfoItem, MenuItem } from '~~/layers/base/utils/settings'

type Props = {
  menus: MenuItem[]
  darkLogo: string
  lightLogo: string
  info: InfoItem[]
  showSidebar: boolean
}

const props = defineProps<Props>()
const scrolled = ref(false)
const mobileOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 30
}

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="relative z-50">
    <div
      :class="[
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg translate-y-0'
          : 'bg-transparent'
      ]"
    >
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex h-20 items-center justify-between">
          <!-- Logo -->
          <NuxtLink class="flex items-center gap-2 group" to="/">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl clay-card !p-0 group-hover:scale-110 transition-transform">
              <span class="text-xl font-bold" style="color: var(--kids-primary)">❤️</span>
            </div>
            <span class="font-fredoka text-xl font-bold" style="color: var(--kids-text)">
              KidsMed
            </span>
          </NuxtLink>

          <!-- Desktop Menu -->
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="menu in props.menus"
              :key="menu.label"
              :to="menu.href"
              class="clay-btn !bg-transparent !text-[var(--kids-text)] !border-0 !shadow-none !py-2 !px-4 hover:!bg-[var(--kids-bg-alt)] hover:!shadow-sm rounded-xl text-sm font-semibold transition-all"
            >
              {{ menu.label }}
            </NuxtLink>
          </nav>

          <!-- Desktop CTA -->
          <NuxtLink
            to="/contact"
            class="hidden md:inline-flex clay-btn clay-btn-accent text-sm"
          >
            <span>Book Now</span>
            <span class="text-lg">→</span>
          </NuxtLink>

          <!-- Mobile Hamburger -->
          <button
            class="md:hidden flex h-10 w-10 items-center justify-center rounded-xl clay-card !p-0"
            @click="toggleMobile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <div
          v-if="mobileOpen"
          class="md:hidden border-t" style="border-color: var(--kids-border); background: var(--kids-bg)"
        >
          <div class="mx-auto max-w-6xl px-6 py-4 space-y-2">
            <NuxtLink
              v-for="menu in props.menus"
              :key="menu.label"
              :to="menu.href"
              class="block clay-card !rounded-xl !p-3 text-sm font-semibold hover:!bg-[var(--kids-primary)] hover:!text-white transition-all"
              @click="mobileOpen = false"
            >
              {{ menu.label }}
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="block clay-btn clay-btn-accent w-full text-center text-sm mt-4"
              @click="mobileOpen = false"
            >
              Book Now →
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>