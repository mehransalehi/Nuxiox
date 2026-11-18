<script setup lang="ts">
import type { UserSession } from '~~/packages/base/types/user-session'

const { user, clear: clearSession } = useUserSession() as {
  user: Ref<UserSession | null>
  clear: () => Promise<void>
}

const logout = async () => {
  await clearSession()
  await navigateTo('/user/login')
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- Top navigation bar -->
    <nav class="bg-base-100 border-b border-base-300 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/user" class="font-bold text-lg">داشبورد کاربری</NuxtLink>
        <NuxtLink to="/user" class="text-sm hover:underline">خانه</NuxtLink>
        <NuxtLink to="/user/profile" class="text-sm hover:underline">پروفایل</NuxtLink>
        <NuxtLink to="/user/knowledge" class="text-sm hover:underline">دانش‌ها</NuxtLink>
        <NuxtLink to="/user/knowledge/types" class="text-sm hover:underline">انواع دانش</NuxtLink>
        <NuxtLink to="/user/usage" class="text-sm hover:underline">مصرف</NuxtLink>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm opacity-70">{{ user?.email }}</span>
        <button @click="logout" class="btn btn-ghost btn-sm text-error">خروج</button>
      </div>
    </nav>

    <main class="p-6 max-w-6xl mx-auto">
      <slot />
    </main>
  </div>
</template>