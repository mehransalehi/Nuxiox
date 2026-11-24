<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'پروفایل کاربری' }))

const toastStore = useToastStore()

// ── Profile data ──
interface ProfileData {
  name: string
  description: string
  contact_info: string
  timezone: string
  policies: string
}

const { data, status, refresh } = await useFetch<ProfileData>('/api/user/profile', {
  default: () => ({
    name: '',
    description: '',
    contact_info: '{}',
    timezone: 'Asia/Tehran',
    policies: '{}',
  }),
})

const form = reactive<ProfileData>({
  name: '',
  description: '',
  contact_info: '{}',
  timezone: 'Asia/Tehran',
  policies: '{}',
})

function jsonToList(jsonStr: string): { key: string; value: string }[] {
  if (!jsonStr || !jsonStr.trimStart().startsWith('{')) {
    return [{ key: 'content', value: jsonStr || '' }]
  }
  try {
    const obj = JSON.parse(jsonStr || '{}')
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: value != null ? String(value) : '',
    }))
  } catch {
    return [{ key: 'content', value: jsonStr }]
  }
}

function listToJson(list: { key: string; value: string }[]): string {
  const obj: Record<string, string> = {}
  for (const item of list) {
    if (item.key) {
      obj[item.key] = item.value
    }
  }
  return JSON.stringify(obj)
}

const contactInfoList = ref<{ key: string; value: string }[]>([])
const policiesList = ref<{ key: string; value: string }[]>([])

watch(data, (val) => {
  if (val) {
    Object.assign(form, val)
    contactInfoList.value = jsonToList(val.contact_info)
    policiesList.value = jsonToList(val.policies)
  }
}, { immediate: true })

async function save() {
  form.contact_info = listToJson(contactInfoList.value)
  form.policies = listToJson(policiesList.value)

  try {
    await $fetch('/api/user/profile', {
      method: 'PUT',
      body: form,
    })
    toastStore.push('پروفایل با موفقیت ذخیره شد', 'success')
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  }
}

// ── Usage data ──
interface UsageData {
  lifetimeUsd: number | null
  perDay: { day: string; usd: number; tokens: number }[]
  perModel: { model: string; usd: number; tokens: number }[]
}

type FilterKey = 'today' | 'week' | 'month' | 'year'
const activeFilter = ref<FilterKey>('month')

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'today', label: 'امروز' },
  { key: 'week', label: 'این هفته' },
  { key: 'month', label: 'این ماه' },
  { key: 'year', label: 'امسال' },
]

const daysMap: Record<FilterKey, number> = {
  today: 1,
  week: 7,
  month: 30,
  year: 365,
}

const usageQuery = computed(() => `?days=${daysMap[activeFilter.value]}`)

const { data: usageData, refresh: refreshUsage } = await useFetch<UsageData>(
  () => `/api/user/usage${usageQuery.value}`,
  {
    default: () => ({
      lifetimeUsd: null,
      perDay: [],
      perModel: [],
    }),
    watch: false,
  }
)

const { data: msgCounts, refresh: refreshCounts } = await useFetch('/api/user/conversations/counts', {
  default: () => ({ received: 0, responded: 0 }),
})

function onFilterChange(key: FilterKey) {
  activeFilter.value = key
  // Nuxt useFetch with a computed URL auto-refetches
  nextTick(() => {
    refreshUsage()
  })
}

const tokenChartData = computed(() =>
  (usageData.value?.perDay || []).map((d) => ({
    label: d.day.slice(5, 10),
    value: d.tokens,
  }))
)

const costChartData = computed(() =>
  (usageData.value?.perDay || []).map((d) => ({
    label: d.day.slice(5, 10),
    value: Math.round(d.usd * 1000000) / 100,
  }))
)

const totalTokens = computed(() =>
  (usageData.value?.perDay || []).reduce((s, d) => s + d.tokens, 0)
)

const totalCost = computed(() =>
  usageData.value?.lifetimeUsd
)

