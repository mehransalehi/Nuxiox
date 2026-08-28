<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  imageUrl: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    v-if="props.imageUrl"
    class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
    @click.self="emit('close')"
  >
    <div class="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400">
      <button
        type="button"
        @click="emit('close')"
        class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Close Preview"
      >
        <X class="w-5 h-5" />
      </button>
      <img
        :src="props.imageUrl"
        alt="Clinic Gallery View"
        class="w-full max-h-[80vh] object-cover"
      />
    </div>
  </div>
</template>
