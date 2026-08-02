<script setup lang="ts">
import { ref } from 'vue';
import { Award, CheckCircle2, Shield, X, Download } from 'lucide-vue-next';

const certificateModalOpen = ref(false);

const specs = [
  {
    titleKey: "feat1",
    label: "Lifetime Durability",
    desc: "Swiss SLAactive surface technology accelerates cell adhesion."
  },
  {
    titleKey: "feat2",
    label: "Micro-Grooved Thread",
    desc: "Provides maximum primary stability during surgical placement."
  },
  {
    titleKey: "feat3",
    label: "Bone Preservation",
    desc: "Prevents bone resorption and maintains natural jaw contours."
  },
  {
    titleKey: "feat4",
    label: "Biocompatible Titanium",
    desc: "Grade 4 pure titanium ensuring zero allergic rejection."
  }
];
</script>

<template>
  <section class="py-20 bg-slate-50 dark:bg-slate-950 transition-colors border-y border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
      
      <!-- Section Title -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">Technical Precision</span>
          <h2 class="text-4xl sm:text-5xl font-light text-slate-900 dark:text-white leading-tight mt-1">
            Certified <span class="font-bold">Quality</span>
            <span class="block text-slate-400 font-light text-3xl sm:text-4xl mt-1">Official Warranty</span>
          </h2>
        </div>

        <button 
          @click="certificateModalOpen = true"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white font-mono text-xs tracking-wider uppercase hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all"
        >
          <Award class="w-4 h-4 text-[#00C4DF]" />
          <span>{{ $t('quality.viewCertificate') }}</span>
        </button>
      </div>

      <!-- Interactive Implant Tech Diagram Display (Image 1 replica) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800">
        
        <!-- Left Features List -->
        <div class="lg:col-span-5 space-y-6">
          <div 
            v-for="(spec, index) in specs" 
            :key="index"
            class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 hover:border-cyan-300 transition-colors"
          >
            <div class="flex items-start gap-3">
              <CheckCircle2 class="w-5 h-5 text-[#00C4DF] shrink-0 mt-0.5" />
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ $t(`quality.${spec.titleKey}`) }}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ spec.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 3D Visual Diagram -->
        <div class="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div class="relative w-full max-w-md aspect-square bg-gradient-to-br from-[#EBF8FF] to-white dark:from-slate-800 dark:to-slate-950 rounded-3xl p-8 border border-cyan-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
            <img 
              src="/src/assets/images/hero_implant_render_1785665450567.jpg" 
              alt="Certified Quality Implant Diagram"
              class="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />

            <!-- Watermark -->
            <div class="absolute bottom-6 right-6 opacity-30 pointer-events-none text-right">
              <span class="block font-mono text-4xl font-black text-slate-400">SWISS</span>
              <span class="block font-mono text-xs uppercase text-slate-400">Straumann Quality</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Certificate Modal -->
    <div v-if="certificateModalOpen" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
        <button 
          @click="certificateModalOpen = false"
          class="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-[#00C4DF]">
            <Shield class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Swiss Straumann Official Warranty</h3>
            <p class="text-xs text-slate-500">Certificate No: CH-8820-STRAUMANN-IVORY</p>
          </div>
        </div>

        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p class="font-medium text-slate-900 dark:text-white">
            This certifies that Ivory Dental Clinic is an authorized partner of Straumann AG (Basel, Switzerland).
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li>100% genuine Straumann titanium & ceramic implants</li>
            <li>International lifetime replacement guarantee</li>
            <li>Traceable batch serial numbers recorded in your patient passport</li>
          </ul>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button 
            @click="certificateModalOpen = false"
            class="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold"
          >
            {{ $t('common.close') }}
          </button>
          <button 
            @click="certificateModalOpen = false"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00C4DF] text-white text-xs font-semibold shadow-md"
          >
            <Download class="w-4 h-4" />
            <span>Download Certificate PDF</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
