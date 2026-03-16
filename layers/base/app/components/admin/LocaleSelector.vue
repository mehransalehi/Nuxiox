<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const props = defineProps<{
    label: string
}>()
const model = defineModel()
model.value = locale;
</script>
<template>
    <AdminUiSelect :label="label" v-model="model" :options="locales.map(cur => ({
        key: cur.name as string,
        value: cur.code
    }))" />
</template>