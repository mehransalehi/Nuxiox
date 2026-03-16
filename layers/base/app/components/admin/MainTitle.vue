<script setup lang="ts">
const { title, subtitle } = defineProps({
    title: String,
    subtitle: String
})
</script>
<template>
    <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-bold">{{ title }}</h2>
            <p class="opacity-70 mt-2">{{ subtitle }}</p>
        </div>
        <slot/>
    </div>
</template>