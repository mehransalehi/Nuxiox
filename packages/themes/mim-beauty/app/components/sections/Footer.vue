<script setup lang="ts">
defineProps<{
  menus?: { label: string; href: string }[]
  darkLogo?: string
  lightLogo?: string
  info?: { key: string; value: string }[]
}>()

const { locale } = useI18n()
const localePath = useLocalePath()

// Helper: locale-prefix internal paths, leave external/anchor links as-is
function localeHref(href: string) {
  if (!href || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
    return href
  }
  return localePath(href)
}
</script>

<template>
  <footer class="w-full bg-[#141414] text-white border-t border-white/10 py-12 relative z-10">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
      
      <!-- Logo + Brand -->
      <div class="flex items-center gap-3">
        <img
          v-if="lightLogo"
          :src="lightLogo"
          :alt="$t('site.name')"
          class="h-10 w-auto brightness-0 invert"
        />
        <span v-else class="font-serif italic text-3xl font-normal text-[#D4AF37]">MB</span>
        <span class="text-xs text-stone-400">{{ $t('site.footerSubtitle') }}</span>
      </div>

      <!-- Footer nav links -->
      <nav v-if="menus && menus.length > 0" class="flex items-center gap-6 text-xs text-stone-400">
        <a
          v-for="item in menus"
          :key="item.href"
          :href="localeHref(item.href)"
          class="hover:text-white transition-colors"
        >{{ item.label }}</a>
      </nav>

      <!-- Social links -->
      <div class="flex items-center gap-4 text-white text-base">
        <a href="https://instagram.com" target="_blank" class="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#C5A059] transition-colors" :aria-label="$t('hero.instagram')"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://t.me" target="_blank" class="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#C5A059] transition-colors" aria-label="Telegram"><i class="fa-brands fa-telegram"></i></a>
        <a href="https://whatsapp.com" target="_blank" class="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#C5A059] transition-colors" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
      </div>

      <p class="text-xs text-stone-500">
        {{ $t('site.copyright') }}
      </p>
    </div>
  </footer>
</template>