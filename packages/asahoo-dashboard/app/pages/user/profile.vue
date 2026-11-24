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
    </div>
  </AdminPage>
</template>