<script setup lang="ts">
import type { InfoItem, MenuItem } from '~~/layers/base/utils/settings'

type Props = {
  menus: MenuItem[]
  info: InfoItem[]
}

const props = defineProps<Props>()
const scrolled = ref(false)
const mobileOpen = ref(false)

const handleScroll = () => { scrolled.value = window.scrollY > 60 }
onMounted(() => { handleScroll(); window.addEventListener('scroll', handleScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 transition-all duration-700"
    :class="scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm translate-y-0' : 'bg-transparent'">
    <div class="container-premium flex h-20 items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <span class="font-heading text-2xl font-black tracking-tight" :class="scrolled ? '' : 'text-white'"
          style="font-family: var(--font-heading);">
          <span class="gold-text">D</span>{{ scrolled ? 'entalis' : 'entalis' }}
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink v-for="m in props.menus" :key="m.label" :to="m.href"
          class="text-sm font-medium tracking-wide transition-all relative group"
          :class="scrolled ? 'text-[var(--d-text)] hover:text-[var(--d-accent)]' : 'text-white/80 hover:text-white'">
          {{ m.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--d-accent)] transition-all group-hover:w-full" />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-4">
        <NuxtLink to="/contact" class="btn-gold !py-2.5 !px-6 text-sm hidden md:inline-flex">
          Book Now <span class="text-lg leading-none">→</span>
        </NuxtLink>
        <button class="md:hidden w-10 h-10 flex items-center justify-center rounded-full"
          :class="scrolled ? 'bg-[var(--d-primary)] text-white' : 'bg-white/10 text-white'"
          @click="mobileOpen = !mobileOpen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="fade-slide">
      <div v-if="mobileOpen" class="md:hidden bg-white border-t px-6 pb-6 pt-4 space-y-3 shadow-xl">
        <NuxtLink v-for="m in props.menus" :key="m.label" :to="m.href"
          class="block text-sm font-medium py-2 border-b border-[var(--d-border)] last:border-0"
          @click="mobileOpen = false">{{ m.label }}</NuxtLink>
        <NuxtLink to="/contact" class="btn-gold w-full text-center text-sm mt-4" @click="mobileOpen = false">
          Book Now →
        </NuxtLink>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>