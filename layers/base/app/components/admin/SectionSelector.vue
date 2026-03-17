<script setup lang="ts">
const props = defineProps<{
  list: { id: string, label: String, type: String }[]
}>()
const emit = defineEmits(['update'])

const myList = ref(props.list)
const selectedSectionId = ref<string>('')

</script>
<template>
  <label class="form-control">
    <span class="label-text">{{ $t('common.selectSection') }}</span>
    <select v-model="selectedSectionId" class="select select-bordered w-full">
      <option value="">{{ $t('common.selectSection') }}</option>
      <option v-for="section in myList" :key="section.id" :value="section.id">
        {{ section.label }}
        <span v-if="section.type !== 'section'">({{ section.type }})</span>
      </option>
    </select>
  </label>
  <button class="btn btn-sm" :disabled="!selectedSectionId" @click="emit('update',selectedSectionId)">
    {{ $t('common.addSection') }}
  </button>
</template>