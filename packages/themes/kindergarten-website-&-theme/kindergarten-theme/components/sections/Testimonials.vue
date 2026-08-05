<script setup>
import { ref, onMounted } from 'vue'

const testimonials = ref([])
const isLoading = ref(true)

async function fetchTestimonials() {
  try {
    const res = await fetch('/api/testimonials/public')
    if (res.ok) {
      testimonials.value = await res.json()
    } else {
      testimonials.value = []
    }
  } catch (e) {
    testimonials.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTestimonials()
})
</script>

<template>
  <section id="testimonials" class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div class="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          {{ $t('testimonials.title') }}
        </div>
        <p class="text-slate-600 text-base sm:text-lg">
          {{ $t('testimonials.subtitle') }}
        </p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="h-48 bg-slate-200/60 rounded-3xl animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="item in testimonials" 
          :key="item.id"
          class="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between space-y-4"
        >
          <div class="space-y-3">
            <div class="flex text-amber-400 text-lg">
              ★★★★★
            </div>
            <p class="text-slate-700 text-sm italic leading-relaxed">
              "{{ item.content }}"
            </p>
          </div>

          <div class="flex items-center space-x-3 gap-3 pt-4 border-t border-amber-100/80">
            <div class="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-800 text-sm">
              {{ item.name.charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-slate-800 text-sm">{{ item.name }}</p>
              <p class="text-xs text-slate-500">Kindergarten Parent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
