<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'تنظیمات' }))

const toastStore = useToastStore()

interface BotSettings {
  telegram_enabled: boolean
  instagram_enabled: boolean
  telegram_bot_token: string
  manager_group_id: string
}

const { data, status, refresh } = await useFetch<BotSettings>('/api/user/bot/settings', {
  default: () => ({
    telegram_enabled: false,
    instagram_enabled: false,
    telegram_bot_token: '',
    manager_group_id: '',
  }),
})

const form = reactive<BotSettings>({
  telegram_enabled: false,
  instagram_enabled: false,
  telegram_bot_token: '',
  manager_group_id: '',
})

watch(data, (val) => {
  if (val) {
    form.telegram_enabled = val.telegram_enabled ?? false
    form.instagram_enabled = val.instagram_enabled ?? false
    form.telegram_bot_token = val.telegram_bot_token ?? ''
    form.manager_group_id = val.manager_group_id ?? ''
  }
}, { immediate: true })

const verifyLoading = ref(false)
const verifyResult = ref<'success' | 'error' | null>(null)
const verifyMessage = ref('')

async function verifyGroup() {
  if (!form.manager_group_id) {
    toastStore.push('لطفاً شناسه گروه را وارد کنید', 'warning')
    return
  }
  verifyLoading.value = true
  verifyResult.value = null
  verifyMessage.value = ''
  try {
    const res = await $fetch<{ success: boolean; message?: string }>('/api/user/bot/verify-group', {
      method: 'POST',
      body: { group_id: form.manager_group_id },
    })
    if (res.success) {
      verifyResult.value = 'success'
      verifyMessage.value = res.message || 'دسترسی ربات به گروه تأیید شد'
    } else {
      verifyResult.value = 'error'
      verifyMessage.value = res.message || 'خطا در بررسی دسترسی'
    }
  } catch (error: any) {
    verifyResult.value = 'error'
    verifyMessage.value = error?.data?.message || 'خطا در ارتباط با سرور'
  } finally {
    verifyLoading.value = false
  }
}

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/user/bot/settings', {
      method: 'POST',
      body: {
        telegram_enabled: form.telegram_enabled,
        instagram_enabled: form.instagram_enabled,
        telegram_bot_token: form.telegram_bot_token || undefined,
        manager_group_id: form.manager_group_id,
      },
    })
    toastStore.push('تنظیمات با موفقیت ذخیره شد', 'success')
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AdminPage title="تنظیمات" subtitle="تنظیمات ربات و اتصال به پیام‌رسان‌ها">
    <div v-if="status === 'pending'" class="flex justify-center py-10">
      <AdminLoadingSpinner title="در حال بارگذاری..." />
    </div>
    <div v-else class="space-y-6">
      <AdminCard title="اتصال به پیام‌رسان‌ها">
        <div class="space-y-4">
          <AdminUiCheckBox v-model="form.telegram_enabled" label="فعال‌سازی ربات تلگرام" />
          <AdminUiCheckBox v-model="form.instagram_enabled" label="فعال‌سازی ربات اینستاگرام" />
        </div>
      </AdminCard>

      <AdminCard title="تنظیمات ربات تلگرام">
        <div class="space-y-4">
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

          <div class="space-y-2">
            <label class="form-control">
              <span class="label-text">شناسه گروه مدیریت</span>
              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="form.manager_group_id"
                  class="input input-bordered flex-1"
                  placeholder="شناسه گروه (مثلاً 123456789-)"
                />
                <button
                  class="btn btn-outline"
                  :disabled="verifyLoading || !form.manager_group_id"
                  @click="verifyGroup"
                >
                  <span v-if="verifyLoading" class="loading loading-spinner loading-xs" />
                  <span v-else>بررسی دسترسی</span>
                </button>
              </div>
            </label>
            <div v-if="verifyResult === 'success'" class="alert alert-success text-sm">
              {{ verifyMessage }}
            </div>
            <div v-else-if="verifyResult === 'error'" class="alert alert-error text-sm">
              {{ verifyMessage }}
            </div>
          </div>
        </div>
      </AdminCard>

      <div class="flex justify-start">
        <button class="btn btn-primary" :disabled="saving" @click="save">
          <span v-if="saving" class="loading loading-spinner loading-xs" />
          <span v-else>ذخیره تنظیمات</span>
        </button>
      </div>
    </div>
  </AdminPage>
</template>
