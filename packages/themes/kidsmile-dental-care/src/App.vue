<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '~~/packages/base/app/stores/modal'

// Sections
import Navbar from '../components/sections/Navbar.vue'
import Hero from '../components/sections/Hero.vue'
import About from '../components/sections/About.vue'
import Services from '../components/sections/Services.vue'
import Whyus from '../components/sections/Whyus.vue'
import Testimonials from '../components/sections/Testimonials.vue'
import Team from '../components/sections/Team.vue'
import Blog from '../components/sections/Blog.vue'
import Contact from '../components/sections/Contact.vue'
import Footer from '../components/sections/Footer.vue'

// UI Modals
import BookingModal from '../components/ui/BookingModal.vue'
import ImageModal from '../components/ui/ImageModal.vue'

// Icons & Helpers
import { Globe, Sparkles, Play, Pause, RotateCcw, Award, CheckCircle2 } from 'lucide-vue-next'

const { locale } = useI18n()
const modalStore = useModalStore()

const currentLang = ref<'en' | 'fa' | 'ar'>('en')
const isBrushTimerOpen = ref(false)
const brushSeconds = ref(120)
const isBrushing = ref(false)
const brushStars = ref(0)
let timerInterval: any = null

function switchLanguage(lang: 'en' | 'fa' | 'ar') {
  currentLang.value = lang
  locale.value = lang
  const dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lang)
}

function toggleBrushTimer() {
  if (isBrushing.value) {
    clearInterval(timerInterval)
    isBrushing.value = false
  } else {
    isBrushing.value = true
    timerInterval = setInterval(() => {
      if (brushSeconds.value > 0) {
        brushSeconds.value--
        if (brushSeconds.value % 30 === 0) {
          brushStars.value++
        }
      } else {
        clearInterval(timerInterval)
        isBrushing.value = false
        brushStars.value = 4
      }
    }, 1000)
  }
}

function resetBrushTimer() {
  clearInterval(timerInterval)
  isBrushing.value = false
  brushSeconds.value = 120
}

const navbarMenus = [
  { label: 'Home', href: '#hero' },
  { label: 'About Us', href: '#about' },
  { label: 'Dental Care', href: '#services' },
  { label: 'Why Us', href: '#whyus' },
  { label: 'Dentists', href: '#team' },
  { label: 'Smile Tips', href: '#blog' },
  { label: 'Contact', href: '#contact' }
]

const clinicInfo = [
  { key: 'Pediatric Care', value: '0 - 16 Years' },
  { key: 'Atmosphere', value: 'Playful & 100% Pain-Free' }
]

onMounted(() => {
  switchLanguage('en')
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white selection:bg-amber-300 selection:text-indigo-950 font-sans">
    
    <!-- Top Floating Language & Theme Control Bar -->
    <div class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-indigo-100/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1 font-bold text-indigo-950 bg-indigo-50 px-2.5 py-1 rounded-full">
          <Globe class="w-3.5 h-3.5 text-indigo-600" />
          <span>{{ $t('site.language') }}:</span>
        </span>
        <div class="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
          <button
            type="button"
            @click="switchLanguage('en')"
            :class="currentLang === 'en' ? 'bg-white text-indigo-950 shadow-xs font-black' : 'text-slate-600 font-semibold'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            🇺🇸 English (LTR)
          </button>
          <button
            type="button"
            @click="switchLanguage('fa')"
            :class="currentLang === 'fa' ? 'bg-white text-indigo-950 shadow-xs font-black' : 'text-slate-600 font-semibold'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-sans"
          >
            🇮🇷 فارسی (RTL)
          </button>
          <button
            type="button"
            @click="switchLanguage('ar')"
            :class="currentLang === 'ar' ? 'bg-white text-indigo-950 shadow-xs font-black' : 'text-slate-600 font-semibold'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-sans"
          >
            🇸🇦 العربية (RTL)
          </button>
        </div>
      </div>

      <!-- Quick Interactive Widget: Kids 2-Minute Tooth Brushing Game / Adventure -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="isBrushTimerOpen = !isBrushTimerOpen"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs transition-colors cursor-pointer border border-amber-300"
        >
          <span>🪥</span>
          <span>Kids 2-Min Brushing Game</span>
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
        </button>
      </div>
    </div>

    <!-- Kids Brushing Timer Drawer Popup if active -->
    <div
      v-if="isBrushTimerOpen"
      class="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white px-4 py-4 border-b-4 border-amber-400 animate-fade-in"
    >
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 text-start">
          <div class="w-12 h-12 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center text-2xl font-black shrink-0 animate-bounce">
            🦷
          </div>
          <div>
            <div class="text-xs font-bold text-amber-300 uppercase tracking-wide">Magical Dental Quest</div>
            <div class="text-sm sm:text-base font-black">2-Minute Super Brushing Timer</div>
            <div class="text-xs text-indigo-200">Brush circular motions around every little tooth!</div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Time Display -->
          <div class="text-2xl font-black font-mono tracking-widest text-amber-300 px-4 py-1.5 rounded-xl bg-black/40 border border-indigo-500/40">
            {{ Math.floor(brushSeconds / 60) }}:{{ (brushSeconds % 60).toString().padStart(2, '0') }}
          </div>

          <!-- Controls -->
          <button
            type="button"
            @click="toggleBrushTimer"
            class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <component :is="isBrushing ? Pause : Play" class="w-4 h-4" />
            <span>{{ isBrushing ? 'Pause Quest' : 'Start Brushing!' }}</span>
          </button>

          <button
            type="button"
            @click="resetBrushTimer"
            class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Reset Timer"
          >
            <RotateCcw class="w-4 h-4" />
          </button>

          <!-- Star Rewards -->
          <div class="flex items-center gap-1">
            <span v-for="i in 4" :key="i" class="text-base" :class="i <= brushStars ? 'opacity-100 scale-110 animate-wiggle' : 'opacity-30'">
              ⭐
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Nuxiox Theme Sections rendered in exact sequence -->
    <Navbar
      :menus="navbarMenus"
      :info="clinicInfo"
    />

    <main class="flex-1">
      <Hero />
      <About />
      <Services />
      <Whyus />
      <Testimonials />
      <Team />
      <Blog />
      <Contact />
    </main>

    <Footer
      :menus="navbarMenus"
      :info="clinicInfo"
    />

    <!-- Theme UI Modals -->
    <BookingModal
      :isOpen="modalStore.isBookingOpen"
      @close="modalStore.closeBooking()"
    />

    <ImageModal
      :imageUrl="modalStore.selectedImage"
      @close="modalStore.closeImage()"
    />
  </div>
</template>
