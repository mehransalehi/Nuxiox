<script setup lang="ts">
import type { PageBlock, PageRecord } from '~~/packages/base/types/page-builder'
import { defaultPageBuilder } from '~~/packages/base/utils/page-builder'
import { useToastStore } from '~~/packages/base/app/stores/toast'
import { useLoadingStore } from '~~/packages/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.pages.editTitle') }))

type SectionOption = {
  id: string
  label: string
  type: 'section' | 'navbar' | 'footer'
}

type SeoEntry = { key: string; value: string }

const route = useRoute()
const pageId = computed(() => route.params.id as string)
const pageLocale = computed(() => (route.query.locale as string) || 'en')
const localePath = useLocalePath()

const { data, refresh } = await useFetch<PageRecord>(`/api/pages/${pageId.value}?locale=${route.query.locale}`)
console.log(data.value);
const { data: sectionsData } = await useFetch<{ sections: SectionOption[] }>('/api/sections', {
  default: () => ({ sections: [] }),
})

const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const saving = ref(false)
const deleting = ref(false)
const seoEntries = ref<SeoEntry[]>([])

const form = reactive<PageRecord>({
  pages:
  {
    id: 0,
    status: 'draft',
    createdAt: 0,
    updatedAt: 0,
  }, pages_locales: {
    id: 0,
    pageId: 0,
    locale: 'en',
    slug: '',
    title: '',
    seo: {},
    builder: structuredClone(defaultPageBuilder)
  }
})

const defaultSeoEntries = computed<SeoEntry[]>(() => {
  const baseTitle = form.pages_locales.title.trim() || 'Untitled page'
  return [
    { key: 'title', value: baseTitle },
    { key: 'description', value: `Learn more about ${baseTitle}.` },
    { key: 'keywords', value: baseTitle.toLowerCase() },
    { key: 'ogTitle', value: baseTitle },
    { key: 'ogDescription', value: `Learn more about ${baseTitle}.` },
    { key: 'canonical', value: form.pages_locales.slug ? `/${form.pages_locales.slug}` : '' },
    { key: 'robots', value: 'index,follow' },
  ]
})

const ensureSeoDefaults = () => {
  const map = new Map(seoEntries.value.map((entry) => [entry.key, entry]))
  for (const entry of defaultSeoEntries.value) {
    if (!map.has(entry.key)) {
      seoEntries.value.push({ ...entry })
      continue
    }
    const current = map.get(entry.key)
    if (current && !current.value.trim()) current.value = entry.value
  }
}

watch(
  () => data.value,
  (value) => {
    if (!value) return
    Object.assign(form, structuredClone(value))
    // Parse JSON strings from D1 raw query results
    if (typeof form.pages_locales.builder === 'string') {
      try {
        const parsed = JSON.parse(form.pages_locales.builder)
        if (typeof parsed === 'object' && parsed !== null) {
          form.pages_locales.builder = parsed
        } else {
          form.pages_locales.builder = structuredClone(defaultPageBuilder)
        }
      } catch {
        form.pages_locales.builder = structuredClone(defaultPageBuilder)
      }
    }
    if (!form.pages_locales.builder) form.pages_locales.builder = structuredClone(defaultPageBuilder)
    if (!form.pages_locales.builder.blocks) form.pages_locales.builder.blocks = []
    seoEntries.value = Object.entries(
      typeof form.pages_locales.seo === 'string'
        ? JSON.parse(form.pages_locales.seo)
        : (form.pages_locales.seo ?? {})
    ).map(([key, value]) => ({ key, value: String(value ?? '') }))
    ensureSeoDefaults()
  },
  { immediate: true }
)

watch(() => [form.pages_locales.title, form.pages_locales.slug], ensureSeoDefaults)

const availableSections = computed(() => sectionsData.value?.sections ?? [])

const getBuilder = () => {
  let b = form.pages_locales.builder
  if (typeof b === 'string') {
    try {
      const parsed = JSON.parse(b)
      if (typeof parsed === 'object' && parsed !== null) {
        b = parsed
      } else {
        b = structuredClone(defaultPageBuilder)
      }
    } catch {
      b = structuredClone(defaultPageBuilder)
    }
    form.pages_locales.builder = b
  }
  if (!b || typeof b === 'string') {
    b = structuredClone(defaultPageBuilder)
    form.pages_locales.builder = b
  }
  if (!b.blocks) b.blocks = []
  return b
}

