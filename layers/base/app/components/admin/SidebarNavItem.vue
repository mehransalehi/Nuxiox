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
      class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
      active-class="active"
    >
      <i v-if="props.icon" :class="props.icon" class="w-4 text-center" aria-hidden="true" />
      <span v-if="!props.collapsed">{{ props.label }}</span>
    </NuxtLink>
  </li>
</template>
