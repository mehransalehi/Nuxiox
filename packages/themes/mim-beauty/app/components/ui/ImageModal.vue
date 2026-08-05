<script setup lang="ts">
defineProps<{
  imageUrl: string | null
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="imageUrl"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 p-4 cursor-pointer"
      @click="emit('close')"
    >
      <div class="relative max-w-3xl w-full" @click.stop>
        <button
          @click="emit('close')"
          class="absolute -top-10 right-0 text-white text-2xl hover:text-[#C5A059] transition-colors"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <img :src="imageUrl" alt="Mim Beauty Gallery" class="w-full h-auto rounded-2xl border border-white/20 shadow-2xl" />
      </div>
    </div>
  </Teleport>
</template>
