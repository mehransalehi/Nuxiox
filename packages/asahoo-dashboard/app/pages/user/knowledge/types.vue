<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

definePageMeta({ layout: 'user', middleware: 'user-auth' })
useHead(() => ({ title: 'مدیریت انواع دانش' }))

const toastStore = useToastStore()

interface KnowledgeType {
  id: number
  name: string
  description: string
  icon: string
  sort_order: number
}

const { data, refresh, status } = await useFetch<KnowledgeType[]>('/api/user/knowledge-types', {
  default: () => [],
})

const editingId = ref<number | null>(null)
const newForm = reactive({ name: '', description: '', icon: '', sort_order: 0 })
const editForm = reactive({ name: '', description: '', icon: '', sort_order: 0 })
const showNewForm = ref(false)

function resetNewForm() {
  newForm.name = ''
  newForm.description = ''
  newForm.icon = ''
  newForm.sort_order = 0
  showNewForm.value = false
}

function startEdit(item: KnowledgeType) {
  editingId.value = item.id
  editForm.name = item.name
  editForm.description = item.description ?? ''
  editForm.icon = item.icon ?? ''
  editForm.sort_order = item.sort_order ?? 0
}

function cancelEdit() {
  editingId.value = null
}

async function createType() {
  if (!newForm.name) {
    toastStore.push('نام نوع الزامی است', 'error')
    return
  }
  try {
    await $fetch('/api/user/knowledge-types', { method: 'POST', body: { ...newForm } })
    toastStore.push('نوع با موفقیت ایجاد شد', 'success')
    resetNewForm()
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  }
}

async function updateType(id: number) {
  if (!editForm.name) {
    toastStore.push('نام نوع الزامی است', 'error')
    return
  }
  try {
    await $fetch(`/api/user/knowledge-types/${id}`, { method: 'PUT', body: { ...editForm } })
    toastStore.push('نوع با موفقیت بروزرسانی شد', 'success')
    cancelEdit()
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  }
}

async function removeType(id: number) {
  if (!confirm('آیا از حذف این نوع اطمینان دارید؟')) return
  try {
    await $fetch(`/api/user/knowledge-types/${id}`, { method: 'DELETE' })
    toastStore.push('نوع با موفقیت حذف شد', 'success')
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  }
}
</script>

<template>
  <AdminPage title="انواع دانش" subtitle="مدیریت دسته‌بندی‌های رکوردهای دانشنامه">
    <template #header>
      <button class="btn btn-primary" @click="showNewForm = !showNewForm">
        {{ showNewForm ? 'انصراف' : 'نوع جدید' }}
      </button>
    </template>

    <AdminCard v-if="showNewForm" title="ایجاد نوع جدید">
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiText v-model="newForm.name" label="نام" placeholder="نام نوع" />
        <AdminUiText v-model="newForm.icon" label="آیکون" placeholder="fa-solid fa-database" />
        <AdminUiTextarea v-model="newForm.description" label="توضیحات" placeholder="توضیحات نوع" />
        <AdminUiNumber v-model="newForm.sort_order" label="ترتیب" placeholder="0" />
      </div>
      <button class="btn btn-primary mt-4" @click="createType">ذخیره</button>
    </AdminCard>

    <AdminCard>
      <div v-if="status === 'pending'" class="flex justify-center py-4">
        <AdminLoadingSpinner title="در حال بارگذاری..." />
      </div>
      <div v-else-if="data.length === 0" class="overflow-x-auto">
        <AdminThereIsNo>نوع دانشی تعریف نشده است</AdminThereIsNo>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام</th>
              <th>توضیحات</th>
              <th>آیکون</th>
              <th>ترتیب</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.id">
              <template v-if="editingId === row.id">
                <td>{{ row.id }}</td>
                <td><input v-model="editForm.name" class="input input-bordered input-sm w-full" /></td>
                <td><input v-model="editForm.description" class="input input-bordered input-sm w-full" /></td>
                <td><input v-model="editForm.icon" class="input input-bordered input-sm w-full" /></td>
                <td><input v-model="editForm.sort_order" type="number" class="input input-bordered input-sm w-20" /></td>
                <td class="space-x-2">
                  <button class="btn btn-xs btn-primary" @click="updateType(row.id)">ذخیره</button>
                  <button class="btn btn-xs" @click="cancelEdit">انصراف</button>
                </td>
              </template>
              <template v-else>
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td class="max-w-xs truncate">{{ row.description }}</td>
                <td><i :class="row.icon" aria-hidden="true" /></td>
                <td>{{ row.sort_order }}</td>
                <td class="space-x-2">
                  <button class="btn btn-xs" @click="startEdit(row)">ویرایش</button>
                  <button class="btn btn-xs btn-error" @click="removeType(row.id)">حذف</button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminCard>
  </AdminPage>
</template>