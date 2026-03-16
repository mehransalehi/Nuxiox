<script setup lang="ts">
const { label, } = defineProps({
    label: String,
    placeholder : String
})
const model = defineModel()
</script>
<template>
    <label class="form-control">
        <span class="flabel-text">{{ label }}</span>
        <input type="text" class="input input-bordered w-full" v-model="model" :placeholder="placeholder"/>
    </label>
</template>