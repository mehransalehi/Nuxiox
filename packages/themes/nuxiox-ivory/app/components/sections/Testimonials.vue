<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Star, Quote } from 'lucide-vue-next';

interface TestimonialItem {
  id: number;
  avatar: string | null;
  rating: number;
  name: string;
  role: string | null;
  content: string;
}

const testimonials = ref<TestimonialItem[]>([]);

onMounted(async () => {
  try {
    const res = await fetch('/api/testimonials/public');
    if (res.ok) {
      testimonials.value = await res.json();
    }
  } catch (e) {
    console.error('Failed to load testimonials', e);
  }
});
</script>

<template>
  <section class="py-20 bg-slate-900 text-white transition-colors relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 relative z-10">
      
      <!-- Header -->
      <div class="max-w-xl space-y-3">
        <span class="text-xs font-bold tracking-widest text-cyan-400 uppercase">Testimonials</span>
        <h2 class="text-4xl sm:text-5xl font-light leading-tight">
          What our <span class="font-bold text-white">patients say</span>
        </h2>
      </div>

      <!-- Testimonial Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="item in testimonials" 
          :key="item.id"
          class="bg-slate-800/80 rounded-3xl p-8 border border-slate-700/80 flex flex-col justify-between space-y-6 relative group hover:border-cyan-500/50 transition-colors"
        >
          <Quote class="w-10 h-10 text-cyan-500/20 absolute top-6 right-6" />

          <div class="space-y-4">
            <div class="flex text-amber-400">
              <Star v-for="i in (item.rating || 5)" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{{ item.content }}"
            </p>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-slate-700">
            <img 
              :src="item.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'" 
              :alt="item.name"
              class="w-10 h-10 rounded-full object-cover border border-cyan-400"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 class="text-sm font-bold text-white">{{ item.name }}</h4>
              <span class="text-[11px] text-cyan-400">{{ item.role }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
