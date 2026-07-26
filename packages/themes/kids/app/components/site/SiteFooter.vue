<script setup lang="ts">
import type { InfoItem, MenuItem } from '~~/packages/base/utils/settings'

type Props = {
  menus: MenuItem[]
  darkLogo: string
  lightLogo: string
  info: InfoItem[]
}

const props = defineProps<Props>()
const { locale, setLocale, t, availableLocales } = useI18n()
</script>

<template>
  <footer class="relative overflow-hidden" style="background: var(--kids-bg-alt);">
    <!-- Decorative blobs -->
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />

    <div class="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
      <!-- Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
        <!-- Brand / Logo + Social -->
        <div class="lg:col-span-4">
          <div class="clay-card !rounded-2xl !p-6 h-full">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                style="background: var(--kids-bg-alt);"
              >
                ❤️
              </div>
              <div>
                <h3 class="font-fredoka text-xl font-bold" style="color: var(--kids-text);">
                  KidsMed
                </h3>
                <p class="text-xs font-semibold" style="color: var(--kids-primary-dark);">
                  Pediatric Clinic
                </p>
              </div>
            </div>
            <p class="text-sm leading-relaxed mb-5" style="color: var(--kids-text-muted);">
              {{ $t('site.description') || 'Gentle, expert care for every child, from checkups to happy smiles.' }}
            </p>
            <!-- Social Links -->
            <div class="flex gap-3">
              <a
                href="#"
                class="clay-btn !h-10 !w-10 !rounded-full !p-0 !flex !items-center !justify-center !bg-white !text-lg hover:!scale-110"
                style="color: var(--kids-primary);"
                aria-label="Facebook"
              >👍</a>
              <a
                href="#"
                class="clay-btn !h-10 !w-10 !rounded-full !p-0 !flex !items-center !justify-center !bg-white !text-lg hover:!scale-110"
                style="color: var(--kids-primary);"
                aria-label="Instagram"
              >📸</a>
              <a
                href="#"
                class="clay-btn !h-10 !w-10 !rounded-full !p-0 !flex !items-center !justify-center !bg-white !text-lg hover:!scale-110"
                style="color: var(--kids-primary);"
                aria-label="X (Twitter)"
              >🐦</a>
              <a
                href="#"
                class="clay-btn !h-10 !w-10 !rounded-full !p-0 !flex !items-center !justify-center !bg-white !text-lg hover:!scale-110"
                style="color: var(--kids-primary);"
                aria-label="LinkedIn"
              >💼</a>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="lg:col-span-3">
          <div class="clay-card !rounded-2xl !p-6 h-full">
            <h4 class="font-fredoka text-base font-bold mb-4 flex items-center gap-2" style="color: var(--kids-text);">
              <span>📋</span> {{ $t('site.menu') || 'Quick Links' }}
            </h4>
            <ul class="space-y-3">
              <li v-for="menu in props.menus" :key="menu.label">
                <NuxtLink
                  :to="$localePath(menu.href)"
                  class="flex items-center gap-2 text-sm font-semibold transition-all hover:translate-x-1"
                  style="color: var(--kids-text-muted);"
                  active-class="!text-[var(--kids-primary)]"
                >
                  <span style="color: var(--kids-primary);">▸</span>
                  {{ menu.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="lg:col-span-3">
          <div class="clay-card !rounded-2xl !p-6 h-full">
            <h4 class="font-fredoka text-base font-bold mb-4 flex items-center gap-2" style="color: var(--kids-text);">
              <span>📞</span> {{ $t('site.contact') || 'Contact Us' }}
            </h4>
            <ul class="space-y-3">
              <li
                v-for="item in props.info"
                :key="item.key"
                class="flex items-start gap-3 text-sm"
                style="color: var(--kids-text-muted);"
              >
                <span class="mt-0.5 shrink-0 text-base">{{ item.emoji || '📍' }}</span>
                <div>
                  <span class="font-semibold" style="color: var(--kids-text);">{{ item.key }}:</span>
                  <span>{{ item.value }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Language Selector -->
        <div class="lg:col-span-2">
          <div class="clay-card !rounded-2xl !p-6 h-full">
            <h4 class="font-fredoka text-base font-bold mb-4 flex items-center gap-2" style="color: var(--kids-text);">
              <span>🌐</span> {{ $t('site.language') || 'Language' }}
            </h4>
            <select
              class="w-full rounded-xl border-2 px-3 py-2.5 text-sm font-semibold outline-none transition-all focus:scale-[1.02]"
              :value="locale"
              style="
                border-color: var(--kids-border);
                background: var(--kids-white);
                color: var(--kids-text);
                font-family: 'Fredoka', 'Vazirmatn', sans-serif;
              "
              @change="setLocale(($event.target as HTMLSelectElement).value as 'en' | 'fa')"
            >
              <option
                v-for="item in availableLocales"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="relative z-10 border-t" style="border-color: var(--kids-border);">
      <div class="mx-auto max-w-6xl px-6 py-5">
        <p
          class="text-center text-xs font-semibold"
          style="color: var(--kids-text-muted);"
        >
          © {{ new Date().getFullYear() }} KidsMed Pediatric Clinic. {{ $t('site.rights') || 'All rights reserved.' }}
          <span class="inline-block mx-1">💚</span>
        </p>
      </div>
    </div>
  </footer>
</template>