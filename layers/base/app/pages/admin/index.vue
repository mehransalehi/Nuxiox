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
      <button class="btn btn-outline btn-sm" @click="logout">
        Logout
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in ['Revenue', 'Orders', 'Users', 'Conversion']"
        :key="card"
        class="card border border-base-300 bg-base-200"
      >
        <div class="card-body p-4">
          <p class="text-sm opacity-60">{{ card }}</p>
          <p class="text-2xl font-bold">+24%</p>
        </div>
      </article>
    </div>

    <article class="card border border-base-300 bg-base-200">
      <div class="card-body">
        <h3 class="card-title">Overview</h3>
        <p>
          This is the main content section where each admin page details can be rendered inside the reusable admin base layout.
        </p>
      </div>
    </article>
  </section>
</template>
