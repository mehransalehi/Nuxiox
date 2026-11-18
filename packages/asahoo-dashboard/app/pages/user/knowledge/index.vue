<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'دانشنامه' }))

const toastStore = useToastStore()

interface KnowledgeRecord {
  id: number
  title: string
  type_name: string
  status: string
  updated_at: string
}

const search = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const page = ref(1)
const perPage = 20

const query = computed(() => {
  const params = new URLSearchParams()
  params.set('page', String(page.value))
  params.set('limit', String(perPage))
  if (search.value) params.set('search', search.value)
  if (typeFilter.value) params.set('type_id', typeFilter.value)
  if (statusFilter.value) params.set('status', statusFilter.value)
  return params.toString()
})

const { data, refresh, status } = await useFetch<{ records: KnowledgeRecord[]; total: number }>(
  () => `/api/user/knowledge-records?${query.value}`,
  {
    default: () => ({ records: [], total: 0 }),
  },
)

const totalPages = computed(() => Math.ceil((data.value?.total ?? 0) / perPage) || 1)

const types = ref<{ id: number; name: string }[]>([])

async function fetchTypes() {
  try {
    const res = await $fetch('/api/user/knowledge-types')
    types.value = Array.isArray(res) ? res : (res as any).types ?? []
  } catch {
    types.value = []
  }
}
fetchTypes()

const statusOptions = [
  { key: 'فعال', value: 'published' },
  { key: 'غیرفعال', value: 'archived' },
  { key: 'پیش‌نویس', value: 'draft' },
]

async function removeRecord(id: number) {
  if (!confirm('آیا از حذف این رکورد اطمینان دارید؟')) return
  try {
    await $fetch(`/api/user/knowledge-records/${id}`, { method: 'DELETE' })
    toastStore.push('رکورد با موفقیت حذف شد', 'success')
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  }
}

function goToPage(p: number) {
  page.value = p
}
</script>

<template>
  <AdminPage title="دانشنامه" subtitle="مدیریت رکوردهای دانشنامه">
    <template #header>
      <NuxtLink to="/user/knowledge/edit/new" class="btn btn-primary">رکورد جدید</NuxtLink>
    </template>

    <AdminCard title="فیلترها">
      <div class="grid gap-4 md:grid-cols-4">
        <AdminUiText v-model="search" label="جستجو" placeholder="عنوان..." />
        <AdminUiSelect
          v-model="typeFilter"
          label="نوع"
          :options="[{ key: 'همه', value: '' }, ...types.map(t => ({ key: t.name, value: String(t.id) }))]"
        />
        <AdminUiSelect
          v-model="statusFilter"
          label="وضعیت"
          :options="[{ key: 'همه', value: '' }, ...statusOptions]"
        />
        <div class="flex items-end">
          <button class="btn btn-outline w-full" @click="refresh">اعمال فیلتر</button>
        </div>
      </div>
    </AdminCard>

    <AdminCard>
      <div v-if="status === 'pending'" class="flex justify-center py-4">
        <AdminLoadingSpinner title="در حال بارگذاری..." />
      </div>
      <div v-else-if="data.records.length === 0">
        <AdminThereIsNo>رکورد دانشنامه‌ای یافت نشد</AdminThereIsNo>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>عنوان</th>
              <th>نوع</th>
              <th>وضعیت</th>
              <th>آخرین بروزرسانی</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data.records" :key="row.id">
              <td>{{ row.id }}</td>
              <td>
                <NuxtLink :to="`/user/knowledge/edit/${row.id}`" class="link link-primary">
                  {{ row.title }}
                </NuxtLink>
              </td>
              <td>{{ row.type_name }}</td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'badge-success': row.status === 'published',
                    'badge-warning': row.status === 'draft',
                    'badge-ghost': row.status === 'archived',
                  }"
                >
                  {{ row.status === 'published' ? 'فعال' : row.status === 'draft' ? 'پیش‌نویس' : 'غیرفعال' }}
                </span>
              </td>
              <td>{{ new Date(row.updated_at).toLocaleDateString('fa-IR') }}</td>
              <td class="space-x-2">
                <NuxtLink :to="`/user/knowledge/edit/${row.id}`" class="btn btn-xs">ویرایش</NuxtLink>
                <button class="btn btn-xs btn-error" @click="removeRecord(row.id)">حذف</button>
              </td>
            </tr>
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