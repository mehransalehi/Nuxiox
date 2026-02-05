<script setup lang="ts">
defineProps<{ isDark: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100"
    type="button"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="emit('toggle')"
  >
    <i :class="isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'" aria-hidden="true" />
  </button>
</template>
