<script setup lang="ts">
import { useModalStore } from '~~/packages/base/app/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <section id="services" class="w-full bg-[#FAF8F5] py-24 border-b border-[#E6DFC9] relative overflow-hidden">
    
    <!-- Section Title -->
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10 mb-16">
      <div class="text-center max-w-2xl mx-auto space-y-3 reveal active">
        <span data-i18n="services.eyebrow" class="font-serif italic text-2xl text-[#C5A059] tracking-widest block">{{ $t('services.eyebrow') }}</span>
        <h2 data-i18n="services.title" class="text-3xl sm:text-5xl font-extrabold text-[#222222] font-sans">{{ $t('services.title') }}</h2>
        <p data-i18n="services.subtitle" class="text-[#666666] text-sm sm:text-base font-normal">
          {{ $t('services.subtitle') }}
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10">
      <div class="relative py-8">
        
        <!-- Connecting Dotted Arch Line SVG -->
        <div class="hidden lg:block absolute inset-0 pointer-events-none z-0">
          <svg class="w-full h-full" viewBox="0 0 1200 450" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 50 225 C 150 20, 300 20, 350 225 C 400 430, 600 430, 650 225 C 700 20, 900 20, 950 225 C 1000 430, 1150 430, 1150 225"
              stroke="#C5A059"
              stroke-width="2.5"
              stroke-dasharray="6 8"
              stroke-linecap="round"
              opacity="0.45"
            />
          </svg>
        </div>

        <!-- 4 Arch Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 relative z-10 items-stretch">
          
          <!-- Card 1: Top Arch Dome -->
          <div class="flex flex-col items-center group cursor-pointer lg:translate-y-0 reveal active delay-100" @click="modalStore.openBooking()">
            <div class="w-full h-[360px] sm:h-[400px] rounded-t-[160px] rounded-b-3xl overflow-hidden relative shadow-xl border-4 border-white transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
                alt="Style & Makeup"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               data-nuxiox-img="style_makeup">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-center">
                <span data-i18n="services.s1.tag" class="font-serif italic text-xs text-amber-300 tracking-widest uppercase mb-1">{{ $t('services.s1.tag') }}</span>
                <h3 data-i18n="services.s1.title" class="text-xl font-bold font-sans tracking-tight">{{ $t('services.s1.title') }}</h3>
                <span data-i18n="services.s1.action" class="text-[11px] text-stone-300 font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {{ $t('services.s1.action') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card 2: Inverted Bottom Arch -->
          <div class="flex flex-col items-center group cursor-pointer lg:translate-y-6 reveal active delay-200" @click="modalStore.openBooking()">
            <div class="w-full h-[360px] sm:h-[400px] rounded-b-[160px] rounded-t-3xl overflow-hidden relative shadow-xl border-4 border-white transition-all duration-500 group-hover:translate-y-4 group-hover:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                alt="Hair Drying & Balayage"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               data-nuxiox-img="hair_drying_balayage">
              <div class="absolute inset-0 bg-[#3A2016]/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-white text-center group-hover:bg-[#3A2016]/45 transition-colors duration-500">
                <span data-i18n="services.s2.tag" class="font-serif italic text-xs text-amber-200 tracking-widest uppercase mb-2">{{ $t('services.s2.tag') }}</span>
                <h3 data-i18n="services.s2.title" class="text-2xl font-serif tracking-wide text-amber-100 font-normal border-b border-amber-400/30 pb-2">{{ $t('services.s2.title') }}</h3>
                <p data-i18n="services.s2.sub" class="text-xs text-stone-200 mt-2 font-light">{{ $t('services.s2.sub') }}</p>
              </div>
            </div>
          </div>

          <!-- Card 3: Top Arch Dome -->
          <div class="flex flex-col items-center group cursor-pointer lg:translate-y-0 reveal active delay-300" @click="modalStore.openBooking()">
            <div class="w-full h-[360px] sm:h-[400px] rounded-t-[160px] rounded-b-3xl overflow-hidden relative shadow-xl border-4 border-white transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                alt="Keratin & Hair Spa"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               data-nuxiox-img="keratin_hair_spa">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-center">
                <span data-i18n="services.s3.tag" class="font-serif italic text-xs text-amber-300 tracking-widest uppercase mb-1">{{ $t('services.s3.tag') }}</span>
                <h3 data-i18n="services.s3.title" class="text-xl font-bold font-sans tracking-tight">{{ $t('services.s3.title') }}</h3>
                <span data-i18n="services.s3.action" class="text-[11px] text-stone-300 font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {{ $t('services.s3.action') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card 4: Inverted Bottom Arch -->
          <div class="flex flex-col items-center group cursor-pointer lg:translate-y-6 reveal active delay-400" @click="modalStore.openBooking()">
            <div class="w-full h-[360px] sm:h-[400px] rounded-b-[160px] rounded-t-3xl overflow-hidden relative shadow-xl border-4 border-white transition-all duration-500 group-hover:translate-y-4 group-hover:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80"
                alt="Crystal Gloss & Shine"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               data-nuxiox-img="crystal_gloss_shine">
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white text-center">
                <span data-i18n="services.s4.tag" class="font-serif italic text-xs text-amber-300 tracking-widest uppercase mb-1">{{ $t('services.s4.tag') }}</span>
                <h3 data-i18n="services.s4.title" class="text-xl font-bold font-sans tracking-tight">{{ $t('services.s4.title') }}</h3>
                <span data-i18n="services.s4.action" class="text-[11px] text-stone-300 font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {{ $t('services.s4.action') }}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
