<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'داشبورد کاربری' }))

// ── Message counts ──
const { data: msgCounts } = await useFetch('/api/user/conversations/counts', {
  default: () => ({
    received: 0,
    responded: 0,
    telegram: { received: 0, responded: 0 },
    instagram: { received: 0, responded: 0 },
  }),
})

// ── Navigation cards ──
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
      <!-- Total message count cards -->
      <div class="grid gap-4 sm:grid-cols-2">
        <article class="card border border-base-300 bg-base-200">
          <div class="card-body p-4 flex flex-row items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <i class="fa-solid fa-inbox text-xl" />
            </div>
            <div>
              <p class="text-xs opacity-60">پیام‌های دریافتی</p>
              <p class="text-xl font-bold">{{ (msgCounts?.received || 0).toLocaleString('fa-IR') }}</p>
            </div>
          </div>
        </article>
        <article class="card border border-base-300 bg-base-200">
          <div class="card-body p-4 flex flex-row items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
              <i class="fa-solid fa-reply text-xl" />
            </div>
            <div>
              <p class="text-xs opacity-60">پاسخ‌های ارسالی</p>
              <p class="text-xl font-bold">{{ (msgCounts?.responded || 0).toLocaleString('fa-IR') }}</p>
            </div>
          </div>
        </article>
      </div>

      <!-- Platform cards -->
      <div class="grid gap-4 sm:grid-cols-2">
        <!-- Telegram -->
        <article class="card border border-base-300 bg-base-200">
          <div class="card-body p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <i class="fa-brands fa-telegram text-lg" />
              </div>
              <p class="font-semibold">تلگرام</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs opacity-60">دریافتی</p>
                <p class="text-lg font-bold">{{ (msgCounts?.telegram?.received || 0).toLocaleString('fa-IR') }}</p>
              </div>
              <div>
                <p class="text-xs opacity-60">ارسالی</p>
                <p class="text-lg font-bold">{{ (msgCounts?.telegram?.responded || 0).toLocaleString('fa-IR') }}</p>
              </div>
            </div>
          </div>
        </article>

        <!-- Instagram -->
        <article class="card border border-base-300 bg-base-200">
          <div class="card-body p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
                <i class="fa-brands fa-instagram text-lg" />
              </div>
              <p class="font-semibold">اینستاگرام</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs opacity-60">دریافتی</p>
                <p class="text-lg font-bold">{{ (msgCounts?.instagram?.received || 0).toLocaleString('fa-IR') }}</p>
              </div>
              <div>
                <p class="text-xs opacity-60">ارسالی</p>
                <p class="text-lg font-bold">{{ (msgCounts?.instagram?.responded || 0).toLocaleString('fa-IR') }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Navigation cards -->
      <AdminCard title="دسترسی سریع">
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
      </AdminCard>
    </div>
  </AdminPage>
</template>