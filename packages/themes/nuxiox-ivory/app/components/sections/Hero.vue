<script setup lang="ts">
import { computed } from 'vue';
import { useSiteSettings, getInfoValue } from '../../composables/useSiteSettings';
import { ShieldCheck, ArrowRight, Award, Star, CheckCircle2 } from 'lucide-vue-next';

const { settings } = useSiteSettings();

const yearsExp = computed(() => getInfoValue(settings.value, 'years_exp', '12'));
const clinicsCount = computed(() => getInfoValue(settings.value, 'clinics_count', '04'));
const restoredCount = computed(() => getInfoValue(settings.value, 'patients_restored', '1350+'));
const reviewsCount = computed(() => getInfoValue(settings.value, 'reviews_count', '12,398'));
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-[#F0F9FF] via-[#EBF8FF] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 pt-8 pb-20 transition-colors">
    <!-- Ambient cyan glow -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400/10 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
      
      <!-- Top Eyebrow & Badges -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-cyan-100 dark:border-cyan-900/50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm">
          <ShieldCheck class="w-4 h-4 text-[#00C4DF]" />
          <span>{{ $t('hero.lifetimeWarranty') }}</span>
        </div>

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-medium">
          <Award class="w-4 h-4 text-[#00C4DF]" />
          <span>{{ $t('hero.officialPartner') }}</span>
        </div>
      </div>

      <!-- Main Headline Grid inspired by Ivory (Image 1) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Left Content Column -->
        <div class="lg:col-span-5 space-y-6">
          <p class="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            {{ $t('hero.eyebrow') }}
          </p>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Innovative <span class="font-normal underline decoration-cyan-400/60 decoration-2 underline-offset-8">tooth restoration</span> technology for a healthy
            <span class="font-bold block mt-2 text-slate-900 dark:text-slate-100">and Confident <span class="text-[#00C4DF]">Smile</span></span>
          </h1>

          <div class="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a 
              href="#contact"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#00C4DF] hover:bg-[#0284C7] text-white font-bold text-base shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>{{ $t('hero.cta') }}</span>
              <ArrowRight class="w-5 h-5" />
            </a>

            <div class="flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur px-4 py-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                +{{ restoredCount }}
              </div>
              <div class="text-xs">
                <span class="block font-bold text-slate-900 dark:text-white">{{ $t('hero.statRestored') }}</span>
                <span class="text-slate-500 text-[11px]">Swiss Precision Straumann</span>
              </div>
            </div>
          </div>

          <!-- Trust Stars Badge from Image 2 -->
          <div class="pt-2 flex items-center gap-3">
            <div class="flex text-amber-400">
              <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span class="font-black text-slate-900 dark:text-white">{{ reviewsCount }}</span> {{ $t('results.reviewsCount') }}
            </span>
          </div>
        </div>

        <!-- Center Column: Floating 3D Dental Implant Model (Image 1 centerpiece) -->
        <div class="lg:col-span-4 flex justify-center relative my-4 lg:my-0">
          <div class="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white/80 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-900/50 p-6 border border-white dark:border-slate-800 shadow-2xl shadow-cyan-500/10 flex items-center justify-center group">
            
            <img 
              src="/src/assets/images/hero_implant_render_1785665450567.jpg" 
              alt="Swiss Straumann 3D Dental Implant Model"
              class="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            <!-- Floating feature badges -->
            <div class="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
              <span>Biocompatible Titanium</span>
            </div>

            <div class="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 class="w-3.5 h-3.5 text-cyan-500" />
              <span>Micro-Grooved Thread</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Big Numerical Callout Metrics (Image 1 style) -->
        <div class="lg:col-span-3 flex flex-col justify-center space-y-8 pl-0 lg:pl-6 border-l-0 lg:border-l border-slate-200/60 dark:border-slate-800">
          
          <div class="space-y-1">
            <span class="text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
              {{ yearsExp }}
            </span>
            <span class="block text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {{ $t('hero.statExperience') }}
            </span>
          </div>

          <div class="h-px bg-slate-200 dark:bg-slate-800 w-24"></div>

          <div class="space-y-1">
            <span class="text-6xl lg:text-7xl font-black text-[#00C4DF] tracking-tighter">
              {{ clinicsCount }}
            </span>
            <span class="block text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {{ $t('hero.statClinics') }}
            </span>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>
