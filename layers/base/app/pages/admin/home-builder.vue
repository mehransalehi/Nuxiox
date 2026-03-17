<script setup lang="ts">
import type { HomeBuilder, HomeSectionItem } from '~~/layers/base/types/page-builder'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.sidebar.homeBuilder') }))

type SectionOption = {
  id: string
  label: string
  type: 'section' | 'navbar' | 'footer'
}

const { data: sectionsData } = await useFetch<{ sections: SectionOption[] }>('/api/sections', {
  default: () => ({ sections: [] }),
})
const { data, refresh } = await useFetch<HomeBuilder>('/api/home-builder', {
  default: () => structuredClone(defaultHomeBuilder),
})

const selected = ref<HomeSectionItem[]>(structuredClone(defaultHomeBuilder.sections))
const dragging = ref<number | null>(null)
const saving = ref(false)
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

watch(
  () => data.value,
  (value) => {
    if (value?.sections) selected.value = structuredClone(value.sections)
  },
  { immediate: true }
)

const availableSections = computed(() => sectionsData.value?.sections ?? [])
const sectionLabels = computed(
  () => new Map(availableSections.value.map((section) => [section.id, section.label]))
)

const createUid = () =>
  (globalThis.crypto?.randomUUID?.() ?? `section-${Date.now()}-${Math.random().toString(16).slice(2)}`)

const addSection = (id: string) => {
  const section = availableSections.value.find((item) => item.id === id)
  if (!section) return
  selected.value.push({
    uid: createUid(),
    sectionId: section.id,
    type: section.type,
    source: 'sections',
  })
}
const updateHomeSections = (list: HomeSectionItem[]) => {
  selected.value = list;
}

const removeSection = (index: number) => {
  selected.value.splice(index, 1)
}

const handleDragStart = (index: number) => {
  dragging.value = index
}

const handleDrop = (index: number) => {
  if (dragging.value === null) return
  const fromIndex = dragging.value
  if (fromIndex !== index) {
    const [moved] = selected.value.splice(fromIndex, 1)
    if (moved) selected.value.splice(index, 0, moved)
  }
  dragging.value = null
}

const saveBuilder = async () => {
  saving.value = true
  await loadingStore.withActionLoading(async () => {
    try {
      await $fetch('/api/home-builder', {
        method: 'PUT',
        body: { version: 1, sections: selected.value },
      })
      toastStore.push($t('admin.homeBuilder.saved'), 'success')
      await refresh()
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : $t('admin.homeBuilder.failed'), 'error')
    } finally {
      saving.value = false
    }
  })
}
</script>

<template>
  <AdminPage :title="$t('admin.settings.title')" :subtitle="$t('admin.homeBuilder.description')">
    <template #header>
      <button class="btn btn-primary" :class="{ 'btn-disabled': saving }" @click="saveBuilder">
        <span v-if="saving" class="loading loading-spinner"></span>
        {{ $t('common.save') }}
      </button>
    </template>
    <div class="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <AdminCard :title="$t('admin.homeBuilder.available')">
        <AdminSectionSelector :list="availableSections" @update="addSection" />
      </AdminCard>
      <AdminCard :title="$t('admin.homeBuilder.selected')" :subtitle="$t('admin.homeBuilder.description')">
        <AdminSectionList :list="availableSections" @update="updateHomeSections" :selected="selected" />
      </AdminCard>
    </div>
  </AdminPage>
</template>
