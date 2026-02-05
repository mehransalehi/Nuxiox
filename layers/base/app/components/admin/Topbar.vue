<script setup lang="ts">
defineProps<{
  sidebarCollapsed: boolean
  isDark: boolean
  userEmail?: string | null
}>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleMobileSidebar: []
  toggleTheme: []
  logout: []
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
        <i class="fa-solid fa-bars" aria-hidden="true" />
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

      <details class="dropdown dropdown-end">
        <summary class="list-none">
          <button class="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5" type="button">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700">
              <i class="fa-solid fa-user" aria-hidden="true" />
            </div>
            <i class="fa-solid fa-chevron-down text-xs opacity-70" aria-hidden="true" />
          </button>
        </summary>
        <ul class="menu dropdown-content z-[50] mt-2 w-56 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-2 shadow">
          <li class="menu-title !px-2 !py-1 text-xs normal-case opacity-70">{{ userEmail }}</li>
          <li>
            <button type="button" class="text-red-600" @click="emit('logout')">
              <i class="fa-solid fa-right-from-bracket" aria-hidden="true" />
              Logout
            </button>
          </li>
        </ul>
      </details>
    </div>
  </header>
</template>
