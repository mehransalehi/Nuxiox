<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'گفتگوها' }))

interface Conversation {
  id: number
  platform: 'telegram' | 'instagram'
  external_user_id: string
  message_count: number
  first_message_at: string
  last_message_at: string
}

interface ConversationsResponse {
  records: Conversation[]
  total: number
}

// Filters
const platformFilter = ref('')
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const page = ref(1)
const perPage = 20

const query = computed(() => {
  const params = new URLSearchParams()
  params.set('page', String(page.value))
  params.set('limit', String(perPage))
  if (platformFilter.value) params.set('platform', platformFilter.value)
  if (searchQuery.value) params.set('search', searchQuery.value)
  if (dateFrom.value) params.set('date_from', dateFrom.value)
  if (dateTo.value) params.set('date_to', dateTo.value)
  return params.toString()
})

const { data, refresh, status } = await useFetch<ConversationsResponse>(
  () => `/api/user/conversations?${query.value}`,
  {
    default: () => ({ records: [], total: 0 }),
  },
)

const totalPages = computed(() => Math.ceil((data.value?.total ?? 0) / perPage) || 1)

function goToPage(p: number) {
  page.value = p
}

function applyFilters() {
  page.value = 1
  refresh()
}

const platformOptions = [
  { key: 'همه', value: '' },
  { key: 'تلگرام', value: 'telegram' },
  { key: 'اینستاگرام', value: 'instagram' },
]

function platformBadgeClass(p: string) {
  if (p === 'telegram') return 'badge-info'
  if (p === 'instagram') return 'badge-error'
  return 'badge-ghost'
}

function platformLabel(p: string) {
  if (p === 'telegram') return 'تلگرام'
  if (p === 'instagram') return 'اینستاگرام'
  return p
}

function formatDate(d: string) {
  if (!d) return '---'
  return new Date(d).toLocaleDateString('fa-IR')
}

