<script setup lang="ts">

const { title } = defineProps({
    title: String,
})
</script>
<template>
    <div class="flex items-center gap-2">
      <span class="loading loading-spinner"></span>
      <span>{{ title }}</span>
    </div>
</template>