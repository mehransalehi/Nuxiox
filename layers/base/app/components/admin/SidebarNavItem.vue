<script setup lang="ts">
const props = defineProps<{
  to: string
  label: string
  icon?: string
  collapsed?: boolean
}>()
</script>

<template>
  <li>
    <NuxtLink
      :to="props.to"
      :title="props.collapsed ? props.label : ''"
      class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
    >
      <span v-if="props.icon">{{ props.icon }}</span>
      <span v-if="!props.collapsed">{{ props.label }}</span>
    </NuxtLink>
  </li>
</template>