// ── Navigation cards ──
const navCards = [
  { to: '/user/reservations', label: 'رزروها', desc: 'مدیریت جلسات و رزروها', icon: 'fa-solid fa-calendar-check' },
  { to: '/user/conversations', label: 'گفتگوها', desc: 'مشاهده تاریخچه گفتگوها', icon: 'fa-solid fa-comments' },
  { to: '/user/settings', label: 'تنظیمات', desc: 'تنظیمات حساب کاربری', icon: 'fa-solid fa-gear' },
  { to: '/user/knowledge', label: 'دانش‌ها', desc: 'مدیریت پایگاه دانش', icon: 'fa-solid fa-database' },
]
</script>

<template>
  <AdminPage title="پروفایل کسب و کار" subtitle="اطلاعات کسب وکار خود را مدیریت کنید">
    <div v-if="status === 'pending'" class="flex justify-center py-10">
      <AdminLoadingSpinner title="در حال بارگذاری..." />
    </div>
    <div v-else class="space-y-6">
      <!-- Business info card -->
      <AdminCard title="اطلاعات اصلی">
        <div class="grid gap-4 md:grid-cols-2">
          <AdminUiText label="نام کسب و کار" v-model="form.name" placeholder="نام کسب و کار خود را وارد کنید" />
          <AdminUiText label="منطقه زمانی" v-model="form.timezone" placeholder="Asia/Tehran" />
        </div>
        <AdminUiTextarea label="توضیحات" v-model="form.description" placeholder="توضیحات کسب و کار" />
        <div class="mt-4">
          <AdminListCreator
            :list="contactInfoList"
            @update="contactInfoList = $event"
            title="اطلاعات تماس"
            button-text="+ افزودن"
          />
        </div>
        <div class="mt-4">
          <AdminListCreator
            :list="policiesList"
            @update="policiesList = $event"
            title="خط مشی‌ها"
            button-text="+ افزودن"
          />
        </div>
        <div class="mt-4">
          <button class="btn btn-primary" @click="save">ذخیره تغییرات</button>
        </div>
      </AdminCard>

      <!-- Usage section -->
      <AdminCard title="آمار مصرف">
        <!-- Filter buttons -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <button
            v-for="opt in filterOptions"
            :key="opt.key"
            class="btn btn-sm"
            :class="{ 'btn-primary': activeFilter === opt.key }"
            @click="onFilterChange(opt.key)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- Summary cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-3">
              <p class="text-xs opacity-60">مجموع توکن</p>
              <p class="text-lg font-bold">{{ totalTokens.toLocaleString('fa-IR') }}</p>
            </div>
          </article>
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-3">
              <p class="text-xs opacity-60">هزینه کل (دلار)</p>
              <p class="text-lg font-bold">{{ totalCost !== null && totalCost !== undefined ? '$' + totalCost.toFixed(4) : '---' }}</p>
            </div>
          </article>
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-3">
              <p class="text-xs opacity-60">پیام‌های دریافتی</p>
              <p class="text-lg font-bold">{{ (msgCounts?.received || 0).toLocaleString('fa-IR') }}</p>
            </div>
          </article>
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-3">
              <p class="text-xs opacity-60">پاسخ‌های ارسالی</p>
              <p class="text-lg font-bold">{{ (msgCounts?.responded || 0).toLocaleString('fa-IR') }}</p>
            </div>
          </article>
        </div>

        <!-- Charts -->
        <div class="grid gap-4 md:grid-cols-2">
          <AdminCard title="توکن مصرفی روزانه" class="!border-0 !bg-transparent !p-0">
            <UserUsageChart
              :data="tokenChartData"
              title=""
              color="#2563eb"
              :height="180"
            />
          </AdminCard>
          <AdminCard title="هزینه روزانه (سنت)" class="!border-0 !bg-transparent !p-0">
            <UserUsageChart
              :data="costChartData"
              title=""
              color="#059669"
              :height="180"
            />
          </AdminCard>
        </div>

        <!-- Note about per-platform -->
        <div class="mt-4 text-xs opacity-50">
          <p>* تفکیک مصرف بر اساس پلتفرم (تلگرام / واتساپ) به زودی اضافه خواهد شد.</p>
        </div>
      </AdminCard>

      <!-- Navigation cards -->
      <AdminCard title="دسترسی سریع">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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