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

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
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

function formatMsgTime(d: string) {
  if (!d) return '---'
  return new Date(d).toLocaleString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Modal / messages
const modalConvId = ref<number | null>(null)
const modalConversation = computed(() =>
  data.value.records.find((r) => r.id === modalConvId.value) ?? null,
)
const messagesMap = ref<Record<number, Message[]>>({})
const messagesLoading = ref(false)
const modalRef = ref<HTMLDialogElement | null>(null)

async function openModal(id: number) {
  modalConvId.value = id

  // Fetch if not already cached
  if (!messagesMap.value[id]) {
    const row = data.value.records.find((r) => r.id === id)
    if (!row) return

    messagesLoading.value = true
    try {
      const msgs = await $fetch<Message[]>(
        `/api/user/conversations/messages?platform=${row.platform}&user_id=${row.external_user_id}&limit=100`,
      )
      messagesMap.value = { ...messagesMap.value, [id]: msgs }
    } catch {
      messagesMap.value = { ...messagesMap.value, [id]: [] }
    } finally {
      messagesLoading.value = false
    }
  }

  // Open modal
  modalRef.value?.showModal()
}

function closeModal() {
  modalRef.value?.close()
}

function roleLabel(r: string) {
  if (r === 'user') return 'کاربر'
  if (r === 'assistant') return 'دستیار'
  return r
}

// --- Export ---
const includeMessages = ref(false)

function exportToCSVRows(data: any[], filename: string) {
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

function downloadCSV(csv: string, filename: string) {
  const bom = '\uFEFF'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function handleExportCSV() {
  let all: Conversation[]
  try {
    all = await $fetch('/api/user/conversations?limit=100000')
  } catch {
    all = data.value.records
  }

  const filename = `conversations-${new Date().toISOString().slice(0, 10)}.csv`

  if (!includeMessages.value) {
    exportToCSVRows(all, filename)
    return
  }

  // Include messages — each message gets its own row
  const headers = [
    'شناسه گفتگو',
    'پلتفرم',
    'شناسه کاربر',
    'تعداد پیام',
    'شماره پیام',
    'نقش',
    'محتوا',
    'زمان',
  ]
  const rows: string[] = []

  for (const conv of all) {
    let msgs: Message[] = []
    try {
      msgs = await $fetch<Message[]>(
        `/api/user/conversations/messages?platform=${conv.platform}&user_id=${conv.external_user_id}&limit=100`,
      )
    } catch {
      // no messages for this conversation
    }

    if (msgs.length === 0) {
      // One row per conversation even without messages
      rows.push(
        [conv.id, conv.platform, conv.external_user_id, conv.message_count, '', '', '', ''].join(','),
      )
    } else {
      for (let i = 0; i < msgs.length; i++) {
        const m = msgs[i]
        // Escape content that might contain commas or quotes
        const content = (m.content || '').replace(/"/g, '""')
        rows.push(
          [
            conv.id,
            conv.platform,
            conv.external_user_id,
            conv.message_count,
            i + 1,
            m.role,
            `"${content}"`,
            m.created_at || '',
          ].join(','),
        )
      }
    }
  }

  const csv = [headers.join(','), ...rows].join('\n')
  downloadCSV(csv, filename)
}

async function handleExportPDF() {
  let all: Conversation[]
  try {
    all = await $fetch('/api/user/conversations?limit=100000')
  } catch {
    all = data.value.records
  }

  let bodyHtml: string

  if (!includeMessages.value) {
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

    bodyHtml = `<table>
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
  </table>`
  } else {
    // Include messages — build per-conversation sections
    const sections: string[] = []
    for (const conv of all) {
      let msgs: Message[] = []
      try {
        msgs = await $fetch<Message[]>(
          `/api/user/conversations/messages?platform=${conv.platform}&user_id=${conv.external_user_id}&limit=100`,
        )
      } catch {
        // no messages
      }

      const msgHtml = msgs
        .map(
          (m) => `<div style="margin:6px 0;padding:8px 12px;border-radius:6px;${
            m.role === 'user'
              ? 'background:#e8f4fd;border-right:3px solid #0ea5e9'
              : 'background:#f0fdf4;border-right:3px solid #22c55e'
          }">
        <div style="font-size:11px;color:#666;margin-bottom:2px">
          ${roleLabel(m.role)} · ${formatMsgTime(m.created_at)}
        </div>
        <div style="font-size:13px">${m.content}</div>
      </div>`,
        )
        .join('')

      sections.push(`<div style="margin-bottom:20px;padding:10px 14px;border:1px solid #ccc;border-radius:8px">
      <div style="margin-bottom:8px;font-size:13px;color:#333">
        <strong>گفتگو #${conv.id}</strong> — ${platformLabel(conv.platform)} ·
        ${conv.external_user_id} · ${conv.message_count} پیام
      </div>
      ${msgHtml || '<div style="color:#999;font-size:12px">پیامی وجود ندارد</div>'}
    </div>`)
    }
    bodyHtml = sections.join('\n')
  }

  const html = `<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${includeMessages.value ? 'گفتگوها با پیام‌ها' : 'لیست گفتگوها'}</title>
  <style>
    body { font-family: Tahoma, Arial, sans-serif; padding: 20px; }
    h2 { text-align: center; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #999; padding: 6px 10px; text-align: center; font-size: 13px; }
    th { background: #eee; }
  </style>
</head>
<body>
  <h2>${includeMessages.value ? 'گفتگوها با پیام‌ها' : 'لیست گفتگوها'}</h2>
  ${bodyHtml}
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
    <div class="flex items-center gap-4 mb-4">
      <div class="flex items-center gap-2">
        <input id="includeMessages" v-model="includeMessages" type="checkbox" class="checkbox checkbox-sm" />
        <label for="includeMessages" class="text-sm cursor-pointer">همراه با پیام‌ها</label>
      </div>
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
              class="cursor-pointer hover:bg-base-200"
              @click="openModal(row.id)"
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

    <!-- Message Detail Modal (Telegram-style chat) -->
    <dialog ref="modalRef" class="modal">
      <div class="modal-box max-w-2xl p-0 overflow-hidden">
        <!-- Modal header -->
        <div class="bg-base-200 px-6 py-4 border-b border-base-300">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg" v-if="modalConversation">
              گفتگو #{{ modalConversation.id }}
            </h3>
            <form method="dialog">
              <button class="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>
          <div v-if="modalConversation" class="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm opacity-70">
            <span>{{ platformLabel(modalConversation.platform) }}</span>
            <span class="font-mono" dir="ltr">{{ modalConversation.external_user_id }}</span>
            <span>{{ modalConversation.message_count }} پیام</span>
          </div>
        </div>

        <!-- Scrollable messages area -->
        <div class="px-4 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div v-if="messagesLoading" class="flex justify-center py-6">
            <AdminLoadingSpinner title="در حال بارگذاری پیام‌ها..." />
          </div>
          <div
            v-else-if="modalConvId && messagesMap[modalConvId] && messagesMap[modalConvId].length === 0"
            class="text-sm opacity-60 py-6 text-center"
          >
            هیچ پیامی یافت نشد
          </div>
          <template v-else-if="modalConvId && messagesMap[modalConvId]">
            <div
              v-for="msg in messagesMap[modalConvId]"
              :key="msg.id"
              class="flex"
              :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <!-- User message: right-aligned, blue bubble -->
              <div
                v-if="msg.role === 'user'"
                class="max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm bg-blue-500 text-white rounded-br-md"
              >
                <div class="text-[10px] opacity-70 mb-0.5 text-blue-100">
                  کاربر · {{ formatMsgTime(msg.created_at) }}
                </div>
                <div class="text-sm whitespace-pre-wrap leading-relaxed">
                  {{ msg.content }}
                </div>
              </div>
              <!-- Assistant message: left-aligned, green bubble -->
              <div
                v-else
                class="max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm bg-green-100 dark:bg-green-800/60 text-gray-800 dark:text-gray-100 rounded-bl-md"
              >
                <div class="text-[10px] opacity-70 mb-0.5 text-gray-500 dark:text-gray-400">
                  دستیار · {{ formatMsgTime(msg.created_at) }}
                </div>
                <div class="text-sm whitespace-pre-wrap leading-relaxed">
                  {{ msg.content }}
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Modal footer -->
        <div class="px-6 py-3 border-t border-base-300 bg-base-200 flex justify-end">
          <form method="dialog">
            <button class="btn btn-sm">بستن</button>
          </form>
        </div>
      </div>
    </dialog>
  </AdminPage>
</template>