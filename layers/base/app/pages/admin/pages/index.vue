<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'
import type { PageRecord } from '~~/layers/base/types/page-builder'
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
      form.title = ''
      form.slug = ''
      form.locale = ''
      await refresh()
      await navigateTo(`/admin/pages/${result.pages.id}`)
    } catch (err: any) {
      toastStore.push(err ? (err.statusMessage ? err.statusMessage : err.message) : $t('admin.pages.createFailed'), 'error')
    } finally {
      creating.value = false
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold">{{ $t('admin.pages.title') }}</h2>
      <p class="opacity-70">{{ $t('admin.pages.description') }}</p>
    </div>

    <section class="card bg-base-100 shadow">
      <div class="card-body space-y-4">
        <h3 class="card-title">{{ $t('admin.pages.create') }}</h3>
        <div class="grid gap-4 md:grid-cols-3">
          <label class="form-control">
            <span class="label-text">{{ $t('common.title') }}</span>
            <input v-model="form.title" class="input input-bordered" type="text" />
          </label>
          <label class="form-control">
            <span class="label-text">{{ $t('common.slug') }}</span>
            <input v-model="form.slug" class="input input-bordered" type="text" placeholder="about" />
          </label>
          <label class="form-control">
            <span class="label-text">{{ $t('common.locale') }}</span>
            <select v-model="form.locale" class="input input-bordered">
              <option disabled value="">Select locale</option>
              <option v-for="(loc, i) in locales" :value="loc.code" :key="i">{{ loc.name }}</option>
            </select>
          </label>
        </div>
        <button class="btn btn-primary w-fit" :class="{ 'btn-disabled': creating }" @click="createPage">
          <span v-if="creating" class="loading loading-spinner"></span>
          {{ $t('admin.pages.create') }}
        </button>
      </div>
    </section>

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
  </div>
</template>
