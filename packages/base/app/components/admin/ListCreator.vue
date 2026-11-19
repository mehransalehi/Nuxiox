<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  list: { type: Array as PropType<{ key: string, value: string }[]>, required: true },
  title: { type: String, default: '' },
  buttonText: { type: String, default: '' },
})
const emit = defineEmits(['update'])

const addToList = () => {
  const updated = [...props.list, { key: '', value: '' }]
  emit('update', updated)
}
const removeFromList = (index: number) => {
  const updated = props.list.filter((_, i) => i !== index)
  emit('update', updated)
}

</script>
<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold">{{ props.title ? props.title : $t('common.infoList') }}</h4>
      <button class="btn btn-sm" @click="addToList">{{ props.buttonText ? props.buttonText : $t('common.addInfo')
        }}</button>
    </div>
    <div v-for="(item, index) in props.list" :key="`${index}`" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
      <input v-model="item.key" class="input input-bordered" type="text" :placeholder="$t('common.label') as any" @input="emit('update', props.list)"/>
      <input v-model="item.value" class="input input-bordered" type="text"
        :placeholder="$t('common.pathPlaceholder') as any"  @input="emit('update', props.list)"/>
      <button class="btn btn-ghost btn-square" @click="removeFromList(index)">✕</button>
    </div>
  </div>
</template>