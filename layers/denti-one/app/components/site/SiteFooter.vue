<script setup lang="ts">
import type { InfoItem, MenuItem } from '~~/layers/base/utils/settings'

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
  <footer class="space-y-6 border-t border-sky-100 bg-[#ecf7ff] px-4 py-8 md:px-8">
    <h2 class="denti-one-gradient-title text-center text-4xl font-extrabold uppercase leading-none md:text-7xl">Smile care, crafted daily</h2>

    <div class="grid gap-5 rounded-3xl bg-white/70 p-6 md:grid-cols-3">
      <div class="space-y-2 text-sm">
        <p class="font-bold uppercase tracking-[0.2em] text-sky-700">{{ $t('site.information') }}</p>
        <ul class="space-y-1 opacity-80">
          <li v-for="item in props.info" :key="item.key">{{ item.key }}: {{ item.value }}</li>
        </ul>
      </div>

      <div>
        <h3 class="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">{{ $t('site.menu') }}</h3>
        <ul class="space-y-1 text-sm">
          <li v-for="menu in props.menus" :key="menu.label"><NuxtLink :to="$localePath(menu.href)" class="hover:text-sky-600">{{ menu.label }}</NuxtLink></li>
        </ul>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">{{ $t('site.language') }}</h3>
        <select class="select select-bordered w-full" :value="locale" @change="setLocale(($event.target as HTMLSelectElement).value as 'en' | 'fa')">
          <option v-for="item in availableLocales" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </div>
    </div>
  </footer>
</template>
