<script setup>
import { ref, onMounted } from 'vue'

const services = ref([])
const isLoading = ref(true)

async function fetchServices() {
  try {
    const res = await fetch('/api/services/public')
    if (res.ok) {
      services.value = await res.json()
    } else {
      services.value = []
    }
  } catch (e) {
    services.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<template>
  <section id="services" class="py-16 md:py-24 bg-amber-50/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div class="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
          {{ $t('services.title') }}
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
          {{ $t('services.subtitle') }}
        </h2>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="h-64 bg-slate-200/60 rounded-3xl animate-pulse"></div>
      </div>

      <!-- Services Grid -->
      <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="item in services" 
          :key="item.id"
          class="card-playful bg-white p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between"
        >
          <div class="space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-100 text-3xl flex items-center justify-center">
              {{ item.icon || '🎨' }}
            </div>
            <h3 class="text-xl font-bold font-heading text-slate-800">
              {{ item.title }}
            </h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
            <span>{{ $t('services.viewDetails') }}</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <!-- Fallback Grid if API returns empty -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="card-playful bg-white p-6 border border-amber-100 shadow-sm">
          <div class="w-14 h-14 rounded-2xl bg-rose-100 text-3xl flex items-center justify-center mb-4">🌱</div>
          <h3 class="text-xl font-bold font-heading text-slate-800 mb-2">Toddler Discovery (1.5 - 3 yrs)</h3>
          <p class="text-slate-600 text-sm">Sensory exploration, language building, and gentle social interactions in small groups.</p>
        </div>
        <div class="card-playful bg-white p-6 border border-amber-100 shadow-sm">
          <div class="w-14 h-14 rounded-2xl bg-teal-100 text-3xl flex items-center justify-center mb-4">🎨</div>
          <h3 class="text-xl font-bold font-heading text-slate-800 mb-2">Early Arts & Expression (3 - 4 yrs)</h3>
          <p class="text-slate-600 text-sm">Paint, clay, storytelling, and rhythm classes designed to unleash boundless imagination.</p>
        </div>
        <div class="card-playful bg-white p-6 border border-amber-100 shadow-sm">
          <div class="w-14 h-14 rounded-2xl bg-yellow-100 text-3xl flex items-center justify-center mb-4">🧩</div>
          <h3 class="text-xl font-bold font-heading text-slate-800 mb-2">Kindergarten Readiness (4 - 6 yrs)</h3>
          <p class="text-slate-600 text-sm">Foundational phonics, early math concepts, science experiments, and collaborative projects.</p>
        </div>
      </div>
    </div>
  </section>
</template>
