<script setup>
import { ref, onMounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const siteSettings = ref(null)

// Use Pinia store for modal control as required by Nuxiox spec
let modalStore = null
try {
  // Pinia store dynamic resolution or global fallback
  const { useModalStore } = await import('../../stores/modal')
  modalStore = useModalStore()
} catch (e) {
  modalStore = { openBooking: () => {} }
}

function handleOpenBooking() {
  if (modalStore && modalStore.openBooking) {
    modalStore.openBooking()
  }
}

async function fetchSettings() {
  try {
    const res = await fetch('/api/settings/public')
    if (res.ok) {
      siteSettings.value = await res.json()
    }
  } catch (e) {
    siteSettings.value = null
  }
}

onMounted(() => {
  fetchSettings()
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Brand Logo -->
      <a href="/" class="flex items-center space-x-3 gap-2">
        <div class="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
          ☀️
        </div>
        <span class="text-xl font-bold font-heading text-slate-800">
          {{ $t('site.name') }}
        </span>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center space-x-6 gap-6 font-medium text-slate-600">
        <a href="#hero" class="hover:text-red-500 transition-colors">{{ $t('nav.home') }}</a>
        <a href="#about" class="hover:text-red-500 transition-colors">{{ $t('nav.about') }}</a>
        <a href="#services" class="hover:text-red-500 transition-colors">{{ $t('nav.services') }}</a>
        <a href="#whyus" class="hover:text-red-500 transition-colors">{{ $t('nav.whyus') }}</a>
        <a href="#team" class="hover:text-red-500 transition-colors">{{ $t('nav.team') }}</a>
        <a href="#blog" class="hover:text-red-500 transition-colors">{{ $t('nav.blog') }}</a>
        <a href="#contact" class="hover:text-red-500 transition-colors">{{ $t('nav.contact') }}</a>
      </nav>

      <!-- CTA Button -->
      <div class="hidden sm:flex items-center space-x-4 gap-4">
        <button 
          @click="handleOpenBooking"
          class="btn-kindergarten-primary cursor-pointer text-sm font-bold"
        >
          {{ $t('nav.bookAppointment') }}
        </button>
      </div>

      <!-- Mobile Hamburger Menu Button -->
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden p-2 text-slate-700 hover:text-red-500"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-b border-slate-100 px-4 pt-3 pb-6 space-y-3">
      <a href="#hero" @click="isMobileMenuOpen = false" class="block py-2 text-slate-700 font-medium hover:text-red-500">{{ $t('nav.home') }}</a>
      <a href="#about" @click="isMobileMenuOpen = false" class="block py-2 text-slate-700 font-medium hover:text-red-500">{{ $t('nav.about') }}</a>
      <a href="#services" @click="isMobileMenuOpen = false" class="block py-2 text-slate-700 font-medium hover:text-red-500">{{ $t('nav.services') }}</a>
      <a href="#whyus" @click="isMobileMenuOpen = false" class="block py-2 text-slate-700 font-medium hover:text-red-500">{{ $t('nav.whyus') }}</a>
      <a href="#team" @click="isMobileMenuOpen = false" class="block py-2 text-slate-700 font-medium hover:text-red-500">{{ $t('nav.team') }}</a>
      <a href="#blog" @click="isMobileMenuOpen = false" class="block py-2 text-slate-700 font-medium hover:text-red-500">{{ $t('nav.blog') }}</a>
      <a href="#contact" @click="isMobileMenuOpen = false" class="block py-2 text-slate-700 font-medium hover:text-red-500">{{ $t('nav.contact') }}</a>
      <button 
        @click="handleOpenBooking(); isMobileMenuOpen = false"
        class="w-full btn-kindergarten-primary text-center mt-2"
      >
        {{ $t('nav.bookAppointment') }}
      </button>
    </div>
  </header>
</template>
