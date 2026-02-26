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


const isLinkValue = (value: string) =>
  value.startsWith('http://') ||
  value.startsWith('https://') ||
  value.startsWith('mailto:') ||
  value.startsWith('tel:')

const formatInfoLabel = (item: InfoItem) => `${item.key}:`
</script>

<template>
  <header class="navbar bg-base-100 border-b border-base-200 px-4 lg:px-8">
    <div class="flex-1 gap-3">
      <label
        v-if="props.showSidebar"
        for="main-drawer"
        class="btn btn-ghost btn-square lg:hidden"
      >
        <span class="sr-only">{{ $t('site.toggleSidebar') }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      <NuxtLink to="/" class="flex items-center gap-2">
        <img
          v-if="props.lightLogo"
          :src="props.lightLogo"
          alt="Logo"
          class="h-8 w-auto dark:hidden"
        />
        <img
          v-if="props.darkLogo"
          :src="props.darkLogo"
          alt="Logo"
          class="hidden h-8 w-auto dark:block"
        />
        <span v-if="!props.lightLogo && !props.darkLogo" class="text-lg font-semibold">
          {{ $t('site.brand') }}
        </span>
      </NuxtLink>

      <nav class="hidden lg:block">
        <ul class="menu menu-horizontal px-1">
          <li v-for="menu in props.menus" :key="menu.label">
            <NuxtLink :to="$localePath(menu.href)">{{ menu.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="hidden lg:flex items-center gap-4 text-sm text-base-content/70">
      <div
        v-for="item in props.info"
        :key="item.key"
        class="flex items-center gap-1 whitespace-nowrap"
      >
        <span class="font-semibold">{{ formatInfoLabel(item) }}</span>
        <a v-if="isLinkValue(item.value)" :href="item.value" class="link link-hover">
          {{ item.value }}
        </a>
        <span v-else>{{ item.value }}</span>
      </div>
    </div>

    <div class="dropdown ltr:dropdown-end rtl:dropdown-start lg:hidden">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <span class="sr-only">{{ $t('site.openMenu') }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>
      <ul tabindex="0" class="menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
        <li v-for="menu in props.menus" :key="menu.label">
          <NuxtLink :to="$localePath(menu.href)">{{ menu.label }}</NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>
