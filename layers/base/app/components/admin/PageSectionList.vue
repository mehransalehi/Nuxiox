<script setup lang="ts">
import type { HomeBuilder, HomeSectionItem } from '~~/layers/base/types/page-builder'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'

const props = defineProps<{
  list: { id: string, label: String, type: String }[]
  selected: any[]
}>()
const emit = defineEmits(['update'])


const dragging = ref<number | null>(null)
const sectionLabels = computed(
  () => new Map(props.list.map(section => [section.id, section.label]))
)


const removeBlock = (index: number) => {
  const updated = [...props.selected]
  updated.splice(index, 1)
  emit('update', updated)
}

const handleDragStart = (index: number) => {
  dragging.value = index
}

const handleDrop = (index: number) => {
  if (dragging.value === null) return

  const updated = [...props.selected]
  const [moved] = updated.splice(dragging.value, 1)

  if (moved) updated.splice(index, 0, moved)

  emit('update', updated)
  dragging.value = null
}

</script>
<template>
  <div class="space-y-2">
    <!-- <div v-for="(section, index) in selected" :key="section.uid"
      class="flex items-center gap-0 rounded-lg border border-base-300 bg-base-100 p-3" draggable="true"
      @dragstart="handleDragStart(index)" @dragover.prevent @drop="handleDrop(index)">
      <button class="btn btn-ghost btn-square cursor-grab me-2" type="button">
        <i class="fa-solid fa-grip-vertical" aria-hidden="true" />
      </button>
      <div class="flex-1">
        <p class="font-medium">{{ sectionLabels.get(section.sectionId) ?? section.sectionId }}</p>
        <p class="text-xs uppercase opacity-60">{{ section.type }}</p>
      </div>
      <button class="btn btn-ghost btn-square" @click="removeSection(index)">✕</button>
    </div> -->

    <div v-for="(block, index) in selected" :key="block.uid"
      class="rounded-lg border border-base-300 bg-base-100 p-4" draggable="true" @dragstart="handleDragStart(index)"
      @dragover.prevent @drop="handleDrop(index)">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-sm uppercase opacity-60"><i class="fa-solid fa-grip-vertical"
            aria-hidden="true" /><span>{{ block.type }}</span></div><button class="btn btn-ghost btn-square"
          @click="removeBlock(index)">✕</button>
      </div>
      <div v-if="block.type === 'text'" class="mt-3">
        <AdminQuillEditor v-model="block.content" />
      </div>
      <div v-else class="mt-3 text-sm">{{ sectionLabels.get(block.sectionId) ?? block.sectionId }}</div>
    </div>
  </div>
</template>