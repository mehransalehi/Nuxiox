<script setup>
const props = defineProps({
  imageUrl: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<template>
  <div 
    v-if="imageUrl" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
    @click.self="handleClose"
  >
    <div class="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
      <!-- Close Button -->
      <button 
        @click="handleClose"
        class="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center font-bold text-lg"
      >
        ✕
      </button>

      <!-- Lightbox Image -->
      <img 
        :src="imageUrl" 
        alt="Enlarged view" 
        class="max-w-full max-h-[80vh] rounded-3xl object-contain shadow-2xl border-4 border-white/20"
      />
    </div>
  </div>
</template>
