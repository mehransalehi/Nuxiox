<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'داشبورد کاربری' }))

interface UsageData {
  totalTokens: number
  totalCost: number
  currentMonthTokens: number
  currentMonthCost: number
}

const { data, status } = await useFetch<UsageData>('/api/user/usage', {
  default: () => ({
    totalTokens: 0,
    totalCost: 0,
    currentMonthTokens: 0,
    currentMonthCost: 0,
  }),
})

const { t } = useI18n()

const cards = computed(() => [
  { label: 'توکن‌های مصرفی (کل)', value: data.value.totalTokens.toLocaleString() },
  { label: 'هزینه کل (تومان)', value: data.value.totalCost.toLocaleString() },
  { label: 'توکن‌های ماه جاری', value: data.value.currentMonthTokens.toLocaleString() },
  { label: 'هزینه ماه جاری (تومان)', value: data.value.currentMonthCost.toLocaleString() },
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