<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-vue-next';

const cases = [
  {
    title: "Full Smile Veneer Transformation",
    patient: "Elena M., 32",
    details: "10 Upper E-Max Porcelain Veneers crafted in 2 visits",
    beforeImg: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Invisalign Clear Aligner Correction",
    patient: "David R., 28",
    details: "7-month bite alignment with iTero 3D digital tracking",
    beforeImg: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Single Tooth 3D Guided Implant",
    patient: "Sarah K., 41",
    details: "Titanium implant with custom shade zirconia crown",
    beforeImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    afterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
  }
];

const activeTab = ref(0);
</script>

<template>
  <section id="results" class="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles class="w-4 h-4" />
          <span>Real Clinical Results</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smile Transformations That Speak for Themselves
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          See actual clinical outcomes achieved by our master cosmetic team and surgical implantologists.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(c, idx) in cases" 
          :key="idx"
          class="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/50 transition"
        >
          <div class="relative h-60 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <img :src="c.afterImg" :alt="c.title" class="w-full h-full object-cover" />
            <div class="absolute top-3 right-3 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md">
              SmileCraft Outcome
            </div>
          </div>

          <div class="space-y-2">
            <span class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide block">
              Patient: {{ c.patient }}
            </span>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ c.title }}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{{ c.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
