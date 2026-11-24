<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'داشبورد کاربری' }))

const { t } = useI18n()

const { data: msgCounts } = await useFetch('/api/user/conversations/counts', {
  default: () => ({ received: 0, responded: 0 }),
})

const msgCards = computed(() => [
  { label: 'پیام‌های دریافتی', value: (msgCounts.value?.received || 0).toLocaleString('fa-IR') },
  { label: 'پاسخ‌های ارسالی', value: (msgCounts.value?.responded || 0).toLocaleString('fa-IR') },
])

const navCards = [
  { to: '/user/profile', label: 'پروفایل', desc: 'مدیریت اطلاعات کسب و کار', icon: 'fa-solid fa-building' },
  { to: '/user/reservations', label: 'رزروها', desc: 'مدیریت جلسات و رزروها', icon: 'fa-solid fa-calendar-check' },
  { to: '/user/conversations', label: 'گفتگوها', desc: 'مشاهده تاریخچه گفتگوها', icon: 'fa-solid fa-comments' },
  { to: '/user/settings', label: 'تنظیمات', desc: 'تنظیمات حساب کاربری', icon: 'fa-solid fa-gear' },
  { to: '/user/knowledge', label: 'دانش‌ها', desc: 'مدیریت پایگاه دانش', icon: 'fa-solid fa-database' },
]
</script>

<template>
  <AdminPage title="داشبورد کاربری" subtitle="خلاصه وضعیت سرویس هوش مصنوعی">
    <div class="space-y-6">
      <!-- Message count cards -->
      <div class="grid gap-4 sm:grid-cols-2">
        <article
          v-for="card in msgCards"
          :key="card.label"
          class="card border border-base-300 bg-base-200"
        >
          <div class="card-body p-4">
            <p class="text-sm opacity-60">{{ card.label }}</p>
            <p class="text-2xl font-bold">{{ card.value }}</p>
          </div>
        </article>
      </div>

      <!-- Quick guide -->
      <AdminCard title="راهنمای سریع">
        <p class="opacity-70">
          از منوی کناری یا کارت‌های زیر می‌توانید به بخش‌های مختلف داشبورد دسترسی داشته باشید.
        </p>
      </AdminCard>

      <!-- Navigation cards -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="nav in navCards"
          :key="nav.to"
          :to="nav.to"
          class="card border border-base-300 bg-base-200 hover:border-primary/50 hover:shadow-md transition-all duration-200"
        >
          <div class="card-body p-4 flex flex-row items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <i :class="nav.icon" class="text-xl" />
            </div>
            <div>
              <p class="font-semibold">{{ nav.label }}</p>
              <p class="text-sm opacity-60">{{ nav.desc }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </AdminPage>
</template>