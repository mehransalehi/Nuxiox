<script setup lang="ts">
import DecorativeBg from '../ui/DecorativeBg.vue'
import { useModalStore } from '~~/packages/base/app/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <section id="promotions" class="w-full bg-[#F8F6F2] py-20 border-b border-[#E6DFC9] relative overflow-hidden">
    <!-- Reusable Decorative Background (Lamps, Orbs, Grid Overlay, Sparkles) -->
    <DecorativeBg />

    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10">
      
      <!-- Section Title -->
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-16 reveal active">
        <span class="font-serif italic text-2xl text-[#C5A059] tracking-widest block">{{ $t('promotions.specialOffer') }}</span>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-[#222222] font-sans leading-tight">{{ $t('promotions.title') }}</h2>
        <p class="text-[#666666] text-sm sm:text-base font-normal">
          {{ $t('promotions.subtitle') }}
        </p>
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- Package 1: Light Journal Card -->
        <div class="card-light-journal rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group reveal active delay-100">
          <div class="absolute top-0 left-0 bg-stone-200/80 text-[#222222] font-serif text-xl font-extrabold px-5 py-3 rounded-br-2xl shadow-sm z-20">
            {{ $t('promotions.pkg1.num') }}
          </div>

          <div class="space-y-6 pt-4">
            <div class="w-full h-56 rounded-t-[120px] overflow-hidden relative shadow-md bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                alt="Keratin & Recovery"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div class="space-y-2 ltr:text-left rtl:text-right">
              <span class="font-serif italic text-xs text-[#C5A059] tracking-widest uppercase block">{{ $t('promotions.pkg1.tag') }}</span>
              <h3 class="text-2xl sm:text-3xl font-black text-[#222222] leading-tight tracking-tight">
                {{ $t('promotions.pkg1.title') }}
              </h3>
              <div class="w-12 h-0.5 bg-[#C5A059]/60 rounded-full my-3"></div>
              <p class="text-xs text-[#666666] leading-relaxed font-normal">
                {{ $t('promotions.pkg1.desc') }}
              </p>
            </div>

            <div class="space-y-3 pt-2 text-xs text-[#222222] font-medium">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                  <i class="fa-solid fa-sparkles text-xs"></i>
                </div>
                <span>{{ $t('promotions.pkg1.f1') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                  <i class="fa-solid fa-droplet text-xs"></i>
                </div>
                <span>{{ $t('promotions.pkg1.f2') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                  <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                </div>
                <span>{{ $t('promotions.pkg1.f3') }}</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-stone-200/80 flex items-center justify-between mt-6">
            <span class="text-sm font-extrabold text-[#C5A059]">{{ $t('promotions.pkg1.price') }}</span>
            <button @click="modalStore.openBooking()" class="flex items-center gap-2 text-xs font-bold text-[#222222] hover:text-[#C5A059] transition-colors">
              <span>{{ $t('promotions.pkg1.btn') }}</span>
              <i class="fa-solid fa-arrow-left text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Package 2: Dark Chanel Style Luxury Card -->
        <div class="card-dark-journal rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden text-white shadow-2xl group bg-gradient-to-b from-[#181818] via-[#141414] to-[#0D0D0D] reveal active delay-200">
          <div class="absolute -top-10 -right-10 w-48 h-48 bg-[#C5A059]/15 blur-3xl rounded-full pointer-events-none"></div>
          <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-[#D4AF37]/10 blur-3xl rounded-full pointer-events-none"></div>

          <div class="absolute top-0 left-0 bg-stone-800 text-[#D4AF37] font-serif text-xl font-extrabold px-5 py-3 rounded-br-2xl shadow-sm z-20 border-b border-r border-amber-500/20">
            {{ $t('promotions.pkg2.num') }}
          </div>

          <div class="space-y-6 pt-4 relative z-10">
            <div class="w-full h-56 rounded-2xl overflow-hidden relative shadow-lg border border-amber-500/20 group-hover:border-amber-500/50 transition-colors">
              <img
                src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80"
                alt="Brazilian Balayage"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div class="space-y-2 ltr:text-left rtl:text-right">
              <span class="font-serif italic text-xs text-[#D4AF37] tracking-widest uppercase block">{{ $t('promotions.pkg2.tag') }}</span>
              <h3 class="text-2xl sm:text-3xl font-black text-[#D4AF37] leading-tight tracking-tight">
                {{ $t('promotions.pkg2.title') }}
              </h3>
              <div class="w-12 h-0.5 bg-[#D4AF37]/70 rounded-full my-3"></div>
              <p class="text-xs text-stone-300 leading-relaxed font-light">
                {{ $t('promotions.pkg2.desc') }}
              </p>
            </div>

            <div class="space-y-3 pt-2 text-xs text-stone-200 font-light">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-circle-check text-[#D4AF37] text-xs"></i>
                <span>{{ $t('promotions.pkg2.f1') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-circle-check text-[#D4AF37] text-xs"></i>
                <span>{{ $t('promotions.pkg2.f2') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-circle-check text-[#D4AF37] text-xs"></i>
                <span>{{ $t('promotions.pkg2.f3') }}</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-white/10 flex items-center justify-between mt-6 relative z-10">
            <span class="text-sm font-extrabold text-[#D4AF37]">{{ $t('promotions.pkg2.price') }}</span>
            <button @click="modalStore.openBooking()" class="flex items-center gap-2 text-xs font-bold text-white hover:text-[#D4AF37] transition-colors tracking-wider uppercase">
              <span>{{ $t('promotions.pkg2.btn') }}</span>
              <i class="fa-solid fa-play text-[9px] text-[#D4AF37]"></i>
            </button>
          </div>
        </div>

        <!-- Package 3: Light Journal Card -->
        <div class="card-light-journal rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group reveal active delay-300">
          <div class="absolute top-0 left-0 bg-stone-200/80 text-[#222222] font-serif text-xl font-extrabold px-5 py-3 rounded-br-2xl shadow-sm z-20">
            {{ $t('promotions.pkg3.num') }}
          </div>

          <div class="space-y-6 pt-4">
            <div class="w-full h-56 rounded-t-[120px] overflow-hidden relative shadow-md bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80"
                alt="Color Gloss"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div class="space-y-2 ltr:text-left rtl:text-right">
              <span class="font-serif italic text-xs text-[#C5A059] tracking-widest uppercase block">{{ $t('promotions.pkg3.tag') }}</span>
              <h3 class="text-2xl sm:text-3xl font-black text-[#222222] leading-tight tracking-tight">
                {{ $t('promotions.pkg3.title') }}
              </h3>
              <div class="w-12 h-0.5 bg-[#C5A059]/60 rounded-full my-3"></div>
              <p class="text-xs text-[#666666] leading-relaxed font-normal">
                {{ $t('promotions.pkg3.desc') }}
              </p>
            </div>

            <div class="space-y-3 pt-2 text-xs text-[#222222] font-medium">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                  <i class="fa-solid fa-eye-dropper text-xs"></i>
                </div>
                <span>{{ $t('promotions.pkg3.f1') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                  <i class="fa-solid fa-gem text-xs"></i>
                </div>
                <span>{{ $t('promotions.pkg3.f2') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                  <i class="fa-solid fa-scissors text-xs"></i>
                </div>
                <span>{{ $t('promotions.pkg3.f3') }}</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-stone-200/80 flex items-center justify-between mt-6">
            <span class="text-sm font-extrabold text-[#C5A059]">{{ $t('promotions.pkg3.price') }}</span>
            <button @click="modalStore.openBooking()" class="flex items-center gap-2 text-xs font-bold text-[#222222] hover:text-[#C5A059] transition-colors">
              <span>{{ $t('promotions.pkg3.btn') }}</span>
              <i class="fa-solid fa-arrow-left text-xs"></i>
            </button>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
