<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'
import { Sparkles, Shield, Heart, Gamepad2, Award, ArrowRight, Check } from 'lucide-vue-next'

const modalStore = useModalStore()
const aboutData = ref<any>(null)

async function fetchData() {
  try {
    const res = await fetch('/api/settings/public')
    if (res.ok) {
      aboutData.value = await res.json()
    }
  } catch (e) {
    // Graceful fallback handled by default template keys
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <section id="about" class="py-16 lg:py-24 bg-white relative overflow-hidden">
    <!-- Decorative Floating Shapes -->
    <div class="absolute top-1/3 right-4 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    <div class="absolute bottom-10 left-4 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <!-- Left Column: Layered Images with 38k+ Smiles Badge -->
        <div class="lg:col-span-5 relative flex justify-center">
          <div class="relative w-full max-w-md">
            
            <!-- Curved Colorful Background Frame -->
            <div class="absolute -inset-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400 rounded-[2.5rem] transform rotate-2 opacity-85"></div>

            <!-- Foreground Card -->
            <div class="relative bg-white p-3 sm:p-4 rounded-[2.3rem] shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                alt="Pediatric dentist showing cute dental model to cheerful boy"
                class="w-full h-80 sm:h-96 object-cover rounded-[1.8rem]"
                loading="lazy" data-nuxiox-img="pediatric_dentist_showing_cute_dental_model_to_cheerful_boy">

              <!-- Mini overlay badge -->
              <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-black text-indigo-950">
                <Sparkles class="w-3.5 h-3.5 text-amber-500" />
                <span>Child-Friendly certified</span>
              </div>
            </div>

            <!-- Floating 38k+ Happy Smiles Circular Badge (matching reference design!) -->
            <div class="absolute -bottom-6 -right-4 sm:-right-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-500 text-white flex flex-col items-center justify-center p-2 shadow-2xl border-4 border-white animate-float">
              <span data-i18n="about.happySmilesCount" class="text-xl sm:text-2xl font-black tracking-tight leading-none">{{ $t('about.happySmilesCount') }}</span>
              <span data-i18n="about.happySmilesLabel" class="text-[10px] sm:text-xs font-bold text-emerald-100 text-center leading-tight mt-1">{{ $t('about.happySmilesLabel') }}</span>
              <span class="text-xs mt-0.5">🌟</span>
            </div>

            <!-- Floating Cute Doodle Stickers -->
            <div class="absolute -top-6 -left-4 w-12 h-12 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold text-xl shadow-lg transform -rotate-12">
              💡
            </div>
          </div>
        </div>

        <!-- Right Column: Content, 4 Feature Badges & Action -->
        <div class="lg:col-span-7 space-y-6 text-start">
          
          <!-- Section Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">
            <Heart class="w-3.5 h-3.5 text-indigo-600 fill-indigo-200" />
            <span data-i18n="about.badge">{{ $t('about.badge') }}</span>
          </div>

          <!-- Section Title -->
          <h2 data-i18n="about.title" class="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-950 tracking-tight leading-tight">
            {{ $t('about.title') }}
          </h2>

          <!-- Description -->
          <p data-i18n="about.description" class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {{ $t('about.description') }}
          </p>

          <!-- 4 Colorful Feature Badges (Grid of 2x2 matching image) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            <!-- Feature 1: Gentle Checkups -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 hover:bg-purple-100/60 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles class="w-5 h-5" />
              </div>
              <span data-i18n="about.feature1" class="text-sm font-bold text-indigo-950">{{ $t('about.feature1') }}</span>
            </div>

            <!-- Feature 2: Cavity Shield -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 hover:bg-emerald-100/60 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Shield class="w-5 h-5" />
              </div>
              <span data-i18n="about.feature2" class="text-sm font-bold text-indigo-950">{{ $t('about.feature2') }}</span>
            </div>

            <!-- Feature 3: Play & Gaming Lounge -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-100 hover:bg-amber-100/60 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Gamepad2 class="w-5 h-5" />
              </div>
              <span data-i18n="about.feature3" class="text-sm font-bold text-indigo-950">{{ $t('about.feature3') }}</span>
            </div>

            <!-- Feature 4: Ultra-Safe Environment -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 hover:bg-rose-100/60 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award class="w-5 h-5" />
              </div>
              <span data-i18n="about.feature4" class="text-sm font-bold text-indigo-950">{{ $t('about.feature4') }}</span>
            </div>

          </div>

          <!-- Explore More CTA -->
          <div class="pt-4">
            <button
              type="button"
              @click="modalStore.openBooking()"
              class="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span data-i18n="about.exploreBtn">{{ $t('about.exploreBtn') }}</span>
              <ArrowRight class="w-4 h-4 arrow-dir" />
            </button>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
