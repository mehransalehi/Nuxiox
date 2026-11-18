<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'ویرایش رکورد دانشنامه' }))

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const isNew = computed(() => route.params.id === 'new' || route.params.id === 'new?')

interface KnowledgeForm {
  type_id: number | null
  title: string
  description: string
  data_json: string
  status: string
}

const form = reactive<KnowledgeForm>({
  type_id: null,
  title: '',
  description: '',
  data_json: '',
  status: 'draft',
})

const types = ref<{ id: number; name: string }[]>([])
const loading = ref(true)
const isSaving = ref(false)

async function fetchTypes() {
  try {
    const res = await $fetch('/api/user/knowledge-types')
    types.value = Array.isArray(res) ? res : (res as any).types ?? []
  } catch {
    types.value = []
  }
}

async function loadRecord() {
  if (isNew.value) {
    loading.value = false
    return
  }
  try {
    const record = await $fetch(`/api/user/knowledge-records/${route.params.id}`)
    form.type_id = record.type_id ?? null
    form.title = record.title ?? ''
    form.description = record.description ?? ''
    form.data_json = typeof record.data_json === 'object' ? JSON.stringify(record.data_json, null, 2) : (record.data_json ?? '')
    form.status = record.status ?? 'draft'
  } catch (error: any) {
    toastStore.push('خطا در بارگذاری رکورد', 'error')
  } finally {
    loading.value = false
  }
}

await fetchTypes()
await loadRecord()

const statusOptions = [
  { key: 'پیش‌نویس', value: 'draft' },
  { key: 'فعال', value: 'active' },
  { key: 'غیرفعال', value: 'inactive' },
]

async function save() {
  isSaving.value = true
  try {
    const body = { ...form }
    if (isNew.value) {
      await $fetch('/api/user/knowledge-records', { method: 'POST', body })
      toastStore.push('رکورد با موفقیت ایجاد شد', 'success')
    } else {
      await $fetch(`/api/user/knowledge-records/${route.params.id}`, { method: 'PUT', body })
      toastStore.push('رکورد با موفقیت بروزرسانی شد', 'success')
    }
    await router.push('/user/knowledge')
  } catch (error: any) {
    toastStore.showZodError(error)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AdminPage :title="isNew ? 'رکورد جدید' : 'ویرایش رکورد'" subtitle="ایجاد یا ویرایش رکورد دانشنامه">
    <div v-if="loading" class="flex justify-center py-10">
      <AdminLoadingSpinner title="در حال بارگذاری..." />
    </div>
    <div v-else class="space-y-6">
      <AdminCard>
        <div class="grid gap-4">
          <AdminUiSelect
            v-model="form.type_id"
            label="نوع"
            :options="types.map(t => ({ key: t.name, value: String(t.id) }))"
          />
          <AdminUiText v-model="form.title" label="عنوان" placeholder="عنوان رکورد" />
          <AdminUiTextarea v-model="form.description" label="توضیحات" placeholder="توضیحات رکورد" />
          <AdminUiTextarea v-model="form.data_json" label="داده (JSON)" placeholder='{"key": "value"}' />
          <AdminUiSelect
            v-model="form.status"
            label="وضعیت"
            :options="statusOptions"
          />
        </div>
        <div class="mt-4 flex gap-2">
          <button class="btn btn-primary" :disabled="isSaving" @click="save">
            {{ isSaving ? 'در حال ذخیره...' : (isNew ? 'ایجاد' : 'ذخیره تغییرات') }}
          </button>
          <NuxtLink to="/user/knowledge" class="btn">انصراف</NuxtLink>
        </div>
      </AdminCard>
    </div>
  </AdminPage>
</template>