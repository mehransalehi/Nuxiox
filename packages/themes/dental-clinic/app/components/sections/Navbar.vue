<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  Phone, 
  Clock, 
  Calendar, 
  Menu, 
  X, 
  ShieldAlert, 
  Smile,
  Globe,
  Sun,
  Moon
} from 'lucide-vue-next';

const props = defineProps<{
  menus?: { label: string; href: string }[];
  darkLogo?: string;
  lightLogo?: string;
  info?: { key: string; value: string }[];
  showSidebar?: boolean;
}>();

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const isDarkMode = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const getInfoValue = (keyName: string) => {
  if (!props.info) return '';
  const match = props.info.find(i => i.key.toLowerCase() === keyName.toLowerCase());
  return match ? match.value : '';
};
</script>

<template>
  <header class="sticky top-0 z-50 w-full transition-all duration-300">
    <!-- Top Contact Bar -->
    <div class="bg-teal-900 text-teal-100 text-xs py-2 px-4 sm:px-8 border-b border-teal-800">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center space-x-6">
          <span class="flex items-center gap-1.5 font-medium">
            <Phone class="w-3.5 h-3.5 text-teal-300" />
            <a :href="'tel:' + (getInfoValue('phone') || '+18005557645')" class="hover:underline">
              {{ getInfoValue('phone') || '+1 (800) 555-SMILE' }}
            </a>
          </span>
          <span class="hidden md:flex items-center gap-1.5 text-teal-200">
            <Clock class="w-3.5 h-3.5 text-teal-300" />
            {{ getInfoValue('hours') || 'Mon-Sat: 8:00 AM - 7:00 PM' }}
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <a href="/emergency-care" class="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition">
            <ShieldAlert class="w-3.5 h-3.5" />
            <span>24/7 Emergency Triage</span>
          </a>
          <button @click="toggleDarkMode" class="p-1 rounded text-teal-200 hover:text-white transition" title="Toggle Theme">
            <Sun v-if="isDarkMode" class="w-3.5 h-3.5" />
            <Moon v-else class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <nav 
      class="transition-all duration-300 glass-header border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3"
      :class="isScrolled ? 'shadow-md py-2.5' : 'py-3.5'"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30 group-hover:scale-105 transition-transform">
            <Smile class="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              SmileCraft <span class="text-teal-600 dark:text-teal-400 font-extrabold text-sm uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800">Dental</span>
            </span>
            <span class="block text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Advanced Cosmetic & Family Clinic
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden lg:flex items-center space-x-1">
          <a 
            v-for="(menu, idx) in (menus || [])" 
            :key="idx"
            :href="menu.href"
            class="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all"
          >
            {{ menu.label }}
          </a>
        </div>

        <!-- Header Action CTA -->
        <div class="hidden md:flex items-center space-x-3">
          <a 
            href="#contact" 
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-sm shadow-teal-600/20 hover:shadow-teal-600/40 transition-all duration-200"
          >
            <Calendar class="w-4 h-4" />
            <span>Book Appointment</span>
          </a>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle Navigation"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu Drawer -->
      <div 
        v-if="mobileMenuOpen" 
        class="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 px-2 pb-4 space-y-1 animate-fadeIn"
      >
        <a 
          v-for="(menu, idx) in (menus || [])" 
          :key="idx"
          :href="menu.href"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2.5 text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg transition"
        >
          {{ menu.label }}
        </a>
        <div class="pt-2">
          <a 
            href="#contact" 
            @click="mobileMenuOpen = false"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white font-semibold rounded-xl"
          >
            <Calendar class="w-4 h-4" />
            <span>Book Appointment</span>
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>
