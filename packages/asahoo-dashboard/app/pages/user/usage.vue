<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'user-auth' })
useHead(() => ({ title: 'گزارش مصرف' }))

const dayOptions = [
  { key: '۷ روز', value: '7' },
  { key: '۳۰ روز', value: '30' },
  { key: '۹۰ روز', value: '90' },
  { key: '۳۶۵ روز', value: '365' },
]

const days = ref(30)
const query = computed(() => `?days=${days.value}`)

interface DailyUsage {
  date: string
  tokens: number
  cost: number
}

interface ModelBreakdown {
  model: string
  tokens: number
  cost: number
  calls: number
}

interface UsageResponse {
  lifetimeTokens: number
  lifetimeCost: number
  daily: DailyUsage[]
  perModel: ModelBreakdown[]
}

const { data, status, refresh } = await useFetch<UsageResponse>(
  () => `/api/user/usage${query.value}`,
  {
    default: () => ({
      lifetimeTokens: 0,
      lifetimeCost: 0,
      daily: [],
      perModel: [],
    }),
  },
)

const maxDailyTokens = computed(() => {
  if (!data.value.daily.length) return 1
  return Math.max(...data.value.daily.map((d) => d.tokens), 1)
})

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR')
}

function onChangeDays() {
  refresh()
}
</script>

<template>
  <AdminPage title="گزارش مصرف" subtitle="مشاهده جزئیات مصرف سرویس هوش مصنوعی">
    <AdminCard title="بازه زمانی">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="opt in dayOptions"
          :key="opt.value"
          class="btn btn-sm"
          :class="{ 'btn-primary': days === Number(opt.value) }"
          @click="days = Number(opt.value); onChangeDays()"
        >
          {{ opt.key }}
        </button>
      </div>
    </AdminCard>

    <div v-if="status === 'pending'" class="flex justify-center py-10">
      <AdminLoadingSpinner title="در حال بارگذاری..." />
    </div>

    <template v-else-if="data.daily.length === 0 && data.perModel.length === 0">
      <AdminCard>
        <AdminThereIsNo>داده‌ای برای نمایش وجود ندارد</AdminThereIsNo>
      </AdminCard>
    </template>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2">
        <article class="card border border-base-300 bg-base-200">
          <div class="card-body p-4">
            <p class="text-sm opacity-60">توکن مصرفی (طول عمر)</p>
            <p class="text-2xl font-bold">{{ formatNumber(data.lifetimeTokens) }}</p>
          </div>
        </article>
        <article class="card border border-base-300 bg-base-200">
          <div class="card-body p-4">
            <p class="text-sm opacity-60">هزینه کل (تومان)</p>
            <p class="text-2xl font-bold">{{ formatNumber(data.lifetimeCost) }}</p>
          </div>
        </article>
      </div>

      <AdminCard title="نمودار مصرف روزانه (توکن)" v-if="data.daily.length > 0">
        <div class="flex items-end gap-1" style="height: 120px">
          <div
            v-for="(day, idx) in data.daily"
            :key="idx"
            class="tooltip flex-1"
            :data-tip="`${new Date(day.date).toLocaleDateString('fa-IR')}: ${formatNumber(day.tokens)} توکن`"
          >
            <div
              class="w-full rounded-t bg-primary transition-all hover:opacity-80"
              :style="{ height: `${(day.tokens / maxDailyTokens) * 100}%`, minHeight: day.tokens > 0 ? '4px' : '0' }"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="تفکیک بر اساس مدل" v-if="data.perModel.length > 0">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>مدل</th>
                <th>تعداد فراخوانی</th>
                <th>توکن مصرفی</th>
                <th>هزینه (تومان)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in data.perModel" :key="idx">
                <td class="font-mono text-sm">{{ item.model }}</td>
                <td>{{ formatNumber(item.calls) }}</td>
                <td>{{ formatNumber(item.tokens) }}</td>
                <td>{{ formatNumber(item.cost) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminCard>
    </template>
  </AdminPage>
</template>