<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'
import { useLoadingStore } from '~~/packages/base/app/stores/loading'
import type { PageRecord } from '~~/packages/base/types/page-builder'
const { locale, locales, setLocale } = useI18n()

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.sidebar.pages') }))

// type PageSummary = Pick<PageRecord>

const { data, refresh } = await useFetch<PageRecord[]>('/api/pages', {
  default: () => [],
})

const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const creating = ref(false)
const form = reactive({
  title: '',
  slug: '',
  locale: '',
})

const createPage = async () => {
  if (!form.title || !form.slug || !form.locale) return
  creating.value = true
  await loadingStore.withActionLoading(async () => {
    try {
      const result = await $fetch<PageRecord>('/api/pages', {
        method: 'POST',
        body: { title: form.title, slug: form.slug, locale: form.locale },
      })
      toastStore.push($t('admin.pages.createSuccess'), 'success')
      const createdLocale = form.locale
      form.title = ''
      form.slug = ''
      form.locale = ''
      await refresh()
      await navigateTo(`/admin/pages/${result.pages.id}?locale=${createdLocale}`)
    } catch (err: any) {
      toastStore.push(err ? (err.statusMessage ? err.statusMessage : err.message) : $t('admin.pages.createFailed'), 'error')
    } finally {
      creating.value = false
    }
  })
}
</script>

<template>
  <AdminPage :title="$t('admin.pages.title')" :subtitle="$t('admin.pages.description')">
    <AdminCard :title="$t('admin.pages.create')">
      <div class="grid gap-4 md:grid-cols-3">
        <AdminUiText :label="$t('common.title')" v-model="form.title" />
        <AdminUiText :label="$t('common.slug')" v-model="form.slug" />
        <AdminLocaleSelector :label="$t('admin.locale')" v-model="form.locale" />
      </div>

      <button class="btn btn-primary w-fit" :class="{ 'btn-disabled': creating }" @click="createPage">
        <span v-if="creating" class="loading loading-spinner"></span>
        {{ $t('admin.pages.create') }}
      </button>
    </AdminCard>
    <section class="card bg-base-100 shadow">
      <div class="card-body space-y-4">
        <h3 class="card-title" v-if="data.length > 0">{{ $t('common.sections') }}</h3>
        <div class="overflow-x-auto">
          <table class="table" v-if="data.length > 0">
            <thead>
              <tr>
                <th>{{ $t('common.title') }}</th>
                <th>{{ $t('common.slug') }}</th>
                <th>{{ $t('common.status') }}</th>
                <th>{{ $t('common.locale') }}</th>
                <th>{{ $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pageItem in data" :key="pageItem.pages.id">
                <td class="font-medium">{{ pageItem.pages_locales.title }}</td>
                <td>/{{ pageItem.pages_locales.slug }}</td>
                <td>{{ pageItem.pages.status }}</td>
                <td>{{ pageItem.pages_locales.locale }}</td>
                <td>
                  <NuxtLink class="link"
                    :to="$localePath(`/admin/pages/${pageItem.pages.id}?locale=${pageItem.pages_locales.locale}`)">
                    {{ $t('common.edit') }}
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center opacity-60">{{ $t('admin.pages.empty') }}</div>
        </div>
      </div>
    </section>
  </AdminPage>
</template>
