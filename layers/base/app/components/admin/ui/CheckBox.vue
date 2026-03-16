<script setup lang="ts">
const { label } = defineProps({
    label: String,
})
const model = defineModel()
</script>
<template>
    <label class="flex items-center gap-4">
        <input type="checkbox" class="toggle toggle-primary" v-model="model" />
        <span class="font-medium">{{ label }}</span>
    </label>
</template>