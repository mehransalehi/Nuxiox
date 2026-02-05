<script setup lang="ts">
defineProps<{ sidebarCollapsed: boolean; isDark: boolean }>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleMobileSidebar: []
  toggleTheme: []
}>()
</script>

<template>
  <header class="flex items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 sm:px-6">
    <div class="flex items-center gap-3">
      <button
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 lg:hidden"
        aria-label="Open sidebar"
        @click="emit('toggleMobileSidebar')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="hidden lg:block">
        <AdminSidebarToggleButton :is-collapsed="sidebarCollapsed" @toggle="emit('toggleSidebar')" />
      </div>

      <div>
        <h1 class="text-lg font-bold">Dashboard</h1>
        <p class="text-xs opacity-60">Welcome to your admin workspace</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <AdminThemeToggleButton :is-dark="isDark" @toggle="emit('toggleTheme')" />
      <button class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90">New Report</button>
    </div>
  </header>
</template>
