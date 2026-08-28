<script setup lang="ts">
import { useModalStore } from '~~/packages/base/app/stores/modal'
import { Sparkles, Play, ArrowRight, Star, Heart, CheckCircle2, ShieldCheck, Smile } from 'lucide-vue-next'

const modalStore = useModalStore()
</script>

<template>
  <section id="hero" class="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-amber-50/40 pt-8 pb-16 lg:pt-14 lg:pb-24">
    <!-- Playful Floating Background Doodles & Shapes -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <!-- Floating Tooth / Sparkle Sticker Top Left -->
      <div class="absolute top-10 left-6 sm:left-16 w-16 h-16 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-500 animate-float shadow-xs">
        <Sparkles class="w-8 h-8" />
      </div>
      
      <!-- Floating Star Top Right -->
      <div class="absolute top-12 right-8 sm:right-24 text-amber-400 animate-wiggle">
        <Star class="w-10 h-10 fill-amber-300 stroke-amber-500" />
      </div>

      <!-- Floating Heart Left Middle -->
      <div class="absolute top-1/2 left-4 sm:left-12 text-rose-400 animate-float-reverse">
        <Heart class="w-8 h-8 fill-rose-200 stroke-rose-400" />
      </div>

      <!-- Floating Smile Right Middle -->
      <div class="absolute bottom-20 right-6 sm:right-16 w-14 h-14 rounded-2xl bg-indigo-100/90 border border-indigo-200 flex items-center justify-center text-indigo-600 animate-float">
        <Smile class="w-8 h-8" />
      </div>

      <!-- Cloud Shapes Top & Bottom -->
      <div class="absolute top-6 left-1/3 w-28 h-12 bg-white/70 rounded-full blur-[1px]"></div>
      <div class="absolute top-20 right-1/4 w-36 h-14 bg-white/80 rounded-full blur-[1px]"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        <!-- Left Column: Typography, Badges & Interactive CTAs -->
        <div class="lg:col-span-6 flex flex-col items-start text-start space-y-6">
          
          <!-- Trust Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm shadow-xs">
            <Star class="w-4 h-4 fill-amber-400 text-amber-600" />
            <span>{{ $t('hero.badge') }}</span>
          </div>

          <!-- Main Playful Heading -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-indigo-950 tracking-tight leading-[1.15]">
            <span>{{ $t('hero.titleStart') }} </span>
            <span class="text-amber-500">{{ $t('hero.titleGrow') }} </span>
            <span class="text-emerald-500 underline decoration-wavy decoration-emerald-300 decoration-2">{{ $t('hero.titleSmile') }} </span>
            <span>{{ $t('hero.titleAnd') }} </span>
            <span class="text-indigo-600">{{ $t('hero.titleShine') }}</span>
          </h1>

          <!-- Subtitle / Value Proposition -->
          <p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
            {{ $t('hero.subtitle') }}
          </p>

          <!-- CTAs: Book Appointment & Tour Video -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              @click="modalStore.openBooking()"
              class="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm sm:text-base px-7 py-3.5 rounded-full shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{{ $t('hero.bookBtn') }}</span>
              <ArrowRight class="w-5 h-5 arrow-dir" />
            </button>

            <button
              type="button"
              @click="modalStore.openImage('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80')"
              class="inline-flex items-center gap-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-sm sm:text-base px-5 py-3.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span>{{ $t('hero.watchVideo') }}</span>
            </button>
          </div>

          <!-- 3 Joyful Feature Tags (Pain Free, Ceiling TVs, Rewards) -->
          <div class="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-indigo-100 shadow-xs">
              <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
              <span class="text-xs font-bold text-slate-700">{{ $t('hero.funFact1') }}</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-indigo-100 shadow-xs">
              <CheckCircle2 class="w-4 h-4 text-amber-500 shrink-0" />
              <span class="text-xs font-bold text-slate-700">{{ $t('hero.funFact2') }}</span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-indigo-100 shadow-xs">
              <CheckCircle2 class="w-4 h-4 text-indigo-500 shrink-0" />
              <span class="text-xs font-bold text-slate-700">{{ $t('hero.funFact3') }}</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Hero Visual Illustration, Cheerful Kids & Interactive Season Badge -->
        <div class="lg:col-span-6 relative flex justify-center items-center">
          <!-- Colorful Decorative Backing Card / Bubble -->
          <div class="relative w-full max-w-lg">
            
            <!-- Background playful blob layer -->
            <div class="absolute -inset-4 bg-gradient-to-tr from-indigo-200 via-amber-200 to-rose-200 rounded-[2.5rem] transform -rotate-2 scale-95 opacity-70 blur-xs"></div>

            <!-- Main Image Card Frame -->
            <div class="relative bg-white p-4 sm:p-5 rounded-[2.2rem] shadow-2xl border-4 border-white overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80"
                alt="Happy child smiling during gentle dental checkup"
                class="w-full h-80 sm:h-96 object-cover rounded-[1.6rem] hover:scale-102 transition-transform duration-500"
                loading="eager"
              />

              <!-- Floating Hero Tag: Admission / Smile Kit 2026 -->
              <div class="absolute bottom-6 left-6 right-6 sm:right-auto sm:left-6 bg-indigo-950/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-indigo-700/50 shadow-xl flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black text-sm shrink-0">
                  🦷
                </div>
                <div>
                  <div class="text-[10px] font-bold text-amber-300 uppercase tracking-wider">{{ $t('hero.seasonBadgeYear') }}</div>
                  <div class="text-xs sm:text-sm font-extrabold text-white">{{ $t('hero.seasonBadgeText') }}</div>
                </div>
                <span class="ml-auto px-2.5 py-1 rounded-full bg-emerald-500 text-[10px] font-black text-white tracking-wide">
                  {{ $t('hero.seasonBadgeStatus') }}
                </span>
              </div>
            </div>

            <!-- Floating Top Right Badge -->
            <div class="absolute -top-4 -right-4 sm:-right-6 bg-amber-400 text-indigo-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce">
              <span>⭐️</span>
              <span>100% Pain-Free</span>
            </div>

            <!-- Floating Bottom Left Badge -->
            <div class="absolute -bottom-4 -left-4 sm:-left-6 bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1.5">
              <ShieldCheck class="w-4 h-4" />
              <span>Certified Pediatric Specialists</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
