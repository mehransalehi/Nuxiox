<script setup lang="ts">
import type { UserSession } from '~~/layers/base/types/user-session'

const mobileSidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const isDark = ref(false)
const { settings } = useSiteSettings()
const { locale, setLocale } = useI18n()

const direction = computed(() => settings.value.general.direction ?? 'ltr')

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

/*watch(
  () => settings.value.general.language,
  (value) => {
    setLocale(value)
  },
  { immediate: true }
)*/

useHead(() => ({
  htmlAttrs: {
    dir: direction.value,
    lang: locale.value,
    class: direction.value,
  },
}))
</script>

<template>
  <div class="relative flex min-h-screen bg-base-200 text-base-content">
    <UiToastStack />
    <div v-if="mobileSidebarOpen" class="fixed inset-0 z-30 bg-base-content/40 lg:hidden"
      @click="mobileSidebarOpen = false" />

    <div :class="[
      'fixed inset-y-0 z-40 transform transition-all duration-300 lg:static lg:translate-x-0!',
      'ltr:left-0 rtl:right-0',
      mobileSidebarOpen ? 'translate-x-0' : '',
      !mobileSidebarOpen && 'ltr:-translate-x-full',
      !mobileSidebarOpen && 'rtl:translate-x-full',
      sidebarCollapsed ? 'w-24' : 'w-72',
      sidebarCollapsed ? 'w-24' : 'w-72',
    ]">
      <AdminSidebar :collapsed="sidebarCollapsed" :user-email="user?.email" @logout="logout" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminTopbar :sidebar-collapsed="sidebarCollapsed" :is-dark="isDark" :user-email="user?.email"
        @toggle-sidebar="toggleSidebar" @toggle-mobile-sidebar="toggleMobileSidebar" @toggle-theme="toggleTheme"
        @logout="logout" />

      <main class="p-4 sm:p-6">
        <div class="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
