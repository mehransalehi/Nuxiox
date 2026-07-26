<script setup lang="ts">
const { label, } = defineProps({
    label: String,
    placeholder : String
})
const model = defineModel()
</script>
<template>
    <label class="form-control">
        <span class="label-text">{{ label }}</span>
        <input type="number" class="input input-bordered w-full" v-model="model" :placeholder="placeholder"/>
    </label>
</template>