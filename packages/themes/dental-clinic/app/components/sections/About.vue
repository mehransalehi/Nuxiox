<script setup lang="ts">
import { useSiteSettings } from '../../composables/useSiteSettings';
import { Award, ShieldCheck, HeartPulse, CheckCircle2, Building2 } from 'lucide-vue-next';

const { settings } = useSiteSettings();
</script>

<template>
  <section id="about" class="py-20 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Image Grid Column -->
        <div class="lg:col-span-6 relative">
          <div class="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80" 
              alt="Dental Procedure Precision" 
              class="w-full h-64 object-cover rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
            />
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80" 
              alt="High Tech Dental Operating Suite" 
              class="w-full h-64 object-cover rounded-2xl shadow-lg mt-8 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <!-- Experience Floating Card -->
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-teal-900 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4 max-w-sm w-full border border-teal-800">
            <div class="w-12 h-12 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-extrabold shrink-0">
              <Award class="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div class="text-xl font-extrabold text-white">18+ Years Excellence</div>
              <div class="text-xs text-teal-200">Recognized top cosmetic & implant clinic in California</div>
            </div>
          </div>
        </div>

        <!-- Text Content Column -->
        <div class="lg:col-span-6 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Building2 class="w-4 h-4" />
            <span>About SmileCraft Dental Practice</span>
          </div>

          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Redefining Dental Care Through Comfort, Craft, & Digital Innovation
          </h2>

          <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Founded with a vision to eliminate dental anxiety, SmileCraft combines warm human care with world-class dental technology. From low-radiation digital X-rays to zero-pain laser therapy, every step of your visit is optimized for ease and perfection.
          </p>

          <!-- Key Stats from SiteSettings.about.info -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
            <div 
              v-for="(item, idx) in (settings.about.info || [])" 
              :key="idx" 
              class="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800"
            >
              <span class="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                {{ item.value }}
              </span>
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ item.key }}
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <CheckCircle2 class="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Hospital-Grade HEPA Air Filtration & Medical Sterile Operating Suites
              </p>
            </div>
            <div class="flex items-start gap-3">
              <CheckCircle2 class="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
                In-House Master Ceramicists for Same-Week Custom Porcelain Veneers
              </p>
            </div>
            <div class="flex items-start gap-3">
              <CheckCircle2 class="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Flexible 0% APR Financing & Direct Medical Insurance Processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
