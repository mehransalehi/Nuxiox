<script setup lang="ts">
import type { UserSession } from '~~/layers/base/types/user-session'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'admin',
})

const { user, clear: clearSession } = useUserSession() as { user: Ref<UserSession | null>, clear: () => Promise<void> }

async function logout() {
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">Welcome back</h2>
        <p class="opacity-70">{{ user?.email ?? 'No user loaded' }}</p>
      </div>
      <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium" @click="logout">
        Logout
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in ['Revenue', 'Orders', 'Users', 'Conversion']"
        :key="card"
        class="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-soft))] p-4"
      >
        <p class="text-sm opacity-60">{{ card }}</p>
        <p class="text-2xl font-bold">+24%</p>
      </article>
    </div>

    <article class="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-soft))] p-5">
      <h3 class="mb-2 text-lg font-semibold">Overview</h3>
      <p>
        This is the main content section where each admin page details can be rendered inside the reusable admin base layout.
      </p>
    </article>
  </section>
</template>
