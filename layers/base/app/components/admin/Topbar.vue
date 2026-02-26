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
  <header class="flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 sm:px-6">
    <div class="flex items-center gap-3">
      <button
        class="btn btn-ghost btn-square btn-sm border border-base-300 lg:hidden"
        :aria-label="$t('admin.topbar.openSidebar')"
        @click="emit('toggleMobileSidebar')"
      >
        <i class="fa-solid fa-bars" aria-hidden="true" />
      </button>

      <div class="hidden lg:block">
        <AdminSidebarToggleButton :is-collapsed="sidebarCollapsed" @toggle="emit('toggleSidebar')" />
      </div>

      <div>
        <h1 class="text-lg font-bold">{{ $t('admin.topbar.title') }}</h1>
        <p class="text-xs opacity-60">{{ $t('admin.topbar.subtitle') }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <AdminThemeToggleButton :is-dark="isDark" @toggle="emit('toggleTheme')" />

      <div class="dropdown ltr:dropdown-end rtl:dropdown-start">
        <button
          tabindex="0"
          class="btn btn-ghost btn-sm border px-2"
          type="button"
          :aria-label="$t('admin.topbar.openUserMenu')"
        >
          <div class="avatar placeholder">
            <div class="h-8 w-8 rounded-full bg-base-300 text-base-content flex justify-center items-center">
              <i class="fa-solid fa-user" aria-hidden="true" />
            </div>
          </div>
        </button>

        <ul tabindex="0" class="menu dropdown-content z-60 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow">
          <li class="menu-title px-2 py-1 text-xs normal-case opacity-70">{{ userEmail }}</li>
          <li>
            <button type="button" class="text-error" @click="emit('logout')">
              <i class="fa-solid fa-right-from-bracket" aria-hidden="true" />
              {{ $t('admin.topbar.logout') }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
