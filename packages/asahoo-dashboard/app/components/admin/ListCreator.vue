<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  list: { type: Array as PropType<{ key: string, value: string }[]>, required: true },
  title: { type: String, default: '' },
  buttonText: { type: String, default: '' },
})
const emit = defineEmits(['update'])

// Local copy — mutate freely
const myList = ref([...props.list])

// Sync from parent when prop changes (new reference from outside)
watch(() => props.list, (newVal) => {
  if (!newVal || typeof newVal[Symbol.iterator] !== 'function') return
  myList.value = [...newVal]
}, { deep: true })

function emitUpdate() {
  emit('update', myList.value)
}

const addToList = () => {
  myList.value.push({ key: '', value: '' })
  emitUpdate()
}

const removeFromList = (index: number) => {
  myList.value.splice(index, 1)
  emitUpdate()
}
</script>
<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold">{{ title || $t('common.infoList') }}</h4>
      <button class="btn btn-sm" @click="addToList">{{ buttonText || $t('common.addInfo') }}</button>
    </div>
    <div v-for="(item, index) in myList" :key="`${index}`" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
      <input v-model="item.key" class="input input-bordered" type="text" :placeholder="$t('common.label') as any" @input="emitUpdate" />
      <input v-model="item.value" class="input input-bordered" type="text"
        :placeholder="$t('common.pathPlaceholder') as any" @input="emitUpdate" />
      <button class="btn btn-ghost btn-square" @click="removeFromList(index)">✕</button>
    </div>
  </div>
</template>