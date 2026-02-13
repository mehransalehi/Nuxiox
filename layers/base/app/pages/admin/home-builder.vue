<script setup lang="ts">
import type { HomeBuilder, HomeSectionItem } from '~~/layers/base/types/page-builder'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })
useHead({ title: 'Admin Home Builder' })

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
const selectedSectionId = ref<string>('')
const dragging = ref<number | null>(null)
const saving = ref(false)
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const { t } = useI18n()

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

const addSection = () => {
  const section = availableSections.value.find((item) => item.id === selectedSectionId.value)
  if (!section) return
  selected.value.push({
    uid: createUid(),
    sectionId: section.id,
    type: section.type,
    source: 'sections',
  })
  selectedSectionId.value = ''
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
    toastStore.push(t('admin.homeBuilder.saved'), 'success')
    await refresh()
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : t('admin.homeBuilder.failed'), 'error')
    } finally {
      saving.value = false
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">{{ t('admin.homeBuilder.title') }}</h2>
        <p class="opacity-70">{{ t('admin.homeBuilder.description') }}</p>
      </div>
      <button class="btn btn-primary" :class="{ 'btn-disabled': saving }" @click="saveBuilder">
        <span v-if="saving" class="loading loading-spinner"></span>
        {{ t('common.save') }}
      </button>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <section class="card bg-base-100 shadow">
        <div class="card-body space-y-4">
          <h3 class="card-title">{{ t('admin.homeBuilder.available') }}</h3>
          <label class="form-control">
            <span class="label-text">{{ t('common.selectSection') }}</span>
            <select v-model="selectedSectionId" class="select select-bordered">
              <option value="">{{ t('common.selectSection') }}</option>
              <option v-for="section in availableSections" :key="section.id" :value="section.id">
                {{ section.label }}
                <span v-if="section.type !== 'section'">({{ section.type }})</span>
              </option>
            </select>
          </label>
          <button class="btn btn-sm" :disabled="!selectedSectionId" @click="addSection">
            {{ t('common.addSection') }}
          </button>
        </div>
      </section>

      <section class="card bg-base-100 shadow">
        <div class="card-body space-y-4">
          <h3 class="card-title">{{ t('admin.homeBuilder.selected') }}</h3>
          <div v-if="selected.length === 0" class="text-sm opacity-70">
            {{ t('admin.homeBuilder.description') }}
          </div>
          <div class="space-y-2">
            <div
              v-for="(section, index) in selected"
              :key="section.uid"
              class="flex items-center gap-3 rounded-lg border border-base-300 bg-base-100 p-3"
              draggable="true"
              @dragstart="handleDragStart(index)"
              @dragover.prevent
              @drop="handleDrop(index)"
            >
              <button class="btn btn-ghost btn-square cursor-grab" type="button">
                <i class="fa-solid fa-grip-vertical" aria-hidden="true" />
              </button>
              <div class="flex-1">
                <p class="font-medium">{{ sectionLabels.get(section.sectionId) ?? section.sectionId }}</p>
                <p class="text-xs uppercase opacity-60">{{ section.type }}</p>
              </div>
              <button class="btn btn-ghost btn-square" @click="removeSection(index)">✕</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
