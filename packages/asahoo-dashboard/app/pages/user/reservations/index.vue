<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'رزروها' }))

const toastStore = useToastStore()

interface Reservation {
  id: number
  name: string
  family: string
  phone: string
  service: string
  preferred_time: string
  status: string
  created_at: string
}

const search = ref('')
const statusFilter = ref('')
const startDate = ref('')
const endDate = ref('')
const page = ref(1)
const perPage = 20
const expandedId = ref<number | null>(null)

const query = computed(() => {
  const params = new URLSearchParams()
  params.set('page', String(page.value))
  params.set('limit', String(perPage))
  if (search.value) params.set('search', search.value)
  if (statusFilter.value) params.set('status', statusFilter.value)
  if (startDate.value) params.set('start_date', startDate.value)
  if (endDate.value) params.set('end_date', endDate.value)
  return params.toString()
})

const { data, refresh, status } = await useFetch<{ records: Reservation[]; total: number }>(
  () => `/api/user/reservations?${query.value}`,
  {
    default: () => ({ records: [], total: 0 }),
  },
)

const totalPages = computed(() => Math.ceil((data.value?.total ?? 0) / perPage) || 1)

const statusOptions = [
  { key: 'در انتظار', value: 'pending' },
  { key: 'تماس گرفته شده', value: 'contacted' },
  { key: 'تکمیل شده', value: 'completed' },
  { key: 'لغو شده', value: 'cancelled' },
]

const statusLabels: Record<string, string> = {
  pending: 'در انتظار',
  contacted: 'تماس گرفته شده',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
}

const statusBadgeClass: Record<string, string> = {
  pending: 'badge-warning',
  contacted: 'badge-info',
  completed: 'badge-success',
  cancelled: 'badge-error',
}

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

async function changeStatus(id: number, newStatus: string) {
  try {
    await $fetch(`/api/user/reservations/${id}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    toastStore.push('وضعیت با موفقیت بروزرسانی شد', 'success')
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  }
}

function goToPage(p: number) {
  page.value = p
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fa-IR')
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

function resetFilters() {
  search.value = ''
  statusFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  page.value = 1
}
</script>

<template>
  <AdminPage title="رزروها" subtitle="مدیریت رزروهای مشتریان">
    <template #header>
      <button class="btn btn-outline btn-sm" @click="refresh">بروزرسانی</button>
    </template>

    <AdminCard title="فیلترها">
      <div class="grid gap-4 md:grid-cols-4">
        <AdminUiText v-model="search" label="جستجو" placeholder="نام / نام خانوادگی / تلفن..." />
        <AdminUiSelect
          v-model="statusFilter"
          label="وضعیت"
          :options="[{ key: 'همه', value: '' }, ...statusOptions]"
        />
        <label class="form-control">
          <span class="label-text">از تاریخ</span>
          <input type="date" v-model="startDate" class="input input-bordered" />
        </label>
        <label class="form-control">
          <span class="label-text">تا تاریخ</span>
          <input type="date" v-model="endDate" class="input input-bordered" />
        </label>
      </div>
      <div class="mt-4 flex gap-2">
        <button class="btn btn-outline" @click="refresh">اعمال فیلتر</button>
        <button class="btn btn-ghost" @click="resetFilters">پاک کردن فیلترها</button>
      </div>
    </AdminCard>

    <AdminCard>
      <div v-if="status === 'pending'" class="flex justify-center py-4">
        <AdminLoadingSpinner title="در حال بارگذاری..." />
      </div>
      <div v-else-if="data.records.length === 0">
        <AdminThereIsNo>رزروی یافت نشد</AdminThereIsNo>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام</th>
              <th>نام خانوادگی</th>
              <th>تلفن</th>
              <th>خدمت</th>
              <th>زمان درخواستی</th>
              <th>وضعیت</th>
              <th>تاریخ ثبت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data.records" :key="row.id">
              <tr
                class="cursor-pointer hover:bg-base-200"
                :class="{ 'bg-base-200': expandedId === row.id }"
                @click="toggleExpand(row.id)"
              >
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.family }}</td>
                <td dir="ltr" class="text-left">{{ row.phone }}</td>
                <td>{{ row.service || '—' }}</td>
                <td>{{ formatDate(row.preferred_time) }} {{ formatTime(row.preferred_time) }}</td>
                <td>
                  <span class="badge" :class="statusBadgeClass[row.status] || 'badge-ghost'">
                    {{ statusLabels[row.status] || row.status }}
                  </span>
                </td>
                <td>{{ formatDate(row.created_at) }}</td>
                <td class="space-x-1 whitespace-nowrap ltr:space-x-reverse" @click.stop>
                  <button
                    v-if="row.status === 'pending'"
                    class="btn btn-xs btn-info"
                    @click="changeStatus(row.id, 'contacted')"
                  >
                    تماس
                  </button>
                  <button
                    v-if="row.status !== 'completed' && row.status !== 'cancelled'"
                    class="btn btn-xs btn-success"
                    @click="changeStatus(row.id, 'completed')"
                  >
                    تکمیل
                  </button>
                  <button
                    v-if="row.status !== 'cancelled'"
                    class="btn btn-xs btn-error"
                    @click="changeStatus(row.id, 'cancelled')"
                  >
                    لغو
                  </button>
                </td>
              </tr>
              <tr v-if="expandedId === row.id">
                <td colspan="9" class="bg-base-200 p-4">
                  <div class="grid gap-2 md:grid-cols-3">
                    <div>
                      <span class="text-xs opacity-60">نام: </span>
                      <span>{{ row.name }} {{ row.family }}</span>
                    </div>
                    <div>
                      <span class="text-xs opacity-60">تلفن: </span>
                      <span dir="ltr">{{ row.phone }}</span>
                    </div>
                    <div>
                      <span class="text-xs opacity-60">خدمت: </span>
                      <span>{{ row.service || '—' }}</span>
                    </div>
                    <div>
                      <span class="text-xs opacity-60">زمان درخواستی: </span>
                      <span>{{ formatDate(row.preferred_time) }} {{ formatTime(row.preferred_time) }}</span>
                    </div>
                    <div>
                      <span class="text-xs opacity-60">وضعیت: </span>
                      <span class="badge" :class="statusBadgeClass[row.status] || 'badge-ghost'">
                        {{ statusLabels[row.status] || row.status }}
                      </span>
                    </div>
                    <div>
                      <span class="text-xs opacity-60">تاریخ ثبت: </span>
                      <span>{{ formatDate(row.created_at) }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2">
          <button
            class="btn btn-sm"
            :disabled="page <= 1"
            @click="goToPage(page - 1)"
          >
            قبلی
          </button>
          <span class="text-sm opacity-70">
            صفحه {{ page }} از {{ totalPages }}
          </span>
          <button
            class="btn btn-sm"
            :disabled="page >= totalPages"
            @click="goToPage(page + 1)"
          >
            بعدی
          </button>
        </div>
      </div>
    </AdminCard>
  </AdminPage>
</template>
