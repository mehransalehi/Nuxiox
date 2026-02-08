<script setup lang="ts">
import { useToastStore, type ToastType } from '~~/layers/base/app/stores/toast'

const toastStore = useToastStore()

const typeClassMap: Record<ToastType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
}
</script>

<template>
  <div class="toast toast-top toast-end z-50">
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :class="['alert shadow-lg', typeClassMap[toast.type]]"
    >
      <span>{{ toast.message }}</span>
      <button class="btn btn-ghost btn-xs" type="button" @click="toastStore.remove(toast.id)">
        ✕
      </button>
    </div>
  </div>
</template>
