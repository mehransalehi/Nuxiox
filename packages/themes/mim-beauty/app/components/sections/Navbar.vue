<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'

const props = defineProps<{
  menus?: { label: string; href: string }[]
  darkLogo?: string
  lightLogo?: string
  info?: { key: string; value: string }[]
  showSidebar?: boolean
}>()

const modalStore = useModalStore()

const { locale, setLocale, locales } = useI18n()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isLangOpen = ref(false)

const localeLabels: Record<string, string> = {
  en: 'English',
  fa: 'فارسی',
  ar: 'العربية',
}

function handleScroll() {
  isScrolled.value = window.scrollY > 30
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function switchLocale(code: string) {
  setLocale(code)
  isLangOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    id="mainHeader"
    :class="[
      'fixed top-0 left-0 w-full z-40 transition-all duration-300',
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
    ]"
  >
    <div class="w-full px-6 sm:px-12 md:px-16 lg:px-24 flex items-center justify-between">
      <!-- Logo Left -->
      <NuxtLink :to="$localePath('/')" class="flex items-center gap-3 group">
        <div class="relative flex items-center justify-center">
          <span class="font-serif italic text-4xl sm:text-5xl font-normal tracking-tight text-[#3A2016]">MB</span>
        </div>
        <div class="flex flex-col text-right leading-tight">
          <span class="font-bold text-base text-[#3A2016] tracking-wide">{{ $t('site.name') }}</span>
          <span class="font-serif text-[11px] text-stone-500 tracking-widest font-normal">{{ $t('site.englishName') }}</span>
        </div>
      </NuxtLink>

      <!-- Desktop Nav & Locale Dropdown & Booking Button -->
      <div class="hidden lg:flex items-center gap-8">
        <nav class="flex items-center gap-6 sm:gap-8 text-sm font-semibold text-[#3A2016]">
          <a href="#hero" class="hover:text-[#B68E56] transition-colors py-1">{{ $t('nav.home') }}</a>
          <a href="#about" class="hover:text-[#B68E56] transition-colors py-1">{{ $t('nav.about') }}</a>
          <a href="#services" class="hover:text-[#B68E56] transition-colors py-1">{{ $t('nav.services') }}</a>
          <a href="#promotions" class="hover:text-[#B68E56] transition-colors py-1">{{ $t('nav.pricing') }}</a>
          <NuxtLink :to="$localePath('/blog')" class="hover:text-[#B68E56] transition-colors py-1">{{ $t('nav.blog') }}</NuxtLink>
          <a href="#contact" class="hover:text-[#B68E56] transition-colors py-1">{{ $t('nav.contact') }}</a>
        </nav>

        <!-- Locale Selector -->
        <div class="relative">
          <button
            @click="isLangOpen = !isLangOpen"
            class="flex items-center gap-1 text-xs font-semibold text-[#3A2016] hover:text-[#B68E56] transition-colors px-2 py-1 border border-stone-300 rounded"
          >
            <span>{{ localeLabels[locale] || locale }}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            v-if="isLangOpen"
            class="absolute top-full right-0 mt-2 bg-white border border-stone-200 rounded shadow-lg min-w-[130px] z-50"
          >
            <button
              v-for="l in locales"
              :key="l.code"
              @click="switchLocale(l.code)"
              class="block w-full text-left px-4 py-2 text-sm text-[#3A2016] hover:bg-stone-100 transition-colors"
              :class="{ 'font-bold bg-stone-50': locale === l.code }"
            >
              {{ localeLabels[l.code] || l.name }}
            </button>
          </div>
        </div>

        <button @click="modalStore.openBooking()" class="btn-outline-hero px-6 py-2 text-sm font-semibold">
          {{ $t('nav.bookAppointment') }}
        </button>
      </div>

      <!-- Mobile Menu Toggle -->
      <button @click="toggleMobileMenu" class="lg:hidden text-[#3A2016] text-xl focus:outline-none p-2" :aria-label="$t('nav.home')">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <div
      :class="[
        'fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6 text-base font-semibold text-[#3A2016] transition-all duration-300 lg:hidden',
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      ]"
    >
      <button @click="toggleMobileMenu" class="absolute top-8 left-8 text-2xl text-[#3A2016]">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <a href="#hero" @click="toggleMobileMenu" class="hover:text-[#B68E56] transition-colors">{{ $t('nav.home') }}</a>
      <a href="#about" @click="toggleMobileMenu" class="hover:text-[#B68E56] transition-colors">{{ $t('nav.about') }}</a>
      <a href="#services" @click="toggleMobileMenu" class="hover:text-[#B68E56] transition-colors">{{ $t('nav.services') }}</a>
      <a href="#promotions" @click="toggleMobileMenu" class="hover:text-[#B68E56] transition-colors">{{ $t('nav.pricing') }}</a>
      <NuxtLink :to="$localePath('/blog')" @click="toggleMobileMenu" class="hover:text-[#B68E56] transition-colors">{{ $t('nav.blog') }}</NuxtLink>
      <a href="#contact" @click="toggleMobileMenu" class="hover:text-[#B68E56] transition-colors">{{ $t('nav.contact') }}</a>

      <!-- Mobile locale selector -->
      <div class="flex items-center gap-2 mt-2">
        <button
          v-for="l in locales"
          :key="l.code"
          @click="switchLocale(l.code); toggleMobileMenu()"
          class="text-sm px-3 py-1.5 rounded border border-stone-300 hover:border-[#B68E56] transition-colors"
          :class="{ 'bg-[#B68E56] text-white border-[#B68E56]': locale === l.code }"
        >
          {{ localeLabels[l.code] || l.name }}
        </button>
      </div>

      <button @click="toggleMobileMenu(); modalStore.openBooking()" class="btn-outline-hero px-8 py-2.5 text-sm font-semibold mt-4">
        {{ $t('nav.bookAppointment') }}
      </button>
    </div>
  </header>
</template>