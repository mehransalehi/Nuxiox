<script setup lang="ts">

const { title, subtitle } = defineProps({
    title: String,
    subtitle: String,
})
</script>
<template>
    <div class="space-y-6">
        <AdminMainTitle :title="title" :subtitle="subtitle">
            <slot name="header" />
        </AdminMainTitle>
        <slot/>
    </div>
</template>