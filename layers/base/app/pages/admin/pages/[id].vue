<script setup lang="ts">
import type { PageBuilder, PageBlock, PageRecord } from '~~/layers/base/types/page-builder'
import { defaultPageBuilder } from '~~/layers/base/utils/page-builder'
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
useHead(() => ({ title: t('admin.pages.editTitle') }))

type SectionOption = {
  id: string
  label: string
  type: 'section' | 'navbar' | 'footer'
}

type SeoEntry = { key: string; value: string }

const route = useRoute()
const pageId = computed(() => route.params.id as string)

const { data, refresh } = await useFetch<PageRecord>(`/api/pages/${pageId.value}`)
const { data: sectionsData } = await useFetch<{ sections: SectionOption[] }>('/api/sections', {
  default: () => ({ sections: [] }),
})

const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const { t } = useI18n()
const saving = ref(false)
const deleting = ref(false)
const dragging = ref<number | null>(null)
const selectedSectionId = ref<string>('')
const seoEntries = ref<SeoEntry[]>([])

const form = reactive<PageRecord>({
  id: 0,
  slug: '',
  title: '',
  status: 'draft',
  seo: {},
  builder: structuredClone(defaultPageBuilder),
  createdAt: 0,
  updatedAt: 0,
})

const defaultSeoEntries = computed<SeoEntry[]>(() => {
  const baseTitle = form.title.trim() || 'Untitled page'
  return [
    { key: 'title', value: baseTitle },
    { key: 'description', value: `Learn more about ${baseTitle}.` },
    { key: 'keywords', value: baseTitle.toLowerCase() },
    { key: 'ogTitle', value: baseTitle },
    { key: 'ogDescription', value: `Learn more about ${baseTitle}.` },
    { key: 'canonical', value: form.slug ? `/${form.slug}` : '' },
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
    if (!form.builder) form.builder = structuredClone(defaultPageBuilder)
    seoEntries.value = Object.entries(form.seo ?? {}).map(([key, value]) => ({ key, value: String(value ?? '') }))
    ensureSeoDefaults()
  },
  { immediate: true }
)

watch(() => [form.title, form.slug], ensureSeoDefaults)

const availableSections = computed(() => sectionsData.value?.sections ?? [])
const sectionLabels = computed(() => new Map(availableSections.value.map((section) => [section.id, section.label])))

const createUid = () => (globalThis.crypto?.randomUUID?.() ?? `block-${Date.now()}-${Math.random().toString(16).slice(2)}`)

const addSectionBlock = () => {
  const section = availableSections.value.find((item) => item.id === selectedSectionId.value)
  if (!section) return
  const block: PageBlock = {
    uid: createUid(),
    type: section.type,
    sectionId: section.id,
    source: 'sections',
  }
  form.builder.blocks.push(block)
  selectedSectionId.value = ''
}

const addTextBlock = () => {
  form.builder.blocks.push({ uid: createUid(), type: 'text', content: '<p>New content</p>' })
}

const addSeoEntry = () => {
  seoEntries.value.push({ key: '', value: '' })
}

const removeSeoEntry = (index: number) => {
  seoEntries.value.splice(index, 1)
}

const removeBlock = (index: number) => {
  form.builder.blocks.splice(index, 1)
}

const handleDragStart = (index: number) => {
  dragging.value = index
}

const handleDrop = (index: number) => {
  if (dragging.value === null) return
  const fromIndex = dragging.value
  if (fromIndex !== index) {
    const [moved] = form.builder.blocks.splice(fromIndex, 1)
    if (moved) form.builder.blocks.splice(index, 0, moved)
  }
  dragging.value = null
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
        body: { title: form.title, slug: form.slug, status: form.status, seo: toSeoJson(), builder: form.builder },
      })
      toastStore.push(t('admin.pages.saveSuccess'), 'success')
      await refresh()
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : t('admin.pages.saveFailed'), 'error')
    } finally {
      saving.value = false
    }
  })
}

