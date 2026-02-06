<script setup lang="ts">
defineProps<{ isCollapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    class="btn btn-ghost btn-square btn-sm border border-base-300"
    type="button"
    :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    @click="emit('toggle')"
  >
    <i class="fa-solid fa-bars" aria-hidden="true" />
  </button>
</template>
