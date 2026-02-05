<script setup lang="ts">
defineProps<{ isCollapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100"
    type="button"
    :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    @click="emit('toggle')"
  >
    <i class="fa-solid fa-bars" aria-hidden="true" />
  </button>
</template>
