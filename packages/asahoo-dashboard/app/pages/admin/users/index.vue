<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: 'مدیریت کاربران' }))

const toastStore = useToastStore()
const { data: usersList, refresh } = await useFetch('/api/admin/users', {
  default: () => [] as any[],
})
const searchQuery = ref('')
const showForm = ref(false)
const editingUser = ref<any>(null)
const form = reactive({
  username: '',
  email: '',
  password: '',
  bot_url: '',
  bot_token: '',
  cf_token: '',
})
const isSubmitting = ref(false)
const autoFetch = ref(true)

// Search
const searchResults = computed(() => {
  if (!searchQuery.value) return usersList.value
  const q = searchQuery.value.toLowerCase()
  return usersList.value.filter(
    (u: any) =>
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
  )
})

function resetForm() {
  form.username = ''
  form.email = ''
  form.password = ''
  form.bot_url = ''
  form.bot_token = ''
  form.cf_token = ''
  editingUser.value = null
  showForm.value = false
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(user: any) {
  editingUser.value = user
  form.username = user.username
  form.email = user.email
  form.password = ''
  form.bot_url = user.bot_url || ''
  form.bot_token = user.bot_token || ''
  form.cf_token = user.cf_token || ''
  showForm.value = true
}

async function save() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    if (editingUser.value) {
      const body: Record<string, string> = { username: form.username, email: form.email, bot_url: form.bot_url, bot_token: form.bot_token }
      if (form.password) body.password = form.password
      if (form.cf_token) body.cf_token = form.cf_token
      if (autoFetch.value) body.auto_fetch = 'true'
      await $fetch(`/api/admin/users/${editingUser.value.id}`, {
        method: 'PUT',
        body,
      })
      toastStore.push('کاربر با موفقیت به‌روزرسانی شد', 'success')
    } else {
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: {
          username: form.username,
          email: form.email,
          password: form.password,
          bot_url: form.bot_url || undefined,
          bot_token: form.bot_token || undefined,
          auto_fetch: autoFetch.value || undefined,
          cf_token: form.cf_token || undefined,
        },
      })
      toastStore.push('کاربر با موفقیت ایجاد شد', 'success')
    }
    resetForm()
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  } finally {
    isSubmitting.value = false
  }
}

async function remove(id: number) {
  if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) return
  try {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    toastStore.push('کاربر با موفقیت حذف شد', 'success')
    await refresh()
  } catch (error: any) {
    toastStore.push(error.message || 'خطا در حذف کاربر', 'error')
  }
}
</script>

<template>
  <AdminPage>
    <div class="grid gap-4 md:grid-cols-2">
      <!-- Form Card -->
      <AdminCard v-if="showForm" :title="editingUser ? 'ویرایش کاربر' : 'کاربر جدید'">
        <AdminUiText label="نام کاربری" v-model="form.username" />
        <AdminUiText label="ایمیل" v-model="form.email" />
        <AdminUiText
          :label="editingUser ? 'رمز عبور (خالی بگذارید تا تغییر نکند)' : 'رمز عبور'"
          type="password"
          v-model="form.password"
        />
        <AdminUiText label="آدرس بات" v-model="form.bot_url" placeholder="https://asahoo-bot.workers.dev" />
        <label class="flex items-center gap-2 mt-2">
          <input type="checkbox" v-model="autoFetch" class="checkbox checkbox-primary" />
          <span class="text-sm">دریافت خودکار توکن</span>
        </label>
        <AdminUiText label="توکن بات" v-model="form.bot_token" placeholder="API token" />
        <AdminUiText label="توکن ابری" type="password" v-model="form.cf_token" placeholder="Cloudflare API token (اختیاری)" />
        <div class="flex gap-2 mt-2">
          <button class="btn btn-primary" :disabled="isSubmitting" @click="save">
            {{ isSubmitting ? 'در حال ذخیره...' : 'ذخیره' }}
          </button>
          <button class="btn" @click="resetForm">انصراف</button>
        </div>
      </AdminCard>

      <!-- Users List Card -->
      <AdminCard title="کاربران">
        <!-- Search -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجوی کاربر..."
            class="input input-bordered w-full"
          />
        </div>

        <!-- New User Button -->
        <button v-if="!showForm" class="btn btn-primary mb-4" @click="openCreate">
          <i class="fa-solid fa-plus ml-1" />
          کاربر جدید
        </button>

        <!-- Table -->
        <div v-if="searchResults.length === 0" class="text-center py-8 opacity-60">
          <AdminThereIsNo />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>نام کاربری</th>
                <th>ایمیل</th>
                <th>بات</th>
                <th>تاریخ ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in searchResults" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span v-if="user.bot_url" class="badge badge-success badge-sm">فعال</span>
                  <span v-else class="badge badge-ghost badge-sm">غیرفعال</span>
                </td>
                <td>{{ new Date(user.created_at).toLocaleDateString('fa-IR') }}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-xs" @click="openEdit(user)">
                      <i class="fa-solid fa-pen" />
                      ویرایش
                    </button>
                    <button class="btn btn-xs btn-error" @click="remove(user.id)">
                      <i class="fa-solid fa-trash" />
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  </AdminPage>
</template>