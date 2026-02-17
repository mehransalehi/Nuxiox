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
      <div class="navbar mx-auto max-w-6xl px-6 py-4 grid md:grid-cols-5 grid-cols-5 md:gap-0 gap-1" data-animate>
        <div class="md:col-span-1 col-span-2">
          <NuxtLink class="text-xl font-black text-slate-900">
            <i class="fa-solid fa-tooth mr-2 text-primary"></i>Denti
          </NuxtLink>
        </div>
        <div class="hidden gap-8 md:flex col-span-3 justify-center">
          <UiLink v-for="menu in props.menus" :key="menu.label" :to-link="menu.href">{{ menu.label }}</UiLink>
        </div>
        <NuxtLink to="/contact" class="hidden md:flex btn btn-primary btn-sm rounded-full text-white md:col-span-1 col-span-2 h-10">
          Book an Appointment
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
