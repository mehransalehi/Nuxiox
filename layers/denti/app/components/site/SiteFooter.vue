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
  <footer class="space-y-6 border-t border-sky-100 bg-sky-100/70 px-4 py-8 md:px-8">
    <h2 class="text-center text-4xl font-extrabold uppercase leading-none text-sky-400 md:text-6xl">Denta Care Health</h2>
    <div class="grid gap-6 rounded-3xl bg-sky-200/60 p-6 md:grid-cols-3">
      <div class="space-y-3 text-sm">
        <p class="font-bold text-sky-700">DENTA CARE</p>
        <p class="opacity-80">{{ t('site.stayConnected') }}</p>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">{{ t('site.menu') }}</h3>
        <ul class="space-y-1 text-sm">
          <li v-for="menu in props.menus" :key="menu.label"><NuxtLink :to="menu.href" class="hover:text-sky-600">{{ menu.label }}</NuxtLink></li>
        </ul>
      </div>
      <div class="space-y-3">
        <h3 class="font-semibold">{{ t('site.language') }}</h3>
        <select class="select select-bordered w-full max-w-xs" :value="locale" @change="setLocale(($event.target as HTMLSelectElement).value as 'en' | 'fa')">
          <option v-for="item in availableLocales" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </div>
    </div>
  </footer>
</template>
