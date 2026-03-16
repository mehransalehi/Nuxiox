<script setup lang="ts">
const props = defineProps<{
  label: string
  options: { key: string; value: string }[]
}>()
const model = defineModel()
</script>
<template>
    <label class="form-control">
        <span class="label-text">{{ props.label }}</span>
        <select v-model="model" class="select select-bordered w-full">
            <option v-for="(data,i) in props.options" :key="i" :value="data.value">{{ data.key }}</option>
        </select>
    </label>
</template>