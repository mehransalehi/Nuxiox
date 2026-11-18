<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'پروفایل کاربری' }))

const toastStore = useToastStore()

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
    contact_info: '',
    timezone: 'Asia/Tehran',
    policies: '',
  }),
})

const form = reactive<ProfileData>({
  name: '',
  description: '',
  contact_info: '',
  timezone: 'Asia/Tehran',
  policies: '',
})

watch(data, (val) => {
  if (val) {
    Object.assign(form, val)
  }
}, { immediate: true })

async function save() {
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
</script>

<template>
  <AdminPage title="پروفایل کسب و کار" subtitle="اطلاعات کسب وکار خود را مدیریت کنید">
    <div v-if="status === 'pending'" class="flex justify-center py-10">
      <AdminLoadingSpinner title="در حال بارگذاری..." />
    </div>
    <div v-else class="space-y-6">
      <AdminCard title="اطلاعات اصلی">
        <div class="grid gap-4 md:grid-cols-2">
          <AdminUiText label="نام کسب و کار" v-model="form.name" placeholder="نام کسب و کار خود را وارد کنید" />
          <AdminUiText label="منطقه زمانی" v-model="form.timezone" placeholder="Asia/Tehran" />
        </div>
        <AdminUiTextarea label="توضیحات" v-model="form.description" placeholder="توضیحات کسب و کار" />
        <AdminUiTextarea label="اطلاعات تماس (JSON)" v-model="form.contact_info" placeholder='{"phone":"","email":"","address":""}' />
        <AdminUiTextarea label="خط مشی‌ها (JSON)" v-model="form.policies" placeholder='{"refund":"","terms":""}' />
        <div class="mt-4">
          <button class="btn btn-primary" @click="save">ذخیره تغییرات</button>
        </div>
      </AdminCard>
    </div>
  </AdminPage>
</template>