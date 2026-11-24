<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
useHead(() => ({ title: 'جزئیات کاربر' }))

const toastStore = useToastStore()
const route = useRoute()
const userId = computed(() => Number(route.params.id))

// ── User info — fetch all users and find by id ──
const { data: allUsers, status: userStatus } = await useFetch('/api/admin/users', {
  default: () => [],
})
const userInfo = computed(() => (allUsers.value as any[]).find((u) => u.id === userId.value) || null)

// ── Bot stats (message counts) ──
const { data: msgCounts } = await useFetch(
  () => `/api/admin/users/${userId.value}/bot/conversations/counts`,
  { default: () => ({ received: 0, responded: 0, telegram: { received: 0, responded: 0 }, instagram: { received: 0, responded: 0 } }) },
)

// ── Bot settings ──
interface BotSettings {
  model: string
  admin_telegram_enabled: boolean
  admin_instagram_enabled: boolean
  telegram_enabled: boolean
  instagram_enabled: boolean
  telegram_bot_token: string
  manager_group_id: string
}
const { data: botSettings, refresh: refreshSettings, status: settingsStatus } = await useFetch<BotSettings>(
  () => `/api/admin/users/${userId.value}/bot/bot/settings`,
  { default: () => ({ model: '', admin_telegram_enabled: false, admin_instagram_enabled: false, telegram_enabled: false, instagram_enabled: false, telegram_bot_token: '', manager_group_id: '' }) },
)

// ── Conversations ──
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
const conversationsPage = ref(1)
const conversationsSearch = ref('')
const conversationsPlatform = ref('')
const conversationsDateFrom = ref('')
const conversationsDateTo = ref('')
const perPage = 20

const conversationsQuery = computed(() => {
  const params = new URLSearchParams()
  params.set('page', String(conversationsPage.value))
  params.set('limit', String(perPage))
  if (conversationsPlatform.value) params.set('platform', conversationsPlatform.value)
  if (conversationsSearch.value) params.set('search', conversationsSearch.value)
  if (conversationsDateFrom.value) params.set('date_from', conversationsDateFrom.value)
  if (conversationsDateTo.value) params.set('date_to', conversationsDateTo.value)
  return params.toString()
})

const { data: conversations, refresh: refreshConversations, status: convStatus } = await useFetch<ConversationsResponse>(
  () => `/api/admin/users/${userId.value}/bot/conversations?${conversationsQuery.value}`,
  { default: () => ({ records: [], total: 0 }) },
)

const totalPages = computed(() => Math.ceil((conversations.value?.total ?? 0) / perPage) || 1)

function goToConvPage(p: number) {
  conversationsPage.value = p
}

function applyConvFilters() {
  conversationsPage.value = 1
}

// ── Usage ──
const { data: usage } = await useFetch(
  () => `/api/admin/users/${userId.value}/bot/usage`,
  { default: () => ({}) },
)

// ── Usage computed ──
const totalTokens = computed(() => (usage.value as any)?.total_tokens ?? 0)
const totalCost = computed(() => (usage.value as any)?.total_cost ?? 0)
const modelsUsed = computed(() => {
  const m = (usage.value as any)?.models
  if (Array.isArray(m)) return m.join('، ')
  if (typeof m === 'string') return m
  return '---'
})

// ── Form for bot settings ──
const form = reactive({
  model: '',
  admin_telegram_enabled: false,
  admin_instagram_enabled: false,
  telegram_bot_token: '',
  manager_group_id: '',
})

watch(botSettings, (val) => {
  if (val) {
    form.model = val.model || ''
    form.admin_telegram_enabled = val.admin_telegram_enabled ?? false
    form.admin_instagram_enabled = val.admin_instagram_enabled ?? false
    form.telegram_bot_token = val.telegram_bot_token || ''
    form.manager_group_id = val.manager_group_id || ''
  }
}, { immediate: true })

const saving = ref(false)

async function saveSettings() {
  if (saving.value) return
  saving.value = true
  try {
    await $fetch(`/api/admin/users/${userId.value}/bot/bot/settings`, {
      method: 'POST',
      body: {
        model: form.model,
        admin_telegram_enabled: form.admin_telegram_enabled,
        admin_instagram_enabled: form.admin_instagram_enabled,
        telegram_bot_token: form.telegram_bot_token || undefined,
        manager_group_id: form.manager_group_id,
      },
    })
    toastStore.push('تنظیمات با موفقیت ذخیره شد', 'success')
    await refreshSettings()
  } catch (error: any) {
    toastStore.showZodError(error)
  } finally {
    saving.value = false
  }
}

// ── Conversation helpers (same pattern as user conversations) ──
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

// ── Modal (messages) ──
const modalConvId = ref<number | null>(null)
const modalConversation = computed(() =>
  conversations.value.records.find((r) => r.id === modalConvId.value) ?? null,
)
const messagesMap = ref<Record<number, Message[]>>({})
const messagesLoading = ref(false)
const modalRef = ref<HTMLDialogElement | null>(null)

