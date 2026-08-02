<script setup lang="ts">
import { ref } from 'vue';
import { Star, ArrowRight, Eye, CheckCircle2 } from 'lucide-vue-next';

const activeCaseIndex = ref(0);
const showAfter = ref(true);

const patientCases = [
  {
    id: "johann",
    name: "Johann K.",
    age: "52 yrs",
    treatment: "Full Mouth Straumann Implant Restoration",
    duration: "2 Sessions",
    review: "I got back my natural bite and full chewing confidence in just 2 painless visits.",
    beforeImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    afterImg: "/src/assets/images/smile_patient_hero_1785665461829.jpg"
  },
  {
    id: "klara",
    name: "Klara S.",
    age: "34 yrs",
    treatment: "Micro-thin Zirconia Porcelain Veneers",
    duration: "1 Week",
    review: "The 3D digital smile simulation was exact. My new smile looks completely natural!",
    beforeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    afterImg: "/src/assets/images/smile_patient_hero_1785665461829.jpg"
  },
  {
    id: "alex",
    name: "Alex M.",
    age: "29 yrs",
    treatment: "Laser Whitening + Alignment Correction",
    duration: "45 Minutes",
    review: "Brightened my smile 7 shades without any tooth sensitivity. Incredible service!",
    beforeImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    afterImg: "/src/assets/images/smile_patient_hero_1785665461829.jpg"
  }
];
</script>

<template>
  <section id="results" class="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">Transformations</span>
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 dark:text-white leading-tight mt-1">
            Discover <span class="font-bold">the Power</span>
            <span class="block text-slate-400 font-light">of change</span>
          </h2>
        </div>

        <div class="flex flex-col items-start md:items-end gap-2">
          <div class="flex text-amber-400">
            <Star v-for="i in 5" :key="i" class="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <p class="text-xs font-bold text-slate-700 dark:text-slate-300">
            12,398 5-star reviews from satisfied patients
          </p>
        </div>
      </div>

      <!-- Case Selection Cards Grid (Image 1 style) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(caseItem, index) in patientCases" 
          :key="caseItem.id"
          @click="activeCaseIndex = index"
          :class="[
            'p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6',
            activeCaseIndex === index 
              ? 'bg-white dark:bg-slate-900 border-[#00C4DF] shadow-xl shadow-cyan-500/10 ring-2 ring-[#00C4DF]/20' 
              : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          ]"
        >
          <!-- Case Image Preview -->
          <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              :src="showAfter && activeCaseIndex === index ? caseItem.afterImg : caseItem.beforeImg" 
              :alt="caseItem.name"
              class="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            <div class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-white text-[11px] font-mono tracking-wider backdrop-blur">
              {{ showAfter && activeCaseIndex === index ? 'AFTER TREATMENT' : 'BEFORE' }}
            </div>
          </div>

          <!-- Case Info -->
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ caseItem.name }}
                </h3>
                <span class="text-xs text-slate-500">{{ caseItem.age }} • {{ caseItem.duration }}</span>
              </div>
              <CheckCircle2 class="w-5 h-5 text-[#00C4DF]" />
            </div>

            <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {{ caseItem.treatment }}
            </p>

            <p class="text-xs text-slate-500 dark:text-slate-400 italic">
              "{{ caseItem.review }}"
            </p>
          </div>

          <!-- Action Button -->
          <button 
            class="w-full py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#00C4DF] hover:text-white hover:border-[#00C4DF] transition-colors"
          >
            View {{ caseItem.name }} case
          </button>
        </div>
      </div>

      <!-- Before / After Toggle Banner -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <Eye class="w-5 h-5 text-[#00C4DF]" />
          <span class="text-sm font-bold text-slate-900 dark:text-white">
            Comparing: <span class="text-[#00C4DF]">{{ patientCases[activeCaseIndex].name }}</span> ({{ patientCases[activeCaseIndex].treatment }})
          </span>
        </div>

        <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          <button 
            @click="showAfter = false"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-bold transition-colors',
              !showAfter ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-300'
            ]"
          >
            Show Before
          </button>
          <button 
            @click="showAfter = true"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-bold transition-colors',
              showAfter ? 'bg-[#00C4DF] text-white' : 'text-slate-600 dark:text-slate-300'
            ]"
          >
            Show After
          </button>
        </div>
      </div>

    </div>
  </section>
</template>
