<script setup lang="ts">
import type { InfoItem, MenuItem } from '~~/layers/base/utils/settings'
import { useI18n } from '#imports'

type Props = { menus: MenuItem[]; info: InfoItem[] }
const props = defineProps<Props>()
const { locale, setLocale, availableLocales } = useI18n()
</script>

<template>
  <footer class="border-t" style="background: var(--d-bg); border-color: var(--d-border);">
    <div class="container-premium py-16">
      <div class="grid md:grid-cols-4 gap-10">
        <div class="md:col-span-2">
          <NuxtLink to="/" class="inline-flex items-center gap-3 mb-4">
            <span class="font-heading text-2xl font-black tracking-tight">
              <span class="gold-text">D</span>entalis
            </span>
          </NuxtLink>
          <p class="text-sm max-w-xs leading-relaxed" style="color: var(--d-text-muted);">
            Premium dental care crafted with precision, passion, and an unwavering commitment to your smile.
          </p>
          <div class="flex gap-3 mt-6">
            <a v-for="(s, k) in {ig:'Instagram',fb:'Facebook',x:'Twitter'}" :key="k"
              href="#" class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold transition-all hover:bg-[var(--d-accent)] hover:text-white"
              style="background: var(--d-bg-alt); color: var(--d-text-muted);">{{ k }}</a>
          </div>
        </div>

        <div>
          <h4 class="font-heading font-bold text-sm mb-4">Quick Links</h4>
          <ul class="space-y-3">
            <li v-for="m in props.menus" :key="m.label">
              <NuxtLink :to="m.href" class="text-sm transition-all hover:text-[var(--d-accent)]"
                style="color: var(--d-text-muted);">{{ m.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-heading font-bold text-sm mb-4">Language</h4>
          <div class="flex gap-2">
            <button v-for="l in availableLocales" :key="l.code"
              class="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              :class="locale === l.code ? 'bg-[var(--d-accent)] text-white' : 'bg-[var(--d-bg-alt)] text-[var(--d-text-muted)] hover:bg-[var(--d-border)]'"
              @click="setLocale(l.code as 'en' | 'fa')">{{ l.label }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t py-6 text-center" style="border-color: var(--d-border);">
      <p class="text-xs" style="color: var(--d-text-muted);">© 2026 Dentalis. All rights reserved.</p>
    </div>
  </footer>
</template>