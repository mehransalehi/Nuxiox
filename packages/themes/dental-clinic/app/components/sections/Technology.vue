<script setup lang="ts">
import { Cpu, Activity, Zap, Eye, ShieldCheck, Sparkles } from 'lucide-vue-next';

const techStack = [
  {
    name: "iTero Element 5D Scanner",
    category: "3D Digital Impressioning",
    desc: "Replaces uncomfortable gag-inducing tray impressions with 60-second high-definition 3D digital oral scanning."
  },
  {
    name: "Cool-Laser Biolase Epic",
    category: "Laser Gum & Whitening",
    desc: "Performs bloodless, suture-free gum reshaping and deep tooth stain removal with cold-diode laser technology."
  },
  {
    name: "3D CBCT Cone-Beam Tomography",
    category: "Sub-Millimeter Surgical Guide",
    desc: "Captures 3D skeletal volumetric images allowing virtual implant placement modeling prior to surgery."
  },
  {
    name: "High-Power Dental Operating Microscope",
    category: "Micro-Endodontic Surgery",
    desc: "Provides 25x optical magnification for meticulous root canal cleaning without removing healthy tooth enamel."
  }
];
</script>

<template>
  <section id="technology" class="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Text Column -->
        <div class="lg:col-span-5 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Cpu class="w-4 h-4" />
            <span>Dental Technology Suite</span>
          </div>

          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Advanced Clinical Technology for Faster, Precise Results
          </h2>

          <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            By investing in state-of-the-art diagnostic equipment, we shorten treatment times, eliminate physical impression discomfort, and increase surgical success rates.
          </p>

          <div class="p-6 bg-teal-900 text-teal-100 rounded-2xl border border-teal-800 space-y-3">
            <div class="flex items-center gap-2 text-amber-300 font-bold text-sm uppercase">
              <ShieldCheck class="w-5 h-5 text-amber-300" />
              <span>Low Radiation Standard</span>
            </div>
            <p class="text-xs leading-relaxed text-teal-200">
              Our digital sensor technology reduces patient radiation exposure by up to 80% compared to traditional dental X-ray film.
            </p>
          </div>
        </div>

        <!-- Tech Stack Cards Column -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div 
            v-for="(tech, idx) in techStack" 
            :key="idx"
            class="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-teal-500/50 transition"
          >
            <span class="inline-block text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
              {{ tech.category }}
            </span>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ tech.name }}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{{ tech.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
