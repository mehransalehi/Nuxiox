<script setup lang="ts">
interface NavItem {
  to: string
  label: string
  icon?: string
}

defineProps<{ title: string; items: NavItem[]; collapsed: boolean }>()
</script>

<template>
  <div class="space-y-2">
    <p v-if="!collapsed" class="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {{ title }}
    </p>
    <ul class="space-y-1">
      <AdminSidebarNavItem
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :label="item.label"
        :icon="item.icon"
        :collapsed="collapsed"
      />
    </ul>
  </div>
</template>
