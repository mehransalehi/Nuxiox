<script setup lang="ts">
defineProps<{ isDark: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    class="btn btn-ghost btn-square btn-sm border border-base-300"
    type="button"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="emit('toggle')"
  >
    <i :class="isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'" aria-hidden="true" />
  </button>
</template>
