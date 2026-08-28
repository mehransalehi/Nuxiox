<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'
import { Star, Quote, CheckCircle2, ArrowRight, Sparkles } from 'lucide-vue-next'

const modalStore = useModalStore()
const apiTestimonials = ref<any[]>([])

async function fetchTestimonials() {
  try {
    const res = await fetch('/api/testimonials/public')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        apiTestimonials.value = data
      }
    }
  } catch (e) {
    // Fallback to static translated cards
  }
}

onMounted(() => {
  fetchTestimonials()
})
</script>

<template>
  <section id="testimonials" class="py-16 lg:py-24 bg-amber-50/50 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Two Side-by-Side Highlight Cards (Exact pattern from reference image) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        <!-- Left Highlight Card: Parent Testimonial with Thumbs-up Kid Image -->
        <div class="lg:col-span-6 bg-gradient-to-br from-purple-100/90 via-white to-purple-50 p-6 sm:p-8 rounded-[2.5rem] border-2 border-purple-200/80 shadow-lg flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div class="space-y-4 flex-1 text-start">
            <div class="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <Quote class="w-5 h-5" />
            </div>

            <p data-i18n="testimonials.quote1" class="text-sm sm:text-base font-semibold text-indigo-950 leading-relaxed italic">
              "{{ $t('testimonials.quote1') }}"
            </p>

            <div class="flex items-center gap-1 text-amber-400">
              <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 stroke-amber-500" />
            </div>

            <div>
              <div data-i18n="testimonials.author1" class="text-sm font-extrabold text-indigo-950">{{ $t('testimonials.author1') }}</div>
              <div data-i18n="testimonials.role1" class="text-xs font-bold text-purple-700">{{ $t('testimonials.role1') }}</div>
            </div>
          </div>

          <!-- Kid Image with Thumbs Up -->
          <div class="w-36 h-48 sm:w-44 sm:h-56 shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-white">
            <img
              src="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=500&q=80"
              alt="Happy smiling child with thumbs up"
              class="w-full h-full object-cover"
              loading="lazy" data-nuxiox-img="happy_smiling_child_with_thumbs_up">
          </div>
        </div>

        <!-- Right Highlight Card: Take a Clinic Tour with Photo & CTA (from reference image) -->
        <div class="lg:col-span-6 bg-gradient-to-br from-amber-100/90 via-white to-amber-50 p-6 sm:p-8 rounded-[2.5rem] border-2 border-amber-200/80 shadow-lg flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div class="space-y-4 flex-1 text-start">
            <h3 data-i18n="tour.title" class="text-2xl font-black text-indigo-950 tracking-tight">
              {{ $t('tour.title') }}
            </h3>

            <p data-i18n="tour.subtitle" class="text-xs sm:text-sm text-slate-600 font-medium">
              {{ $t('tour.subtitle') }}
            </p>

            <ul class="space-y-2 text-xs font-bold text-slate-700">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                <span data-i18n="tour.feature1">{{ $t('tour.feature1') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                <span data-i18n="tour.feature2">{{ $t('tour.feature2') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                <span data-i18n="tour.feature3">{{ $t('tour.feature3') }}</span>
              </li>
            </ul>

            <div class="pt-2">
              <button
                type="button"
                @click="modalStore.openBooking()"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span data-i18n="tour.bookTourBtn">{{ $t('tour.bookTourBtn') }}</span>
                <ArrowRight class="w-4 h-4 arrow-dir" />
              </button>
            </div>
          </div>

          <!-- Clinic Tour Image -->
          <div class="w-36 h-48 sm:w-44 sm:h-56 shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-white">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&q=80"
              alt="Playful pediatric dental room"
              class="w-full h-full object-cover"
              loading="lazy" data-nuxiox-img="playful_pediatric_dental_room">
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
