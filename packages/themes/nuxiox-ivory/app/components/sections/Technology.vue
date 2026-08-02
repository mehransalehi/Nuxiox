<script setup lang="ts">
import { Cpu, ShieldCheck, Zap, Sparkles } from 'lucide-vue-next';

const techList = [
  {
    icon: Cpu,
    title: "3D CBCT Tomography",
    desc: "Sub-millimeter volumetric 3D jaw mapping with 80% lower radiation than standard CTs."
  },
  {
    icon: Zap,
    title: "CAD/CAM Zirconia Milling",
    desc: "Computer-designed ceramic crowns and bridges milled with Swiss micro-precision."
  },
  {
    icon: Sparkles,
    title: "Cold-Light Laser Whitening",
    desc: "Philips ZOOM! enamel-safe bleaching technology up to 8 shades brighter."
  },
  {
    icon: ShieldCheck,
    title: "Sterile Operating Suites",
    desc: "Class 100 positive-pressure hospital airflow sterilizing 99.99% of airborne microbes."
  }
];
</script>

<template>
  <section class="py-20 bg-slate-900 text-white transition-colors border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
      
      <div class="max-w-2xl space-y-3">
        <span class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">Equipment & Innovation</span>
        <h2 class="text-4xl sm:text-5xl font-light leading-tight">
          Pioneering <span class="font-bold text-[#00C4DF]">Dental Technologies</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(item, index) in techList" 
          :key="index"
          class="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4 hover:border-cyan-500/50 transition-colors"
        >
          <div class="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-[#00C4DF]">
            <component :is="item.icon" class="w-5 h-5" />
          </div>

          <h3 class="text-lg font-bold text-white">{{ item.title }}</h3>
          <p class="text-xs text-slate-300 leading-relaxed">{{ item.desc }}</p>
        </div>
      </div>

    </div>
  </section>
</template>
