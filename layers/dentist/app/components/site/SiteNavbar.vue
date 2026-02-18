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
const { t } = useI18n()

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}
const mobileOpen = ref(false)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}
onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="relative">
    <div :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-300 py-3',
      scrolled ? 'bg-white/95 shadow-md backdrop-blur-md' : 'bg-transparent'
    ]">
      <div class="navbar mx-auto max-w-6xl px-6 py-4 grid md:grid-cols-5 grid-cols-5 md:gap-0 gap-1">
        <!-- Logo -->
        <div class="md:col-span-1 col-span-3 flex items-center">
          <NuxtLink class="text-xl font-black text-slate-900">
            <i class="fa-solid fa-tooth mr-2 text-primary"></i>Denti
          </NuxtLink>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex gap-8 col-span-3 justify-center items-center">
          <UiLink v-for="menu in props.menus" :key="menu.label" :to-link="menu.href">
            {{ menu.label }}
          </UiLink>
        </div>

        <!-- Desktop Button -->
        <NuxtLink to="/contact"
          class="hidden md:flex btn btn-primary btn-sm rounded-full text-white md:col-span-1 items-center justify-center h-10">
          Book an Appointment
        </NuxtLink>

        <!-- Hamburger (Mobile Only) -->
        <div class="md:hidden col-span-2 flex justify-end items-center">
          <button class="btn btn-ghost btn-sm" @click="toggleMobile">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="fade">
        <div v-if="mobileOpen" class="md:hidden bg-white shadow-md px-6 pb-6 space-y-4">
          <UiLink v-for="menu in props.menus" :key="menu.label" :to-link="menu.href" class="block"
            @click="mobileOpen = false">
            {{ menu.label }}
          </UiLink>

          <NuxtLink to="/contact" class="btn btn-primary w-full rounded-full text-white" @click="mobileOpen = false">
            Book an Appointment
          </NuxtLink>
        </div>
      </transition>

    </div>
  </header>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>