const createUid = () => (globalThis.crypto?.randomUUID?.() ?? `block-${Date.now()}-${Math.random().toString(16).slice(2)}`)

const addSectionBlock = (id: string) => {
  const section = availableSections.value.find((item) => item.id === id)
  console.log(section);
  if (!section) return
  const builder = getBuilder()
  const block: PageBlock = {
    uid: createUid(),
    type: section.type,
    sectionId: section.id,
    source: 'sections',
  }
  builder.blocks.push(block)
}
const updatePageSections = (list: any) => {
  const builder = getBuilder()
  builder.blocks = list;
}

const addTextBlock = () => {
  const builder = getBuilder()
  builder.blocks.push({ uid: createUid(), type: 'text', content: '<p>New content</p>' })
}

const updateSeoEntry = (list: any) => {
  seoEntries.value = list
}

const toSeoJson = () => {
  const json: Record<string, string> = {}
  for (const entry of seoEntries.value) {
    const key = entry.key.trim()
    if (!key) continue
    json[key] = entry.value
  }
  return json
}

const savePage = async () => {
  saving.value = true
  await loadingStore.withActionLoading(async () => {
    try {
      await $fetch(`/api/pages/${pageId.value}`, {
        method: 'PUT',
        body: {
          title: form.pages_locales.title,
          slug: form.pages_locales.slug,
          status: form.pages.status,
          seo: toSeoJson(),
          builder: form.pages_locales.builder,
          locale: form.pages_locales.locale
        },
      })
      toastStore.push($t('admin.pages.saveSuccess'), 'success')
      await refresh()
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : $t('admin.pages.saveFailed'), 'error')
    } finally {
      saving.value = false
    }
  })
}

const deletePage = async () => {
  deleting.value = true
  await loadingStore.withActionLoading(async () => {
    try {
      await $fetch(`/api/pages/${pageId.value}?locale=${form.pages_locales.locale}`, { method: 'DELETE' })
      toastStore.push($t('admin.pages.deleteSuccess'), 'success')
      await navigateTo(localePath('/admin/pages', pageLocale.value))
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : $t('admin.pages.deleteFailed'), 'error')
    } finally {
      deleting.value = false
    }
  })
}
</script>

<template>
  <AdminPage :title="`${$t('admin.pages.editTitle')} (${form.pages_locales.locale})`"
    :subtitle="$t('admin.pages.addSectionHint')">
    <template #header>
      <div class="space-x-2">
        <button class="btn btn-outline" :class="{ 'btn-disabled': deleting }" @click="deletePage">{{ $t('common.delete')
          }}</button>
        <button class="btn btn-primary" :class="{ 'btn-disabled': saving }" @click="savePage">{{ $t('common.save')
          }}</button>
      </div>
    </template>
    <AdminCard>
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiText :label="$t('common.title')" v-model="form.pages_locales.title" />
        <AdminUiText :label="$t('common.slug')" v-model="form.pages_locales.slug" />
        <AdminUiSelect :label="$t('common.status')" v-model="form.pages.status" :options="[
          { key: $t('common.draft'), value: 'draft' },
          { key: $t('common.published'), value: 'published' }
        ]" />
      </div>

      <AdminListCreator @update="updateSeoEntry" :list="seoEntries" :title="$t('common.seoMeta')"
        :button-text="$t('common.addSeoField')" />
    </AdminCard>
    <AdminCard :title="$t('admin.pages.builder')">
      <AdminSectionSelector :list="availableSections" @update="addSectionBlock" />
      <button class="btn btn-sm" @click="addTextBlock">{{ $t('common.addTextBlock') }}</button>
      <AdminPageSectionList :list="availableSections" @update="updatePageSections"
        :selected="form.pages_locales.builder?.blocks ?? []" />
    </AdminCard>
  </AdminPage>
</template>
