<script setup lang="ts">
interface NavItem {
  to: string
  label: string
  icon?: string
}

defineProps<{ collapsed: boolean }>()

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Main',
    items: [
      { to: '/admin', label: 'Dashboard', icon: '🏠' },
      { to: '/admin/orders', label: 'Orders', icon: '🧾' },
      { to: '/admin/customers', label: 'Customers', icon: '👥' },
    ],
  },
  {
    title: 'Management',
    items: [
      { to: '/admin/products', label: 'Products', icon: '📦' },
      { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ],
  },
]
</script>

<template>
  <aside class="h-full border-r border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
    <div class="flex h-full flex-col gap-6 p-3">
      <div class="flex items-center gap-3 px-2 pt-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">A</div>
        <div v-if="!collapsed" class="overflow-hidden">
          <p class="font-bold leading-5">Admin Panel</p>
          <p class="text-xs opacity-60">Base Layer</p>
        </div>
      </div>

      <div class="space-y-4 overflow-y-auto">
        <AdminSidebarSection
          v-for="section in sections"
          :key="section.title"
          :title="section.title"
          :items="section.items"
          :collapsed="collapsed"
        />
      </div>
    </div>
  </aside>
</template>
