<script setup lang="ts">
import { ShieldCheck, Cpu, Heart, Sparkles, Clock, Coins } from 'lucide-vue-next';

const features = [
  {
    icon: ShieldCheck,
    title: "100% Painless Guarantee",
    desc: "Gentle local numbing, computer-controlled anesthesia flow, and optional conscious sedation for anxiety-free visits."
  },
  {
    icon: Cpu,
    title: "3D CBCT Digital Imaging",
    desc: "Ultra-low radiation 3D scanning maps nerves and bone structure down to sub-millimeter precision before any surgery."
  },
  {
    icon: Sparkles,
    title: "Master Artisan Aesthetics",
    desc: "Custom shade-matching by master ceramists guarantees veneers and crowns mirror natural light reflection."
  },
  {
    icon: Clock,
    title: "Same-Day Priority Walk-ins",
    desc: "Dedicated daily emergency slots ensure toothaches or broken restorations are addressed without waiting weeks."
  },
  {
    icon: Coins,
    title: "0% Interest Financing",
    desc: "Partnerships with CareCredit and Sunbit allow you to divide treatments into comfortable monthly payments."
  },
  {
    icon: Heart,
    title: "Warm Patient Spa Environment",
    desc: "Noise-canceling headphones, Netflix overhead screens, aromatherapy, and heated blankets during procedures."
  }
];
</script>

<template>
  <section id="whyus" class="py-20 bg-slate-900 text-white border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-800">
          <Sparkles class="w-4 h-4 text-teal-400" />
          <span>Why Patient Families Choose SmileCraft</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Superior Clinical Care Standards Built Around Your Peace of Mind
        </h2>
        <p class="text-slate-400 text-base leading-relaxed">
          We combine cutting-edge dental science with a compassionate, patient-first approach to make every dental appointment relaxing and rewarding.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feat, idx) in features" 
          :key="idx"
          class="bg-slate-950 p-8 rounded-2xl border border-slate-800/80 hover:border-teal-500/50 transition-all duration-300 group space-y-4"
        >
          <div class="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 text-teal-400 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
            <component :is="feat.icon" class="w-6 h-6 stroke-[2]" />
          </div>
          <h3 class="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
            {{ feat.title }}
          </h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            {{ feat.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
