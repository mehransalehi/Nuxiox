<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Star, MessageSquareQuote, ShieldCheck } from 'lucide-vue-next';

interface Testimonial {
  id: number;
  avatar: string | null;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  role: string | null;
  content: string;
}

const testimonials = ref<Testimonial[]>([]);
const loading = ref(true);

const fetchTestimonials = async () => {
  try {
    loading.value = true;
    const res = await fetch('/api/testimonials/public');
    if (res.ok) {
      testimonials.value = await res.json();
    }
  } catch (err) {
    console.error('Error fetching testimonials:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTestimonials();
});
</script>

<template>
  <section id="testimonials" class="py-20 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
          <MessageSquareQuote class="w-4 h-4" />
          <span>Verified Patient Reviews</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Read Real Patient Experiences & Stories
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Nothing matters more to us than your comfort, health, and radiant smile confidence.
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="i in 4" :key="i" class="h-48 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Testimonial Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="item in testimonials" 
          :key="item.id"
          class="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative space-y-4 flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1 text-amber-400">
                <Star v-for="s in item.rating" :key="s" class="w-4 h-4 fill-amber-400" />
              </div>
              <span class="text-[10px] font-extrabold uppercase bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                <ShieldCheck class="w-3 h-3 text-teal-600" />
                Verified Patient
              </span>
            </div>

            <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
              "{{ item.content }}"
            </p>
          </div>

          <div class="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <img 
              v-if="item.avatar" 
              :src="item.avatar" 
              :alt="item.name"
              class="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shrink-0"
            />
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white text-base">{{ item.name }}</h4>
              <p class="text-xs text-teal-600 dark:text-teal-400 font-semibold">{{ item.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
