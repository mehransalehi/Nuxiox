<script setup lang="ts">
import type { UserSession } from '~~/layers/base/types/user-session'

const mobileSidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const isDark = ref(false)

const { user, clear: clearSession } = useUserSession() as {
  user: Ref<UserSession | null>
  clear: () => Promise<void>
}

const applyTheme = (darkMode: boolean) => {
  if (import.meta.client) {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const logout = async () => {
  await clearSession()
  await navigateTo('/login')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme ? savedTheme === 'dark' : false
  applyTheme(isDark.value)
})
</script>

<template>
  <div class="relative flex min-h-screen bg-[rgb(var(--bg-soft))] text-[rgb(var(--text))]">
    <div
      v-if="mobileSidebarOpen"
      class="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
      @click="mobileSidebarOpen = false"
    />

    <div
      :class="[
        'fixed inset-y-0 left-0 z-40 transform transition-all duration-300 lg:static lg:translate-x-0',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        sidebarCollapsed ? 'w-24' : 'w-72',
      ]"
    >
      <AdminSidebar :collapsed="sidebarCollapsed" :user-email="user?.email" @logout="logout" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminTopbar
        :sidebar-collapsed="sidebarCollapsed"
        :is-dark="isDark"
        :user-email="user?.email"
        @toggle-sidebar="toggleSidebar"
        @toggle-mobile-sidebar="toggleMobileSidebar"
        @toggle-theme="toggleTheme"
        @logout="logout"
      />

      <main class="p-4 sm:p-6">
        <div class="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-4 shadow-sm sm:p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
