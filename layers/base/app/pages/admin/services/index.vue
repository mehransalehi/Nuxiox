<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.modules.services') }))

const toastStore = useToastStore()
const { locale, locales } = useI18n()
const { data, refresh } = await useFetch('/api/admin/services', { default: () => [] as any[] })
const form = reactive<any>({ id: null, locale: '', title: '', subtitle: '', description: '', icon: '', image: '', link: '', sortOrder: 0, isActive: true, extra: [] })
const reset = () => Object.assign(form, { id: null, locale: '', title: '', subtitle: '', description: '', icon: '', image: '', link: '', sortOrder: 0, isActive: true, extra: [] })
const edit = (item: any) => {
  Object.assign(
    form, structuredClone(item),
    { extra: Array.isArray(item.extra) ? item.extra : [] })
}

const updateExtra = (list: any) => {
  form.extra = list;
}
const save = async () => {
  try {
    await $fetch(form.id ? `/api/admin/services/${form.id}` : '/api/admin/services',
      {
        method: form.id ? 'PUT' : 'POST',
        body: form
      });
    reset();
    toastStore.push($t('sections.services.saved'), 'success')
    await refresh()
  } catch (error: any) {
    toastStore.showZodError(error)
  }
}
const remove = async (id: number,locale:string) => { await $fetch(`/api/admin/services/${id}?locale=${locale}`, { method: 'DELETE' }); await refresh() }
</script>

<template>
  <AdminPage>
    <div class="grid gap-4 md:grid-cols-2">
      <AdminCard :title="form.id ? $t('admin.modules.editItem') : $t('admin.modules.createItem')">
        <AdminUiText :label="$t('common.title')" v-model="form.title" />
        <AdminUiText :label="$t('common.subtitle')" v-model="form.subtitle" />
        <AdminUiTextarea :label="$t('sections.services.description')" v-model="form.description" />
        <AdminLocaleSelector :label="$t('common.locale')" v-model="form.locale" />
        <div class="grid gap-2 md:grid-cols-2">
          <AdminUiText :label="$t('common.title')" v-model="form.icon" />
          <AdminUiUrl :label="$t('common.image')" v-model="form.image" />
          <AdminUiUrl :label="$t('common.link')" v-model="form.link" />
          <AdminUiNumber :label="$t('common.order')" v-model="form.sortOrder" />
        </div>

        <AdminUiCheckBox :label="$t('admin.modules.active')" v-model="form.isActive" />
        <AdminListCreator @update="updateExtra" :list="form.extra" />
        <button class="btn btn-primary" @click="save">{{ $t('common.save') }}</button>
        <button class="btn" v-if="form.id" @click="reset">{{ $t('common.cancel') }}</button>
      </AdminCard>
      <AdminCard :title="$t('admin.modules.services')">
        <div v-for="item in data" :key="item.id" class="flex items-center justify-between rounded border p-2">
          <div>
            <p class="font-medium">{{ `${item.title} (${item.locale})` }}</p>
            <p class="text-xs opacity-70">{{ item.subtitle }}</p>
          </div>
          <div class="flex gap-2"><button class="btn btn-xs" @click="edit(item)">{{ $t('common.edit')
              }}</button><button class="btn btn-xs btn-error" @click="remove(item.id,item.locale)">{{ $t('common.delete')
              }}</button></div>
        </div>
      </AdminCard>
    </div>
  </AdminPage>
</template>
