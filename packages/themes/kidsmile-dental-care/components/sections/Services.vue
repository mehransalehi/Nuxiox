<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'
import { ArrowRight, Sparkles, Shield, Heart, Smile, Check } from 'lucide-vue-next'

const modalStore = useModalStore()
const apiServices = ref<any[]>([])

async function fetchServices() {
  try {
    const res = await fetch('/api/services/public')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        apiServices.value = data
      }
    }
  } catch (e) {
    // Graceful fallback to static translated items
  }
}

onMounted(() => {
  fetchServices()
})

const defaultPrograms = [
  {
    id: 1,
    titleKey: 'services.service1Title',
    ageKey: 'services.service1Age',
    descKey: 'services.service1Desc',
    bgClass: 'bg-amber-50/80 border-amber-200/80 hover:bg-amber-100/60',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    iconBg: 'bg-amber-400 text-amber-950',
    iconEmoji: '🍼',
    accentColor: 'text-amber-600'
  },
  {
    id: 2,
    titleKey: 'services.service2Title',
    ageKey: 'services.service2Age',
    descKey: 'services.service2Desc',
    bgClass: 'bg-rose-50/80 border-rose-200/80 hover:bg-rose-100/60',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    iconBg: 'bg-rose-400 text-white',
    iconEmoji: '🛡️',
    accentColor: 'text-rose-600'
  },
  {
    id: 3,
    titleKey: 'services.service3Title',
    ageKey: 'services.service3Age',
    descKey: 'services.service3Desc',
    bgClass: 'bg-sky-50/80 border-sky-200/80 hover:bg-sky-100/60',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    iconBg: 'bg-sky-400 text-white',
    iconEmoji: '✨',
    accentColor: 'text-sky-600'
  },
  {
    id: 4,
    titleKey: 'services.service4Title',
    ageKey: 'services.service4Age',
    descKey: 'services.service4Desc',
    bgClass: 'bg-purple-50/80 border-purple-200/80 hover:bg-purple-100/60',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    iconBg: 'bg-purple-400 text-white',
    iconEmoji: '🌈',
    accentColor: 'text-purple-600'
  }
]
</script>

<template>
  <section id="services" class="py-16 lg:py-24 bg-slate-50/70 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Heading with Playful Doodles -->
      <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
          <span>{{ $t('services.badge') }}</span>
        </div>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-950 tracking-tight">
          {{ $t('services.title') }}
        </h2>
        
        <p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {{ $t('services.subtitle') }}
        </p>
      </div>

      <!-- 4 Pastel Cards Grid (Matching reference image layout & colors) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="program in defaultPrograms"
          :key="program.id"
          class="flex flex-col justify-between p-6 sm:p-7 rounded-[2rem] border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative group overflow-hidden"
          :class="program.bgClass"
        >
          <!-- Top Icon & Age Badge -->
          <div>
            <div class="flex items-center justify-between gap-2 mb-5">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform"
                :class="program.iconBg"
              >
                <span>{{ program.iconEmoji }}</span>
              </div>
              <span
                class="px-3 py-1 rounded-full text-xs font-black border tracking-wide"
                :class="program.badgeClass"
              >
                {{ $t(program.ageKey) }}
              </span>
            </div>

            <!-- Card Title -->
            <h3 class="text-xl font-extrabold text-indigo-950 mb-3 tracking-tight">
              {{ $t(program.titleKey) }}
            </h3>

            <!-- Card Description -->
            <p class="text-sm text-slate-600 leading-relaxed font-medium">
              {{ $t(program.descKey) }}
            </p>
          </div>

          <!-- Bottom Action Link -->
          <div class="pt-6 mt-4 border-t border-slate-200/60">
            <button
              type="button"
              @click="modalStore.openBooking()"
              class="inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3 cursor-pointer"
              :class="program.accentColor"
            >
              <span>{{ $t('services.learnMore') }}</span>
              <ArrowRight class="w-4 h-4 arrow-dir" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
