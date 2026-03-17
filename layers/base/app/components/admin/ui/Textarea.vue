<script setup lang="ts">
const { label, } = defineProps({
    label: String,
    placeholder : String
})
const model = defineModel<string>()
</script>
<template>
    <label class="form-control">
        <span class="label-text">{{ label }}</span>
        <textarea type="text" class="textarea textarea-bordered w-full" v-model="model" :placeholder="placeholder" rows="2"/>
    </label>
</template>