async function openModal(id: number) {
  modalConvId.value = id

  if (!messagesMap.value[id]) {
    const row = conversations.value.records.find((r) => r.id === id)
    if (!row) return

    messagesLoading.value = true
    try {
      const msgs = await $fetch<Message[]>(
        `/api/admin/users/${userId.value}/bot/conversations/messages?platform=${row.platform}&user_id=${row.external_user_id}&limit=100`,
      )
      messagesMap.value = { ...messagesMap.value, [id]: msgs }
    } catch {
      messagesMap.value = { ...messagesMap.value, [id]: [] }
    } finally {
      messagesLoading.value = false
    }
  }

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

// ── Delete conversation ──
async function deleteConversation(conv: any) {
  if (!confirm('آیا از حذف این گفتگو اطمینان دارید؟')) return
  try {
    await $fetch(
      `/api/admin/users/${userId.value}/bot/conversations/delete?id=${conv.id}&platform=${conv.platform}&user_id=${conv.external_user_id}`,
      { method: 'DELETE' },
    )
    toastStore.push('گفتگو با موفقیت حذف شد', 'success')
    await refreshConversations()
  } catch (error: any) {
    toastStore.push(error?.data?.message || error?.message || 'خطا در حذف گفتگو', 'error')
  }
}
</script>

<template>
  <AdminPage title="جزئیات کاربر" :subtitle="userInfo?.email || ''">
    <div v-if="userStatus === 'pending'" class="flex justify-center py-10">
      <AdminLoadingSpinner title="در حال بارگذاری..." />
    </div>
    <div v-else-if="!userInfo" class="text-center py-10 opacity-60">
      <AdminThereIsNo />
    </div>
    <div v-else class="space-y-6">
      <!-- ── User Info ── -->
      <AdminCard title="اطلاعات کاربر">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <span class="text-sm opacity-60 block">شناسه</span>
            <span class="font-semibold">{{ userInfo.id }}</span>
          </div>
          <div>
            <span class="text-sm opacity-60 block">نام کاربری</span>
            <span class="font-semibold">{{ userInfo.username }}</span>
          </div>
          <div>
            <span class="text-sm opacity-60 block">ایمیل</span>
            <span class="font-semibold">{{ userInfo.email }}</span>
          </div>
          <div>
            <span class="text-sm opacity-60 block">آدرس بات</span>
            <span class="font-semibold font-mono text-sm" dir="ltr">{{ userInfo.bot_url || '---' }}</span>
          </div>
          <div>
            <span class="text-sm opacity-60 block">تاریخ ایجاد</span>
            <span class="font-semibold">{{ new Date(userInfo.created_at).toLocaleDateString('fa-IR') }}</span>
          </div>
        </div>
      </AdminCard>

      <!-- ── Stats Overview ── -->
      <AdminCard title="آمار کلی">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Tokens total -->
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-4">
              <p class="text-xs opacity-60">توکن مصرفی (کل)</p>
              <p class="text-lg font-bold">{{ totalTokens.toLocaleString('fa-IR') }}</p>
            </div>
          </article>
          <!-- Cost total -->
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-4">
              <p class="text-xs opacity-60">هزینه کل</p>
              <p class="text-lg font-bold">{{ totalCost.toLocaleString('fa-IR') }}</p>
            </div>
          </article>
          <!-- Messages received -->
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-4">
              <p class="text-xs opacity-60">پیام‌های دریافتی</p>
              <p class="text-lg font-bold">{{ (msgCounts?.received || 0).toLocaleString('fa-IR') }}</p>
            </div>
          </article>
          <!-- Messages responded -->
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-4">
              <p class="text-xs opacity-60">پاسخ‌های ارسالی</p>
              <p class="text-lg font-bold">{{ (msgCounts?.responded || 0).toLocaleString('fa-IR') }}</p>
            </div>
          </article>
          <!-- Conversations count -->
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-4">
              <p class="text-xs opacity-60">تعداد گفتگوها</p>
              <p class="text-lg font-bold">{{ (conversations?.total || 0).toLocaleString('fa-IR') }}</p>
            </div>
          </article>
          <!-- Models used -->
          <article class="card border border-base-300 bg-base-200">
            <div class="card-body p-4">
              <p class="text-xs opacity-60">مدل‌های استفاده شده</p>
              <p class="text-lg font-bold truncate">{{ modelsUsed }}</p>
            </div>
          </article>
        </div>
      </AdminCard>

      <!-- ── Bot Settings ── -->
      <AdminCard title="تنظیمات ربات">
        <div v-if="settingsStatus === 'pending'" class="flex justify-center py-4">
          <AdminLoadingSpinner title="در حال بارگذاری..." />
        </div>
        <div v-else class="space-y-4">
          <!-- Model -->
          <AdminUiText v-model="form.model" label="مدل" placeholder="gpt-4o-mini" />

          <!-- Admin Telegram enabled toggle -->
          <div class="flex items-center justify-between py-2 border-b border-base-300">
            <div>
              <span class="font-semibold">تلگرام (مدیریتی)</span>
              <p class="text-xs opacity-60">اولویت بالاتر از تنظیمات کاربر</p>
            </div>
            <button
              class="btn btn-sm"
              :class="form.admin_telegram_enabled ? 'btn-success' : 'btn-error'"
              @click="form.admin_telegram_enabled = !form.admin_telegram_enabled"
            >
              <span v-if="form.admin_telegram_enabled">فعال</span>
              <span v-else>غیرفعال</span>
            </button>
          </div>

          <!-- Admin Instagram enabled toggle -->
          <div class="flex items-center justify-between py-2 border-b border-base-300">
            <div>
              <span class="font-semibold">اینستاگرام (مدیریتی)</span>
              <p class="text-xs opacity-60">اولویت بالاتر از تنظیمات کاربر</p>
            </div>
            <button
              class="btn btn-sm"
              :class="form.admin_instagram_enabled ? 'btn-success' : 'btn-error'"
              @click="form.admin_instagram_enabled = !form.admin_instagram_enabled"
            >
              <span v-if="form.admin_instagram_enabled">فعال</span>
              <span v-else>غیرفعال</span>
            </button>
          </div>

          <!-- User Telegram (read-only) -->
          <div class="flex items-center justify-between py-2 border-b border-base-300">
            <div>
              <span class="font-semibold">تلگرام (کاربر)</span>
              <p class="text-xs opacity-60">تنظیم شده توسط کاربر (فقط خواندنی)</p>
            </div>
            <span
              class="badge"
              :class="botSettings?.telegram_enabled ? 'badge-success' : 'badge-ghost'"
            >
              {{ botSettings?.telegram_enabled ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>

          <!-- User Instagram (read-only) -->
          <div class="flex items-center justify-between py-2 border-b border-base-300">
            <div>
              <span class="font-semibold">اینستاگرام (کاربر)</span>
              <p class="text-xs opacity-60">تنظیم شده توسط کاربر (فقط خواندنی)</p>
            </div>
            <span
              class="badge"
              :class="botSettings?.instagram_enabled ? 'badge-success' : 'badge-ghost'"
            >
              {{ botSettings?.instagram_enabled ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>

          <!-- Manager group ID -->
          <AdminUiText v-model="form.manager_group_id" label="شناسه گروه مدیریت" placeholder="123456789-" />

          <!-- Bot token -->
          <label class="form-control">
            <span class="label-text">توکن ربات تلگرام</span>
            <input
              type="password"
              v-model="form.telegram_bot_token"
              class="input input-bordered w-full font-mono"
              placeholder="توکن ربات تلگرام"
            />
            <span class="label-text-alt mt-1 opacity-60">
              برای اعمال تغییر، توکن جدید را وارد کنید
            </span>
          </label>

          <!-- Save button -->
          <div class="flex justify-start pt-2">
            <button class="btn btn-primary" :disabled="saving" @click="saveSettings">
              <span v-if="saving" class="loading loading-spinner loading-xs" />
              <span v-else>ذخیره تنظیمات</span>
            </button>
          </div>
        </div>
      </AdminCard>

      <!-- ── Conversations ── -->
      <AdminCard title="گفتگوها">
        <!-- Filters -->
        <div class="grid gap-4 md:grid-cols-4 mb-4">
          <AdminUiSelect v-model="conversationsPlatform" label="پلتفرم" :options="platformOptions" />
          <AdminUiText v-model="conversationsSearch" label="شناسه کاربر" placeholder="جستجوی external_user_id..." />
          <div>
            <label class="text-sm opacity-70 block mb-1">از تاریخ</label>
            <input v-model="conversationsDateFrom" type="date" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="text-sm opacity-70 block mb-1">تا تاریخ</label>
            <input v-model="conversationsDateTo" type="date" class="input input-bordered w-full" />
          </div>
        </div>
        <div class="mt-3 flex gap-2 mb-4">
          <button class="btn btn-primary btn-sm" @click="applyConvFilters">اعمال فیلتر</button>
        </div>

        <div v-if="convStatus === 'pending'" class="flex justify-center py-4">
          <AdminLoadingSpinner title="در حال بارگذاری..." />
        </div>
        <div v-else-if="conversations.records.length === 0">
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
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in conversations.records"
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
                <td>
                  <button class="btn btn-xs btn-error" @click.stop="deleteConversation(row)">
                    <i class="fa-solid fa-trash" />
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2">
            <button class="btn btn-sm" :disabled="conversationsPage <= 1" @click="goToConvPage(conversationsPage - 1)">
              قبلی
            </button>
            <span class="text-sm opacity-70">
              صفحه {{ conversationsPage }} از {{ totalPages }}
            </span>
            <button class="btn btn-sm" :disabled="conversationsPage >= totalPages" @click="goToConvPage(conversationsPage + 1)">
              بعدی
            </button>
          </div>
        </div>
      </AdminCard>
    </div>

    <!-- ── Message Detail Modal ── -->
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