<script setup lang="ts">
import { ref } from 'vue';
import { UserCheck, Sliders, Cpu, ShieldCheck, ArrowUpRight } from 'lucide-vue-next';

const activeCard = ref(0);

const partnerCards = [
  {
    num: "01",
    icon: UserCheck,
    titleKey: "card1Title",
    descKey: "card1Desc"
  },
  {
    num: "02",
    icon: Sliders,
    titleKey: "card2Title",
    descKey: "card2Desc"
  },
  {
    num: "03",
    icon: Cpu,
    titleKey: "card3Title",
    descKey: "card3Desc"
  },
  {
    num: "04",
    icon: ShieldCheck,
    titleKey: "card4Title",
    descKey: "card4Desc"
  }
];
</script>

<template>
  <section id="about" class="py-20 bg-white dark:bg-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
      
      <!-- Section Header -->
      <div class="max-w-3xl space-y-4">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white leading-tight">
          More than <span class="font-normal text-slate-400">a clinic</span>
          <span class="block font-bold text-slate-900 dark:text-slate-100">—— Your smile partner</span>
        </h2>
        <p class="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          {{ $t('partner.description') }}
        </p>
      </div>

      <!-- 4 Horizontal / Grid Cards (01, 02, 03, 04) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(card, index) in partnerCards" 
          :key="card.num"
          @mouseenter="activeCard = index"
          :class="[
            'p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-72 cursor-pointer',
            activeCard === index 
              ? 'bg-slate-900 text-white dark:bg-cyan-950/80 dark:border-cyan-500/50 shadow-2xl shadow-cyan-500/10 -translate-y-1' 
              : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-slate-700'
          ]"
        >
          <div class="flex justify-between items-start">
            <component 
              :is="card.icon" 
              :class="[
                'w-8 h-8',
                activeCard === index ? 'text-[#00C4DF]' : 'text-slate-400 dark:text-slate-500'
              ]" 
            />
            <span :class="['text-3xl font-mono font-light', activeCard === index ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600']">
              {{ card.num }}
            </span>
          </div>

          <div class="space-y-2 mt-auto">
            <h3 class="text-lg font-bold">
              {{ $t(`partner.${card.titleKey}`) }}
            </h3>
            <p :class="['text-xs leading-relaxed', activeCard === index ? 'text-slate-300 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400']">
              {{ $t(`partner.${card.descKey}`) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Highlight Banner: Over 10 Years of Experience -->
      <div class="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
        <div class="absolute -right-12 -bottom-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div class="lg:col-span-7 space-y-4">
            <h3 class="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
              {{ $t('experience.heading') }}
            </h3>
            <p class="text-sm text-slate-300 leading-relaxed max-w-xl">
              {{ $t('experience.description') }}
            </p>
          </div>

          <div class="lg:col-span-5 space-y-6 lg:pl-6 border-l-0 lg:border-l border-slate-700">
            <p class="text-xs text-cyan-300 font-medium leading-relaxed italic">
              "{{ $t('experience.commitment') }}"
            </p>

            <a 
              href="#contact"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00C4DF] hover:bg-[#0284C7] text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>{{ $t('hero.cta') }}</span>
              <ArrowUpRight class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
