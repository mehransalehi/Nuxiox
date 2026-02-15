<script setup lang="ts">
import type { InfoItem, MenuItem } from '~~/layers/base/utils/settings'

type Props = {
  menus: MenuItem[]
  darkLogo: string
  lightLogo: string
  info: InfoItem[]
  showSidebar: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const brand = computed(() => props.info?.[0]?.value || 'DentiCare')
</script>

<template>
  <header class="border-b border-sky-100 bg-[#eff8ff] px-4 py-4 md:px-8">
    <div class="mb-3 hidden items-center justify-between text-xs text-base-content/70 md:flex">
      <div class="flex items-center gap-5">
        <p v-for="item in props.info.slice(0, 2)" :key="item.key">{{ item.value }}</p>
      </div>
      <NuxtLink to="/contact" class="font-semibold text-sky-700 hover:text-sky-900">{{ t('sections.contact.send') }} ↗</NuxtLink>
    </div>

    <div class="navbar min-h-0 p-0">
      <div class="flex-1 items-center gap-2">
        <NuxtLink to="/" class="text-lg font-extrabold uppercase tracking-[0.25em] text-sky-600">{{ brand }}</NuxtLink>
      </div>

      <nav class="hidden md:block">
        <ul class="menu menu-horizontal gap-1 p-0 text-xs font-semibold uppercase tracking-wider">
          <li v-for="menu in props.menus" :key="menu.label"><NuxtLink :to="menu.href">{{ menu.label }}</NuxtLink></li>
        </ul>
      </nav>

      <div class="dropdown dropdown-end md:hidden">
        <div tabindex="0" role="button" class="btn btn-sm btn-ghost">☰</div>
        <ul tabindex="0" class="menu dropdown-content z-10 mt-2 w-56 rounded-box bg-base-100 p-2 shadow">
          <li v-for="menu in props.menus" :key="menu.label"><NuxtLink :to="menu.href">{{ menu.label }}</NuxtLink></li>
        </ul>
      </div>
    </div>
  </header>
</template>
