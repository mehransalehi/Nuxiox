<script setup lang="ts">
import { useModalStore } from '~~/packages/base/app/stores/modal'
import { Sparkles, Tv, Zap, Gift, Check, ArrowRight } from 'lucide-vue-next'

const modalStore = useModalStore()

const featureCards = [
  {
    tag: 'whyus.item1Tag',
    title: 'whyus.item1Title',
    desc: 'whyus.item1Desc',
    img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=700&q=80',
    tagBg: 'bg-amber-400 text-indigo-950',
    badgeText: 'Disney & Netflix'
  },
  {
    tag: 'whyus.item2Tag',
    title: 'whyus.item2Title',
    desc: 'whyus.item2Desc',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80',
    tagBg: 'bg-emerald-400 text-emerald-950',
    badgeText: 'No-Shot Laser'
  },
  {
    tag: 'whyus.item3Tag',
    title: 'whyus.item3Title',
    desc: 'whyus.item3Desc',
    img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=700&q=80',
    tagBg: 'bg-rose-400 text-white',
    badgeText: 'Treasure Box'
  }
]
</script>

<template>
  <section id="whyus" class="py-16 lg:py-24 bg-indigo-950 text-white relative overflow-hidden">
    <!-- Playful Background Stars & Floating Elements -->
    <div class="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
      <div class="absolute top-10 left-10 text-4xl">👑</div>
      <div class="absolute top-20 right-20 text-3xl">🎈</div>
      <div class="absolute bottom-10 left-1/4 text-4xl">🌟</div>
      <div class="absolute bottom-20 right-10 text-3xl">🚀</div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-800/80 border border-indigo-700 text-amber-300 font-bold text-xs">
          <Sparkles class="w-3.5 h-3.5 text-amber-400" />
          <span>{{ $t('whyus.badge') }}</span>
        </div>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {{ $t('whyus.title') }}
        </h2>
        
        <p class="text-base sm:text-lg text-indigo-200 font-normal leading-relaxed">
          {{ $t('whyus.subtitle') }}
        </p>
      </div>

      <!-- 3 Feature Photo Cards (Matching reference layout) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div
          v-for="(item, idx) in featureCards"
          :key="idx"
          class="bg-indigo-900/80 border border-indigo-800/80 rounded-[2rem] p-4 flex flex-col justify-between hover:bg-indigo-900 transition-all duration-300 hover:-translate-y-1.5 shadow-xl group overflow-hidden"
        >
          <!-- Image Frame with Badge -->
          <div class="relative h-52 sm:h-56 rounded-2xl overflow-hidden mb-4">
            <img
              :src="item.img"
              :alt="item.badgeText"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <!-- Top Tag -->
            <div
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black shadow-md uppercase tracking-wider"
              :class="item.tagBg"
            >
              {{ $t(item.tag) }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-2 space-y-2">
            <h3 class="text-lg font-bold text-white tracking-tight">
              {{ $t(item.title) }}
            </h3>
            <p class="text-xs sm:text-sm text-indigo-200 leading-relaxed font-normal">
              {{ $t(item.desc) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Metric Pills Row (Matching the 4 round stats in reference image!) -->
      <div class="bg-white text-indigo-950 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-indigo-800/30">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          <!-- Stat 1 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-bold shrink-0">
              😊
            </div>
            <div>
              <div class="text-xl sm:text-2xl lg:text-3xl font-black text-indigo-950">{{ $t('results.stat1Number') }}</div>
              <div class="text-xs sm:text-sm font-bold text-slate-500">{{ $t('results.stat1Label') }}</div>
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold shrink-0">
              ✨
            </div>
            <div>
              <div class="text-xl sm:text-2xl lg:text-3xl font-black text-indigo-950">{{ $t('results.stat2Number') }}</div>
              <div class="text-xs sm:text-sm font-bold text-slate-500">{{ $t('results.stat2Label') }}</div>
            </div>
          </div>

          <!-- Stat 3 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold shrink-0">
              👩‍⚕️
            </div>
            <div>
              <div class="text-xl sm:text-2xl lg:text-3xl font-black text-indigo-950">{{ $t('results.stat3Number') }}</div>
              <div class="text-xs sm:text-sm font-bold text-slate-500">{{ $t('results.stat3Label') }}</div>
            </div>
          </div>

          <!-- Stat 4 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xl font-bold shrink-0">
              🏆
            </div>
            <div>
              <div class="text-xl sm:text-2xl lg:text-3xl font-black text-indigo-950">{{ $t('results.stat4Number') }}</div>
              <div class="text-xs sm:text-sm font-bold text-slate-500">{{ $t('results.stat4Label') }}</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
