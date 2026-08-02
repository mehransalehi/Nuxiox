<script setup lang="ts">
import { useSiteSettings } from '../../composables/useSiteSettings';
import { Calendar, ShieldCheck, Sparkles, Phone, Star, ArrowRight, Activity } from 'lucide-vue-next';

const { settings } = useSiteSettings();
</script>

<template>
  <section class="relative bg-gradient-to-b from-teal-50/80 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-10 pb-20 overflow-hidden">
    <!-- Ambient Background Lighting -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 left-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Hero Text Column -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Trust Pill -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles class="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Next-Generation Gentle & Painless Dental Care</span>
          </div>

          <!-- Main Title -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Transform Your Smile With <span class="bg-gradient-to-r from-teal-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">3D Digital Precision</span>
          </h1>

          <!-- Description -->
          <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
            Experience painless dentistry backed by board-certified specialists, computer-guided dental implants, laser whitening, and invisible orthodontics in a relaxing, luxury environment.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <a 
              href="#contact" 
              class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-base rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all duration-200"
            >
              <Calendar class="w-5 h-5" />
              <span>Schedule Your Consultation</span>
              <ArrowRight class="w-4 h-4 ml-1" />
            </a>

            <a 
              href="tel:+18005557645" 
              class="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base rounded-xl shadow-sm transition-all"
            >
              <Phone class="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>+1 (800) 555-SMILE</span>
            </a>
          </div>

          <!-- Doctor Rating & Social Proof Bar -->
          <div class="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-6">
            <div class="flex -space-x-3">
              <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120" alt="Doctor 1" />
              <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120" alt="Doctor 2" />
              <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1594824813571-27a3f060ee06?w=120" alt="Doctor 3" />
              <div class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                12+
              </div>
            </div>

            <div>
              <div class="flex items-center gap-1 text-amber-400">
                <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400" />
                <span class="text-sm font-bold text-slate-900 dark:text-white ml-1">4.98 / 5.0</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Based on 2,400+ Verified Patient Reviews
              </p>
            </div>
          </div>
        </div>

        <!-- Hero Image Column with Floating Badges -->
        <div class="lg:col-span-5 relative">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80" 
              alt="Modern Dental Clinic Room" 
              class="w-full h-[460px] object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
          </div>

          <!-- Floating Badge 1: 3D CBCT Scanner -->
          <div class="absolute -top-4 -left-4 sm:-left-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Activity class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">3D Precision</div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white">CBCT Guided Surgery</div>
            </div>
          </div>

          <!-- Floating Badge 2: Painless Guarantee -->
          <div class="absolute -bottom-6 -right-4 sm:-right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Comfort Guarantee</div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white">Zero Pain Sedation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
