<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'داشبورد کاربری' }))

interface UsageData {
  lifetimeUsd: number | null
  perDay: { day: string; usd: number; tokens: number }[]
  perModel: { model: string; usd: number; tokens: number }[]
}

const { data, status } = await useFetch<UsageData>('/api/user/usage', {
  default: () => ({
    lifetimeUsd: null,
    perDay: [],
    perModel: [],
  }),
})

const { t } = useI18n()

const { data: msgCounts } = await useFetch('/api/user/conversations/counts', {
  default: () => ({ received: 0, responded: 0 }),
})

const cards = computed(() => [
  { label: 'پیام‌های دریافتی', value: (msgCounts.value?.received || 0).toLocaleString() },
  { label: 'پاسخ‌های ارسالی', value: (msgCounts.value?.responded || 0).toLocaleString() },
  { label: 'توکن‌های مصرفی (کل)', value: (data.value.perDay?.reduce((s, d) => s + d.tokens, 0) || 0).toLocaleString() },
  { label: 'هزینه کل', value: data.value.lifetimeUsd !== null && data.value.lifetimeUsd !== undefined ? `$${data.value.lifetimeUsd.toFixed(4)}` : '---' },
  { label: 'تعداد روزهای دارای مصرف', value: String(data.value.perDay?.length || 0) },
  { label: 'مدل‌های استفاده شده', value: String(data.value.perModel?.length || 0) },
])
</script>

<template>
  <AdminPage :title="'داشبورد کاربری'" subtitle="خلاصه مصرف سرویس هوش مصنوعی">
    <div v-if="status === 'pending'" class="flex justify-center py-10">
      <AdminLoadingSpinner title="در حال بارگذاری..." />
    </div>
    <div v-else class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in cards"
          :key="card.label"
          class="card border border-base-300 bg-base-200"
        >
          <div class="card-body p-4">
            <p class="text-sm opacity-60">{{ card.label }}</p>
            <p class="text-2xl font-bold">{{ card.value }}</p>
          </div>
        </article>
      </div>
      <AdminCard title="راهنمای سریع">
        <p class="opacity-70">
          از منوی کناری می‌توانید به بخش‌های پروفایل، دانشنامه و گزارش مصرف دسترسی داشته باشید.
          این داشبورد خلاصه‌ای از مصرف سرویس هوش مصنوعی شما را نمایش می‌دهد.
        </p>
      </AdminCard>
    </div>
  </AdminPage>
</template>