<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteSettings, getInfoValue } from '../../composables/useSiteSettings';
import { Phone, MapPin, Clock, Moon, Sun, Menu, X, Calendar, Sparkles } from 'lucide-vue-next';

const props = defineProps<{
  menus?: { label: string; href: string }[];
  darkLogo?: string;
  lightLogo?: string;
  info?: { key: string; value: string }[];
  showSidebar?: boolean;
}>();

const { settings } = useSiteSettings();
const { locale, setLocale } = useI18n();

const isDark = ref(false);
const mobileMenuOpen = ref(false);

const phone = computed(() => {
  if (props.info?.length) {
    const p = props.info.find(i => i.key === 'phone');
    if (p) return p.value;
  }
  return getInfoValue(settings.value, 'phone', '+49 30 892 1011');
});

const location = computed(() => getInfoValue(settings.value, 'location', 'Germany, Berlin'));
const hours = computed(() => getInfoValue(settings.value, 'hours', 'Mon-Sat: 08:00 - 19:00'));

const navLinks = computed(() => {
  if (props.menus && props.menus.length) return props.menus;
  return settings.value.navbar.menus;
});

onMounted(() => {
  const saved = localStorage.getItem('theme-preference');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    isDark.value = false;
    document.documentElement.setAttribute('data-theme', 'light');
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  const theme = isDark.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme-preference', theme);
};

const changeLanguage = (lang: 'en' | 'fa' | 'ar') => {
  locale.value = lang;
  document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
    <!-- Top info bar -->
    <div class="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-4 sm:gap-6">
          <span class="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
            <MapPin class="w-3.5 h-3.5 text-cyan-400" />
            <span>{{ location }}</span>
          </span>
          <span class="hidden sm:flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
            <Clock class="w-3.5 h-3.5 text-cyan-400" />
            <span>{{ hours }}</span>
          </span>
        </div>

        <div class="flex items-center gap-4">
          <a :href="`tel:${phone}`" class="flex items-center gap-1.5 text-cyan-300 font-medium hover:text-cyan-200">
            <Phone class="w-3.5 h-3.5 text-cyan-400" />
            <span>{{ phone }}</span>
          </a>

          <div class="h-3 w-px bg-slate-700"></div>

          <!-- Language Selector -->
          <div class="flex items-center gap-1 text-[11px] font-semibold tracking-wider">
            <button 
              @click="changeLanguage('en')" 
              :class="locale === 'en' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-1 py-0.5 rounded transition-colors"
            >
              EN
            </button>
            <span class="text-slate-600">|</span>
            <button 
              @click="changeLanguage('fa')" 
              :class="locale === 'fa' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-1 py-0.5 rounded transition-colors"
            >
              فا
            </button>
            <span class="text-slate-600">|</span>
            <button 
              @click="changeLanguage('ar')" 
              :class="locale === 'ar' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-1 py-0.5 rounded transition-colors"
            >
              عرب
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
          <Sparkles class="w-5 h-5" />
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-black tracking-widest text-slate-900 dark:text-white font-mono uppercase">
            IVORY
          </span>
          <span class="text-[10px] tracking-widest uppercase text-cyan-600 dark:text-cyan-400 font-semibold -mt-1">
            Dental Clinic
          </span>
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-8">
        <a 
          v-for="item in navLinks" 
          :key="item.href" 
          :href="item.href"
          class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
        >
          {{ $t(`nav.${item.label.toLowerCase().replace(/\s+/g, '')}`) || item.label }}
        </a>
      </nav>

      <!-- Action Buttons & Theme Switcher -->
      <div class="hidden md:flex items-center gap-4">
        <button 
          @click="toggleTheme"
          class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="isDark ? $t('common.lightMode') : $t('common.darkMode')"
        >
          <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-slate-600" />
        </button>

        <a 
          href="/#contact"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00C4DF] hover:bg-[#0284C7] text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <Calendar class="w-4 h-4" />
          <span>{{ $t('nav.bookConsultation') }}</span>
        </a>
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex items-center gap-2 md:hidden">
        <button 
          @click="toggleTheme"
          class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
        >
          <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4" />
        </button>

        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X v-if="mobileMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4">
      <div class="flex flex-col space-y-3">
        <a 
          v-for="item in navLinks" 
          :key="item.href" 
          :href="item.href"
          @click="mobileMenuOpen = false"
          class="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-500 py-1"
        >
          {{ item.label }}
        </a>
      </div>

      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
        <a 
          href="/#contact"
          @click="mobileMenuOpen = false"
          class="w-full py-3 rounded-full bg-[#00C4DF] text-white text-center font-semibold text-sm shadow-md"
        >
          {{ $t('nav.bookConsultation') }}
        </a>
      </div>
    </div>
  </header>
</template>