function formatDateTime(d: string) {
  if (!d) return '---'
  return new Date(d).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// --- Export ---
function exportToCSV(data: any[], filename: string) {
  const bom = '\uFEFF'
  const headers = ['شناسه', 'پلتفرم', 'شناسه کاربر', 'تعداد پیام', 'اولین پیام', 'آخرین پیام']
  const rows = data.map((r: any) => [
    r.id,
    r.platform,
    r.external_user_id,
    r.message_count,
    r.first_message_at,
    r.last_message_at,
  ])
  const csv = bom + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function handleExportCSV() {
  try {
    const all: Conversation[] = await $fetch('/api/user/conversations?limit=100000')
    exportToCSV(all, `conversations-${new Date().toISOString().slice(0, 10)}.csv`)
  } catch {
    // fallback: use current page data
    exportToCSV(data.value.records, `conversations-${new Date().toISOString().slice(0, 10)}.csv`)
  }
}

async function handleExportPDF() {
  let all: Conversation[]
  try {
    all = await $fetch('/api/user/conversations?limit=100000')
  } catch {
    all = data.value.records
  }

  const rowsHtml = all
    .map(
      (r) => `<tr>
      <td>${r.id}</td>
      <td>${platformLabel(r.platform)}</td>
      <td>${r.external_user_id}</td>
      <td>${r.message_count}</td>
      <td>${formatDateTime(r.first_message_at)}</td>
      <td>${formatDateTime(r.last_message_at)}</td>
    </tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>لیست گفتگوها</title>
  <style>
    body { font-family: Tahoma, Arial, sans-serif; padding: 20px; }
    h2 { text-align: center; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #999; padding: 6px 10px; text-align: center; font-size: 13px; }
    th { background: #eee; }
  </style>
</head>
<body>
  <h2>لیست گفتگوها</h2>
  <table>
    <thead>
      <tr>
        <th>شناسه</th>
        <th>پلتفرم</th>
        <th>شناسه کاربر</th>
        <th>تعداد پیام</th>
        <th>اولین پیام</th>
        <th>آخرین پیام</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }
}

// Expand/collapse per row
const expandedId = ref<number | null>(null)

function toggleRow(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <AdminPage title="گفتگوها" subtitle="مشاهده و جستجوی گفتگوهای کاربران">
    <!-- Filters -->
    <AdminCard title="فیلترها">
      <div class="grid gap-4 md:grid-cols-4">
        <AdminUiSelect v-model="platformFilter" label="پلتفرم" :options="platformOptions" />
        <AdminUiText v-model="searchQuery" label="شناسه کاربر" placeholder="جستجوی external_user_id..." />
        <div>
          <label class="text-sm opacity-70 block mb-1">از تاریخ</label>
          <input v-model="dateFrom" type="date" class="input input-bordered w-full" />
        </div>
        <div>
          <label class="text-sm opacity-70 block mb-1">تا تاریخ</label>
          <input v-model="dateTo" type="date" class="input input-bordered w-full" />
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button class="btn btn-primary btn-sm" @click="applyFilters">اعمال فیلتر</button>
      </div>
    </AdminCard>

    <!-- Export Buttons -->
    <div class="flex gap-2 mb-4">
      <button class="btn btn-sm btn-outline" @click="handleExportCSV">
        <i class="fa-solid fa-file-excel ml-1" />
        خروجی Excel
      </button>
      <button class="btn btn-sm btn-outline" @click="handleExportPDF">
        <i class="fa-solid fa-file-pdf ml-1" />
        خروجی PDF
      </button>
    </div>

    <AdminCard>
      <div v-if="status === 'pending'" class="flex justify-center py-4">
        <AdminLoadingSpinner title="در حال بارگذاری..." />
      </div>
      <div v-else-if="data.records.length === 0">
        <AdminThereIsNo>گفتگویی یافت نشد</AdminThereIsNo>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>پلتفرم</th>
              <th>شناسه کاربر</th>
              <th>تعداد پیام</th>
              <th>اولین پیام</th>
              <th>آخرین پیام</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in data.records"
              :key="row.id"
              class="cursor-pointer"
              @click="toggleRow(row.id)"
            >
              <td>{{ row.id }}</td>
              <td>
                <span class="badge badge-sm" :class="platformBadgeClass(row.platform)">
                  {{ platformLabel(row.platform) }}
                </span>
              </td>
              <td>{{ row.external_user_id }}</td>
              <td>{{ row.message_count }}</td>
              <td>{{ formatDate(row.first_message_at) }}</td>
              <td>{{ formatDate(row.last_message_at) }}</td>
            </tr>
            <!-- Expanded detail row -->
            <tr v-if="expandedId" v-for="row in data.records.filter(r => r.id === expandedId)" :key="'detail-' + row.id">
              <td :colspan="6" class="bg-base-200 p-4">
                <div class="grid gap-2 sm:grid-cols-2 text-sm">
                  <div><span class="opacity-60">شناسه گفتگو:</span> <strong>{{ row.id }}</strong></div>
                  <div><span class="opacity-60">پلتفرم:</span> <strong>{{ platformLabel(row.platform) }}</strong></div>
                  <div><span class="opacity-60">شناسه کاربر خارجی:</span> <strong dir="ltr" class="font-mono">{{ row.external_user_id }}</strong></div>
                  <div><span class="opacity-60">تعداد پیام‌ها:</span> <strong>{{ row.message_count }}</strong></div>
                  <div><span class="opacity-60">اولین پیام:</span> <strong>{{ formatDateTime(row.first_message_at) }}</strong></div>
                  <div><span class="opacity-60">آخرین پیام:</span> <strong>{{ formatDateTime(row.last_message_at) }}</strong></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2">
          <button class="btn btn-sm" :disabled="page <= 1" @click="goToPage(page - 1)">
            قبلی
          </button>
          <span class="text-sm opacity-70">
            صفحه {{ page }} از {{ totalPages }}
          </span>
          <button class="btn btn-sm" :disabled="page >= totalPages" @click="goToPage(page + 1)">
            بعدی
          </button>
        </div>
      </div>
    </AdminCard>
  </AdminPage>
</template>
