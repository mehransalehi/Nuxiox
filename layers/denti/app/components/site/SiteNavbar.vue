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

</script>

<template>
  <header class="border-b border-sky-100 bg-sky-50/70 px-4 py-4 md:px-8">
    <div class="navbar min-h-0 p-0">
      <div class="flex-1 items-center gap-2">
        <NuxtLink to="/" class="text-sm font-extrabold uppercase tracking-widest text-sky-600">Denta Care</NuxtLink>
      </div>

      <nav class="hidden md:block">
        <ul class="menu menu-horizontal gap-1 p-0 text-xs font-semibold uppercase tracking-wider">
          <li v-for="menu in props.menus" :key="menu.label"><NuxtLink :to="$localePath(menu.href)">{{ menu.label }}</NuxtLink></li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink to="/contact" class="btn btn-sm rounded-full border-none bg-orange-500 text-white hover:bg-orange-600">
          {{ $t('sections.contact.send') }}
        </NuxtLink>
        <div class="dropdown dropdown-end md:hidden">
          <div tabindex="0" role="button" class="btn btn-sm btn-ghost">☰</div>
          <ul tabindex="0" class="menu dropdown-content z-10 mt-2 w-52 rounded-box bg-base-100 p-2 shadow">
            <li v-for="menu in props.menus" :key="menu.label"><NuxtLink :to="$localePath(menu.href)">{{ menu.label }}</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
