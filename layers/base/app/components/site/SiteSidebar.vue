<script setup lang="ts">
import type { MenuItem } from '~~/layers/base/utils/settings'

type Props = {
  menus: MenuItem[]
}

const props = defineProps<Props>()
const { t } = useI18n()
</script>

<template>
  <aside class="min-h-full w-72 bg-base-200 p-4">
    <div class="text-xs uppercase tracking-widest text-base-content/50 mb-4">
      {{ t('site.mainMenu') }}
    </div>
    <ul class="menu menu-vertical gap-1">
      <li v-for="menu in props.menus" :key="menu.label">
        <NuxtLink :to="menu.href">{{ menu.label }}</NuxtLink>
      </li>
    </ul>
  </aside>
</template>
