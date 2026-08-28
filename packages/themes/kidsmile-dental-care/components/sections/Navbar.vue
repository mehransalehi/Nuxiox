<script setup lang="ts">
import { ref } from 'vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'
import { Phone, Mail, Clock, Calendar, Sparkles, Menu, X, Smile, Search } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  menus?: { label: string; href: string }[]
  darkLogo?: string
  lightLogo?: string
  info?: { key: string; value: string }[]
}>(), {
  menus: () => [
    { label: 'Home', href: '#hero' },
    { label: 'About Us', href: '#about' },
    { label: 'Dental Care', href: '#services' },
    { label: 'Why Us', href: '#whyus' },
    { label: 'Dentists', href: '#team' },
    { label: 'Smile Tips', href: '#blog' },
    { label: 'Contact', href: '#contact' }
  ],
  darkLogo: '',
  lightLogo: '',
  info: () => []
})

const modalStore = useModalStore()
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="w-full bg-white relative z-40 shadow-xs">
    <!-- Top Announcement & Contact Bar -->
    <div class="bg-indigo-900 text-white text-xs py-2 px-4 sm:px-6 lg:px-8 transition-colors">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div class="flex items-center gap-2 text-indigo-100 font-medium">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-indigo-950 text-xs font-bold animate-pulse-gentle">★</span>
          <span>{{ $t('topbar.welcome') }}</span>
        </div>
        
        <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-indigo-200">
          <a href="mailto:smiles@kidsmiledental.com" class="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <Mail class="w-3.5 h-3.5 text-amber-400" />
            <span>{{ $t('topbar.email') }}</span>
          </a>
          <a href="tel:+18005437645" class="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <Phone class="w-3.5 h-3.5 text-amber-400" />
            <span>{{ $t('topbar.phone') }}</span>
          </a>
          <div class="hidden lg:flex items-center gap-1.5 text-indigo-300">
            <Clock class="w-3.5 h-3.5 text-amber-400" />
            <span>{{ $t('topbar.hours') }}</span>
          </div>
          <!-- Info props fallback rendering if passed by CMS -->
          <template v-if="props.info && props.info.length > 0">
            <span v-for="item in props.info" :key="item.key" class="hidden xl:inline-block">
              {{ item.key }}: {{ item.value }}
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
      <!-- Brand Logo -->
      <a href="#hero" class="flex items-center gap-3 group focus:outline-hidden">
        <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-indigo-900 shadow-md shadow-amber-400/30 group-hover:scale-105 transition-transform">
          <Smile class="w-7 h-7 text-indigo-950" />
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <span class="text-xl sm:text-2xl font-black tracking-tight text-indigo-950 font-sans">Kid<span class="text-amber-500">Smile</span></span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          </div>
          <span class="text-[11px] font-semibold text-indigo-700 tracking-wide uppercase">{{ $t('site.englishName') }}</span>
        </div>
      </a>

      <!-- Desktop Navigation Menu Links -->
      <div class="hidden lg:flex items-center gap-1 xl:gap-2">
        <a
          v-for="item in (props.menus || [])"
          :key="item.href"
          :href="item.href"
          class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
        >
          {{ item.label }}
        </a>
      </div>

      <!-- Action CTA & Mobile Trigger -->
      <div class="flex items-center gap-3">
        <!-- Emergency badge (desktop) -->
        <a
          href="tel:+18005437645"
          class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors"
        >
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>{{ $t('nav.callEmergency') }}</span>
        </a>

        <!-- Book Appointment Button -->
        <button
          type="button"
          @click="modalStore.openBooking()"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Calendar class="w-4 h-4" />
          <span>{{ $t('nav.bookAppointment') }}</span>
        </button>

        <!-- Mobile Hamburger Button -->
        <button
          type="button"
          @click="toggleMobileMenu"
          class="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden"
          aria-label="Toggle Navigation"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6 text-indigo-950" />
          <X v-else class="w-6 h-6 text-indigo-950" />
        </button>
      </div>
    </nav>

    <!-- Mobile Drawer Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in"
    >
      <div class="flex flex-col space-y-1">
        <a
          v-for="item in (props.menus || [])"
          :key="item.href"
          :href="item.href"
          @click="isMobileMenuOpen = false"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          {{ item.label }}
        </a>
      </div>

      <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <a
          href="tel:+18005437645"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs"
        >
          <Phone class="w-4 h-4" />
          <span>{{ $t('nav.callEmergency') }}</span>
        </a>
        <button
          type="button"
          @click="modalStore.openBooking(); isMobileMenuOpen = false"
          class="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-bold text-sm py-3 rounded-xl shadow-md cursor-pointer"
        >
          <Calendar class="w-4 h-4" />
          <span>{{ $t('nav.bookAppointment') }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
