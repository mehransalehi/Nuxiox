<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Award, GraduationCap, CheckCircle2 } from 'lucide-vue-next';

interface ColleagueItem {
  id: number;
  image: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  extra: { key: string; value: string }[];
}

const team = ref<ColleagueItem[]>([]);

onMounted(async () => {
  try {
    const res = await fetch('/api/colleagues/public');
    if (res.ok) {
      team.value = await res.json();
    }
  } catch (e) {
    console.error('Failed to load team', e);
  }
});
</script>

<template>
  <section class="py-20 bg-white dark:bg-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
      
      <!-- Section Header -->
      <div class="max-w-2xl space-y-3">
        <span class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">Medical Team</span>
        <h2 class="text-4xl sm:text-5xl font-light text-slate-900 dark:text-white leading-tight">
          Board-certified <span class="font-bold">Specialists</span>
        </h2>
        <p class="text-sm text-slate-500">
          Our international team of oral surgeons, implantologists, and aesthetic dentists holds certifications from top European universities.
        </p>
      </div>

      <!-- Doctor Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="doc in team" 
          :key="doc.id"
          class="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6 hover:shadow-xl transition-all"
        >
          <div class="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700">
            <img 
              :src="doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'" 
              :alt="doc.title"
              class="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div class="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-white text-[11px] font-mono backdrop-blur">
              VERIFIED SPECIALIST
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">
              {{ doc.title }}
            </h3>
            <p class="text-xs font-semibold text-[#00C4DF]">
              {{ doc.subtitle }}
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ doc.description }}
            </p>
          </div>

          <div v-if="doc.extra?.length" class="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <div 
              v-for="ex in doc.extra" 
              :key="ex.key"
              class="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
            >
              <GraduationCap class="w-3.5 h-3.5 text-[#00C4DF]" />
              <span>{{ ex.value }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
