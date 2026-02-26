<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'
import type { PageRecord } from '~~/layers/base/types/page-builder'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.sidebar.pages') }))

type PageSummary = Pick<PageRecord, 'id' | 'slug' | 'title' | 'status' | 'createdAt' | 'updatedAt'>

const { data, refresh } = await useFetch<PageSummary[]>('/api/pages', {
  default: () => [],
})

const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const creating = ref(false)
const form = reactive({
  title: '',
  slug: '',
})

const createPage = async () => {
  if (!form.title || !form.slug) return
  creating.value = true
  await loadingStore.withActionLoading(async () => {
    try {
      const page = await $fetch<PageRecord>('/api/pages', {
      method: 'POST',
      body: { title: form.title, slug: form.slug },
    })
    toastStore.push($t('admin.pages.createSuccess'), 'success')
    form.title = ''
    form.slug = ''
    await refresh()
    await navigateTo(`/admin/pages/${page.id}`)
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : $t('admin.pages.createFailed'), 'error')
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
        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text">{{ $t('common.title') }}</span>
            <input v-model="form.title" class="input input-bordered" type="text" />
          </label>
          <label class="form-control">
            <span class="label-text">{{ $t('common.slug') }}</span>
            <input v-model="form.slug" class="input input-bordered" type="text" placeholder="about" />
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
        <h3 class="card-title">{{ $t('common.sections') }}</h3>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>{{ $t('common.title') }}</th>
                <th>{{ $t('common.slug') }}</th>
                <th>{{ $t('common.status') }}</th>
                <th>{{ $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="page in data" :key="page.id">
                <td class="font-medium">{{ page.title }}</td>
                <td>/{{ page.slug }}</td>
                <td>{{ page.status }}</td>
                <td>
                  <NuxtLink class="link" :to="$localePath(`/admin/pages/${page.id}`)">
                    {{ $t('common.edit') }}
                  </NuxtLink>
                </td>
              </tr>
              <tr v-if="data.length === 0">
                <td colspan="4" class="text-center opacity-60">{{ $t('admin.pages.empty') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
