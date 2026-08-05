<script setup lang="ts">
defineProps<{
  menus?: { label: string; href: string }[]
  darkLogo?: string
  lightLogo?: string
  info?: { key: string; value: string }[]
}>()
</script>

<template>
  <footer class="w-full bg-[#141414] text-white border-t border-white/10 py-12 relative z-10">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
      
      <div class="flex items-center gap-3">
        <span class="font-serif italic text-3xl font-normal text-[#D4AF37]">MB</span>
        <span class="text-xs text-stone-400">{{ $t('site.footerSubtitle') }}</span>
      </div>

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
