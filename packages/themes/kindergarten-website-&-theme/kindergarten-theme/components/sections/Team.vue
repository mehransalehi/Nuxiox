<script setup>
import { ref, onMounted } from 'vue'

const colleagues = ref([])
const isLoading = ref(true)

async function fetchColleagues() {
  try {
    const res = await fetch('/api/colleagues/public')
    if (res.ok) {
      colleagues.value = await res.json()
    } else {
      colleagues.value = []
    }
  } catch (e) {
    colleagues.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchColleagues()
})
</script>

<template>
  <section id="team" class="py-16 md:py-24 bg-teal-50/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div class="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
          {{ $t('team.title') }}
        </div>
        <p class="text-slate-600 text-base sm:text-lg">
          {{ $t('team.subtitle') }}
        </p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="n in 4" :key="n" class="h-80 bg-slate-200/60 rounded-3xl animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="person in colleagues" 
          :key="person.id"
          class="bg-white rounded-3xl overflow-hidden border border-teal-100 shadow-sm text-center p-6 space-y-4 hover:shadow-md transition-shadow"
        >
          <div class="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-amber-200 shadow-inner">
            <img 
              :src="person.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'" 
              :alt="person.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 class="font-bold text-lg font-heading text-slate-800">{{ person.name }}</h3>
            <p class="text-xs font-semibold text-teal-600 uppercase tracking-wide mt-1">{{ person.role }}</p>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed line-clamp-3" v-if="person.bio">
            {{ person.bio }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