const deletePage = async () => {
  deleting.value = true
  await loadingStore.withActionLoading(async () => {
    try {
      await $fetch(`/api/pages/${pageId.value}`, { method: 'DELETE' })
      toastStore.push(t('admin.pages.deleteSuccess'), 'success')
      await navigateTo('/admin/pages')
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : t('admin.pages.deleteFailed'), 'error')
    } finally {
      deleting.value = false
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">{{ t('admin.pages.editTitle') }}</h2>
        <p class="opacity-70">{{ t('admin.pages.addSectionHint') }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button class="btn btn-outline" :class="{ 'btn-disabled': deleting }" @click="deletePage">{{ t('common.delete') }}</button>
        <button class="btn btn-primary" :class="{ 'btn-disabled': saving }" @click="savePage">{{ t('common.save') }}</button>
      </div>
    </div>

    <section class="card bg-base-100 shadow"><div class="card-body space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="form-control"><span class="label-text">{{ t('common.title') }}</span><input v-model="form.title" class="input input-bordered" type="text" /></label>
        <label class="form-control"><span class="label-text">{{ t('common.slug') }}</span><input v-model="form.slug" class="input input-bordered" type="text" /></label>
      </div>
      <label class="form-control max-w-xs"><span class="label-text">{{ t('common.status') }}</span>
        <select v-model="form.status" class="select select-bordered"><option value="draft">{{ t('common.draft') }}</option><option value="published">{{ t('common.published') }}</option></select>
      </label>

      <div class="space-y-2">
        <div class="flex items-center justify-between"><span class="font-medium">{{ t('common.seoMeta') }}</span><button class="btn btn-sm" type="button" @click="addSeoEntry">{{ t('common.addSeoField') }}</button></div>
        <div v-for="(entry, index) in seoEntries" :key="`seo-${index}`" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input v-model="entry.key" class="input input-bordered" type="text" :placeholder="t('common.metaKey') as any" />
          <input v-model="entry.value" class="input input-bordered" type="text" :placeholder="t('common.metaValue') as any" />
          <button class="btn btn-ghost btn-square" type="button" @click="removeSeoEntry(index)">✕</button>
        </div>
      </div>
    </div></section>

    <section class="card bg-base-100 shadow"><div class="card-body space-y-4">
      <h3 class="card-title">{{ t('admin.pages.builder') }}</h3>
      <div class="flex flex-wrap items-end gap-3">
        <label class="form-control"><span class="label-text">{{ t('common.selectSection') }}</span>
          <select v-model="selectedSectionId" class="select select-bordered"><option value="">{{ t('common.selectSection') }}</option><option v-for="section in availableSections" :key="section.id" :value="section.id">{{ section.label }}</option></select>
        </label>
        <button class="btn btn-sm" :disabled="!selectedSectionId" @click="addSectionBlock">{{ t('common.addSection') }}</button>
        <button class="btn btn-sm" @click="addTextBlock">{{ t('common.addTextBlock') }}</button>
      </div>

      <div class="space-y-3">
        <div v-for="(block, index) in form.builder.blocks" :key="block.uid" class="rounded-lg border border-base-300 bg-base-100 p-4" draggable="true" @dragstart="handleDragStart(index)" @dragover.prevent @drop="handleDrop(index)">
          <div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2 text-sm uppercase opacity-60"><i class="fa-solid fa-grip-vertical" aria-hidden="true" /><span>{{ block.type }}</span></div><button class="btn btn-ghost btn-square" @click="removeBlock(index)">✕</button></div>
          <div v-if="block.type === 'text'" class="mt-3"><AdminQuillEditor v-model="block.content" /></div>
          <div v-else class="mt-3 text-sm">{{ sectionLabels.get(block.sectionId) ?? block.sectionId }}</div>
        </div>
      </div>
    </div></section>
  </div>
</template>
