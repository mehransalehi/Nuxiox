<script setup lang="ts">
import { Smile, MapPin, Phone, Mail, Clock, Heart } from 'lucide-vue-next'

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


        const localePath = useLocalePath()

        // Locale-prefix internal paths, leave external/anchor links as-is
        function localeHref(href: string) {
          if (!href || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
            return href
          }
          return localePath(href)
        }
        </script>

<template>
  <footer class="bg-indigo-950 text-indigo-200 pt-16 pb-12 border-t-4 border-amber-400 relative overflow-hidden">
    <!-- Playful Floating Doodles in Footer -->
    <div class="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
      <div class="absolute top-8 left-12 text-3xl">⭐</div>
      <div class="absolute top-16 right-16 text-3xl">🦷</div>
      <div class="absolute bottom-8 left-1/3 text-3xl">🎈</div>
      <div class="absolute bottom-12 right-1/4 text-3xl">🌈</div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-indigo-800/80">
        
        <!-- Col 1: Brand Info & Mission (4 cols) -->
        <div class="lg:col-span-4 space-y-4 text-start">
          <a href="#hero" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-indigo-950 font-black shadow-md">
              <Smile class="w-6 h-6" />
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-black text-white tracking-tight">Kid<span class="text-amber-400">Smile</span></span>
              <span data-i18n="site.englishName" class="text-[10px] font-bold text-amber-300 uppercase tracking-widest">{{ $t('site.englishName') }}</span>
            </div>
          </a>

          <p data-i18n="footer.aboutText" class="text-xs sm:text-sm text-indigo-300 leading-relaxed max-w-sm">
            {{ $t('footer.aboutText') }}
          </p>

          <div class="flex items-center gap-3 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-indigo-900 hover:bg-amber-400 hover:text-indigo-950 flex items-center justify-center text-sm transition-colors" aria-label="Instagram" data-nuxiox-link="instagram_com">
              📸
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-indigo-900 hover:bg-amber-400 hover:text-indigo-950 flex items-center justify-center text-sm transition-colors" aria-label="Facebook" data-nuxiox-link="facebook_com">
              📘
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-indigo-900 hover:bg-amber-400 hover:text-indigo-950 flex items-center justify-center text-sm transition-colors" aria-label="YouTube" data-nuxiox-link="youtube_com">
              ▶️
            </a>
          </div>
        </div>

        <!-- Col 2: Quick Links (props.menus) (3 cols) -->
        <div class="lg:col-span-3 space-y-3 text-start">
          <h4 data-i18n="footer.quickLinks" class="text-sm font-extrabold text-white uppercase tracking-wider">{{ $t('footer.quickLinks') }}</h4>
          <ul class="space-y-2 text-xs sm:text-sm">
            <li v-for="menu in props.menus" :key="menu.href">
              <a :href="menu.href" class="text-indigo-300 hover:text-amber-300 transition-colors">
                {{ menu.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Col 3: Dental Care Programs (2 cols) -->
        <div class="lg:col-span-2 space-y-3 text-start">
          <h4 data-i18n="footer.carePrograms" class="text-sm font-extrabold text-white uppercase tracking-wider">{{ $t('footer.carePrograms') }}</h4>
          <ul class="space-y-2 text-xs text-indigo-300">
            <li><a data-i18n="services.service1Title" href="#services" class="hover:text-amber-300 transition-colors">{{ $t('services.service1Title') }}</a></li>
            <li><a data-i18n="services.service2Title" href="#services" class="hover:text-amber-300 transition-colors">{{ $t('services.service2Title') }}</a></li>
            <li><a data-i18n="services.service3Title" href="#services" class="hover:text-amber-300 transition-colors">{{ $t('services.service3Title') }}</a></li>
            <li><a data-i18n="services.service4Title" href="#services" class="hover:text-amber-300 transition-colors">{{ $t('services.service4Title') }}</a></li>
          </ul>
        </div>

        <!-- Col 4: Emergency & Clinic Location (3 cols) -->
        <div class="lg:col-span-3 space-y-3 text-start">
          <h4 data-i18n="footer.emergencyContact" class="text-sm font-extrabold text-white uppercase tracking-wider">{{ $t('footer.emergencyContact') }}</h4>
          <div class="space-y-2 text-xs text-indigo-300">
            <div class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span data-i18n="contact.addressVal">{{ $t('contact.addressVal') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-amber-400 shrink-0" />
              <a data-i18n="contact.phoneVal" href="tel:+18005437645" class="hover:text-amber-300 font-bold" data-nuxiox-link="tel_18005437645">{{ $t('contact.phoneVal') }}</a>
            </div>
            <div class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-amber-400 shrink-0" />
              <a data-i18n="topbar.email" href="mailto:smiles@kidsmiledental.com" class="hover:text-amber-300">{{ $t('topbar.email') }}</a>
            </div>
            <!-- Display info props if present -->
            <template v-if="props.info && props.info.length > 0">
              <div v-for="item in props.info" :key="item.key" class="text-[11px] text-indigo-400">
                {{ item.key }}: {{ item.value }}
              </div>
            </template>
          </div>
        </div>

      </div>

      <!-- Bottom Copyright & Friendly Credits -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-indigo-400">
        <div data-i18n="site.copyright">{{ $t('site.copyright') }}</div>
        <div class="flex items-center gap-1 text-indigo-300">
          <span data-i18n="footer.rights">{{ $t('footer.rights') }}</span>
        </div>
      </div>

    </div>
  </footer>
</template>
