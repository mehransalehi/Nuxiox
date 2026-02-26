<script setup lang="ts">
import type { UserSession } from '~~/layers/base/types/user-session'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'admin',
})

const { t, locale } = useI18n()
useHead(() => ({ title: $t('admin.sidebar.dashboard') }))

const { user, clear: clearSession } = useUserSession() as {
  user: Ref<UserSession | null>
  clear: () => Promise<void>
}

const { data } = await useFetch<{
  usersCount: number
  pagesCount: number
  postsCount: number
  newContacts: number
  colleaguesCount: number
  servicesCount: number
  lastBlogPostDate: number
  seoCompletionPercent: number
}>('/api/admin/dashboard/stats', {
  default: () => ({
    usersCount: 0,
    pagesCount: 0,
    postsCount: 0,
    newContacts: 0,
    colleaguesCount: 0,
    servicesCount: 0,
    lastBlogPostDate: 0,
    seoCompletionPercent: 0,
  }),
})

const cards = computed(() => [
  { key: 'users', label: $t('admin.dashboard.usersCount'), value: data.value.usersCount },
  { key: 'pages', label: $t('admin.dashboard.pagesCount'), value: data.value.pagesCount },
  { key: 'posts', label: $t('admin.dashboard.postsCount'), value: data.value.postsCount },
  { key: 'contacts', label: $t('admin.dashboard.newContacts'), value: data.value.newContacts },
  { key: 'colleagues', label: $t('admin.dashboard.colleaguesCount'), value: data.value.colleaguesCount },
  { key: 'services', label: $t('admin.dashboard.servicesCount'), value: data.value.servicesCount },
])

const lastPostFormatted = computed(() => {
  if (!data.value.lastBlogPostDate) return $t('admin.dashboard.notAvailable')
  return new Date(data.value.lastBlogPostDate).toLocaleDateString(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
})

async function logout() {
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">{{ $t('admin.dashboard.welcomeBack') }}</h2>
        <p class="opacity-70">{{ user?.email ?? $t('admin.dashboard.noUser') }}</p>
      </div>
      <button class="btn btn-outline btn-sm" @click="logout">
        {{ $t('admin.dashboard.logout') }}
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="card in cards"
        :key="card.key"
        class="card border border-base-300 bg-base-200"
      >
        <div class="card-body p-4">
          <p class="text-sm opacity-60">{{ card.label }}</p>
          <p class="text-2xl font-bold">{{ card.value }}</p>
        </div>
      </article>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <article class="card border border-base-300 bg-base-200">
        <div class="card-body">
          <h3 class="card-title">{{ $t('admin.dashboard.seoCompletion') }}</h3>
          <p class="text-4xl font-bold">{{ data.seoCompletionPercent }}%</p>
          <progress class="progress progress-primary w-full" :value="data.seoCompletionPercent" max="100" />
        </div>
      </article>

      <article class="card border border-base-300 bg-base-200">
        <div class="card-body">
          <h3 class="card-title">{{ $t('admin.dashboard.lastBlogPostDate') }}</h3>
          <p class="text-2xl font-semibold">{{ lastPostFormatted }}</p>
          <p class="opacity-70">{{ $t('admin.dashboard.quickHealth') }}</p>
        </div>
      </article>
    </div>

    <article class="card border border-base-300 bg-base-200">
      <div class="card-body">
        <h3 class="card-title">{{ $t('admin.dashboard.overview') }}</h3>
        <p>{{ $t('admin.dashboard.overviewBody') }}</p>
      </div>
    </article>
  </section>
</template>
