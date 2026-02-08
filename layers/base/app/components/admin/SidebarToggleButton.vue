<script setup lang="ts">
defineProps<{ isCollapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
const { t } = useI18n()
</script>

<template>
  <button
    class="btn btn-ghost btn-square btn-sm border border-base-300"
    type="button"
    :aria-label="isCollapsed ? t('admin.sidebarToggle.expand') : t('admin.sidebarToggle.collapse')"
    @click="emit('toggle')"
  >
    <i class="fa-solid fa-bars" aria-hidden="true" />
  </button>
</template>
