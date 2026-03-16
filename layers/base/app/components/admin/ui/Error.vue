<script setup lang="ts">

const { message } = defineProps({
    message: String,
})
</script>
<template>
    <div class="alert alert-error">{{ message }}</div>
</template>