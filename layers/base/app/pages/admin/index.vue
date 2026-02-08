<script setup lang="ts">
import type { UserSession } from '~~/layers/base/types/user-session'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'admin',
})

const { user, clear: clearSession } = useUserSession() as { user: Ref<UserSession | null>, clear: () => Promise<void> }
const { t } = useI18n()

async function logout() {
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">{{ t('admin.dashboard.welcomeBack') }}</h2>
        <p class="opacity-70">{{ user?.email ?? t('admin.dashboard.noUser') }}</p>
      </div>
      <button class="btn btn-outline btn-sm" @click="logout">
        {{ t('admin.dashboard.logout') }}
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in [t('admin.dashboard.revenue'), t('admin.dashboard.orders'), t('admin.dashboard.users'), t('admin.dashboard.conversion')]"
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
        <h3 class="card-title">{{ t('admin.dashboard.overview') }}</h3>
        <p>{{ t('admin.dashboard.overviewBody') }}</p>
      </div>
    </article>
  </section>
</template>
