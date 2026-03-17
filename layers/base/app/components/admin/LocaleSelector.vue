<script setup lang="ts">
const { locales } = useI18n()

defineProps<{
  label: string
}>()

const model = defineModel<string>()
</script>

<template>
  <AdminUiSelect
    :label="label"
    v-model="model"
    :options="locales.map(cur => ({
      key: cur.name as string,
      value: cur.code
    }))"
  />
</template>