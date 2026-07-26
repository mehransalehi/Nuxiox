<script setup lang="ts">
interface NavItem {
  to: string
  label: any
  icon?: string
}

defineProps<{ title: any; items: NavItem[]; collapsed: boolean }>()
</script>

<template>
  <div class="space-y-2">
    <p v-if="!collapsed" class="px-3 text-xs font-semibold uppercase tracking-wide opacity-50">
      {{ title }}
    </p>
    <ul class="menu menu-sm space-y-1 w-full">
      <AdminSidebarNavItem
        v-for="item in items"
        :key="item.to"
        :to="$localePath(item.to)"
        :label="item.label"
        :icon="item.icon"
        :collapsed="collapsed"
      />
    </ul>
  </div>
</template>
