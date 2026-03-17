<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.blog.categories') }))

const { data, refresh } = await useFetch('/api/admin/blog/categories', { default: () => [] as any[] })
console.log(data.value)
const form = reactive({ name: '', slug: '', description: '', locale: '' })
const editingId = ref<number | null>(null)
const { locale, locales, setLocale } = useI18n()
const toastStore = useToastStore()
const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.slug = ''
  form.description = ''
  form.locale = '';
}

const submit = async () => {
  if (!form.locale || !form.slug || !form.name) {
    toastStore.push($t("Star Feild required"), 'error')
    return;
  }
  try {
    if (editingId.value) {
      await $fetch(`/api/admin/blog/categories/${editingId.value}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/admin/blog/categories', { method: 'POST', body: form })
    }
    resetForm()
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error);
  }

}

const edit = (row: any) => {
  editingId.value = row.id
  form.name = row.name
  form.slug = row.slug
  form.locale = row.locale
  form.description = row.description || ''
  form.locale = row.locale
}

const remove = async (id: number) => {
  await $fetch(`/api/admin/blog/categories/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <AdminPage :title="$t('admin.blog.categories')">
    <template #header>
        <div class="flex gap-2">
          <button class="btn btn-primary" @click="submit">{{ editingId ? $t('common.update') :
            $t('common.create') }}</button>
          <button v-if="editingId" class="btn" @click="resetForm">{{ $t('common.cancel') }}</button>
        </div>
    </template>


    <AdminCard :title="editingId ? $t('admin.blog.editCategory') : $t('admin.blog.createCategory')">
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiText :label="$t('admin.blog.categoryName')+'*'" v-model="form.name" />
        <AdminUiText :label="$t('common.slug')+'*'" v-model="form.slug" />
        <AdminUiTextarea :label="$t('admin.blog.categoryDescription')" v-model="form.description" />
        <AdminLocaleSelector :label="$t('common.locale')+'*'" v-model="form.locale" />
      </div>
    </AdminCard>
  </AdminPage>
  <div class="space-y-6">

    <section class="card bg-base-100 shadow">
      <div class="card-body overflow-x-auto">
        <table class="table" v-if="data.length > 0">
          <thead>
            <tr>
              <th>{{ $t('admin.blog.categoryName') }}</th>
              <th>{{ $t('common.slug') }}</th>
              <th>{{ $t('common.locale') }}</th>
              <th>{{ $t('admin.blog.posts') }}</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.slug }}</td>
              <td>{{ row.locale }}</td>
              <td>{{ row.postsCount }}</td>
              <td class="space-x-2"><button class="btn btn-xs" @click="edit(row)">{{ $t('common.edit')
                  }}</button><button class="btn btn-xs btn-error" @click="remove(row.id)">{{ $t('common.delete')
                  }}</button></td>
            </tr>
          </tbody>
        </table>
        <AdminThereIsNo v-else>{{ $t("admin.blog.categories") }}</AdminThereIsNo>
      </div>
    </section>
  </div>
</template>
