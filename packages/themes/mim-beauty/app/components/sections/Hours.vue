<script setup lang="ts">
import { useModalStore } from '~~/packages/base/app/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <section id="hours" class="w-full bg-[#F6F4EF] py-20 border-b border-[#E6DFC9] relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C5A059_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        <!-- Vertical Hair Colorist Image Right -->
        <div class="lg:col-span-3 hidden sm:block reveal active">
          <div class="relative w-full h-[500px] rounded-[32px] overflow-hidden shadow-xl border-4 border-white group bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80"
              alt="Hair Colorist at work"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             data-nuxiox-img="hair_colorist_at_work">
            <div class="absolute inset-3 border border-white/70 rounded-[24px] pointer-events-none"></div>
            <div class="absolute bottom-5 inset-x-5 bg-black/40 backdrop-blur-md rounded-2xl p-3 text-center text-white border border-white/10">
              <span data-i18n="hours.coloristTag" class="text-xs font-bold block text-amber-200">{{ $t('hours.coloristTag') }}</span>
              <span data-i18n="hours.coloristDesc" class="text-[10px] text-stone-200 font-light">{{ $t('hours.coloristDesc') }}</span>
            </div>
          </div>
        </div>

        <!-- Center Working Hours & Branch Info Card -->
        <div class="lg:col-span-6 reveal active delay-100">
          <div class="bg-white rounded-[36px] p-8 sm:p-10 shadow-2xl border border-stone-200/80 relative overflow-hidden text-center space-y-6">
            
            <div class="absolute -top-6 -right-6 text-[#C5A059]/20 text-7xl pointer-events-none select-none">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div class="absolute -bottom-6 -left-6 text-[#C5A059]/20 text-7xl pointer-events-none select-none">
              <i class="fa-solid fa-spa"></i>
            </div>

            <div class="space-y-2 relative z-10">
              <span data-i18n="hours.brandTag" class="font-serif italic text-xs text-[#C5A059] tracking-widest uppercase block font-semibold">{{ $t('hours.brandTag') }}</span>
              <h3 data-i18n="hours.title" class="text-2xl sm:text-3xl font-black text-[#222222] font-sans tracking-tight">
                {{ $t('hours.title') }}
              </h3>
              <p data-i18n="hours.subtitle" class="text-xs text-[#666666] font-normal">
                {{ $t('hours.subtitle') }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 ltr:text-left rtl:text-right pt-2 relative z-10">
              <!-- Hours Schedule -->
              <div class="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-5 space-y-3">
                <div class="flex items-center gap-2 text-[#C5A059] font-bold text-xs">
                  <i class="fa-regular fa-clock text-base"></i>
                  <span data-i18n="hours.scheduleTitle">{{ $t('hours.scheduleTitle') }}</span>
                </div>
                <div class="space-y-2 text-xs text-stone-700">
                  <div class="flex items-center justify-between border-b border-stone-200/60 pb-2">
                    <span data-i18n="hours.weekdays" class="font-semibold">{{ $t('hours.weekdays') }}</span>
                    <span data-i18n="hours.weekdaysTime" class="font-bold text-[#222222]" dir="ltr">{{ $t('hours.weekdaysTime') }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span data-i18n="hours.holidays" class="font-semibold">{{ $t('hours.holidays') }}</span>
                    <span data-i18n="hours.holidaysTime" class="text-[#C5A059] font-bold">{{ $t('hours.holidaysTime') }}</span>
                  </div>
                </div>
              </div>

              <!-- Branch Addresses -->
              <div class="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-5 space-y-3">
                <div class="flex items-center gap-2 text-[#C5A059] font-bold text-xs">
                  <i class="fa-solid fa-location-dot text-base"></i>
                  <span data-i18n="hours.branchesTitle">{{ $t('hours.branchesTitle') }}</span>
                </div>
                <div class="space-y-2 text-[11px] text-stone-700 leading-relaxed">
                  <div>
                    <span data-i18n="hours.b1Title" class="font-bold text-[#222222] block">{{ $t('hours.b1Title') }}</span>
                    <span data-i18n="hours.b1Address" class="text-stone-500">{{ $t('hours.b1Address') }}</span>
                  </div>
                  <div class="pt-1 border-t border-stone-200/60">
                    <span data-i18n="hours.b2Title" class="font-bold text-[#222222] block">{{ $t('hours.b2Title') }}</span>
                    <span data-i18n="hours.b2Address" class="text-stone-500">{{ $t('hours.b2Address') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button @click="modalStore.openBooking()" class="w-full sm:w-auto px-8 py-3.5 bg-[#2B1D16] hover:bg-black text-white text-xs font-bold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                <span data-i18n="hours.bookOnline">{{ $t('hours.bookOnline') }}</span>
                <i class="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
              </button>
              <a href="tel:02122001234" class="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2" dir="ltr">
                <i class="fa-solid fa-phone text-[#C5A059]"></i>
                <span data-i18n="hours.phone">{{ $t('hours.phone') }}</span>
              </a>
            </div>

          </div>
        </div>

        <!-- Vertical Hair Colorist Image Left -->
        <div class="lg:col-span-3 hidden sm:block reveal active">
          <div class="relative w-full h-[500px] rounded-[32px] overflow-hidden shadow-xl border-4 border-white group bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
              alt="Hair Colorist Model"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             data-nuxiox-img="hair_colorist_model">
            <div class="absolute inset-3 border border-white/70 rounded-[24px] pointer-events-none"></div>
            <div class="absolute bottom-5 inset-x-5 bg-black/40 backdrop-blur-md rounded-2xl p-3 text-center text-white border border-white/10">
              <span data-i18n="hours.teamTag" class="text-xs font-bold block text-amber-200">{{ $t('hours.teamTag') }}</span>
              <span data-i18n="hours.teamDesc" class="text-[10px] text-stone-200 font-light">{{ $t('hours.teamDesc') }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
