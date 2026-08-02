<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  Sparkles, 
  ShieldCheck, 
  Smile, 
  Activity, 
  HeartPulse, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Calendar
} from 'lucide-vue-next';

interface ServiceItem {
  id: number;
  icon: string | null;
  image: string | null;
  link: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  extra: { key: string; value: string }[];
}

const services = ref<ServiceItem[]>([]);
const loading = ref(true);
const selectedService = ref<ServiceItem | null>(null);

const fetchServices = async () => {
  try {
    loading.value = true;
    const res = await fetch('/api/services/public');
    if (res.ok) {
      services.value = await res.json();
    }
  } catch (err) {
    console.error('Error fetching services:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchServices();
});

const getIconComponent = (iconName: string | null) => {
  switch (iconName) {
    case 'Sparkles': return Sparkles;
    case 'ShieldCheck': return ShieldCheck;
    case 'Smile': return Smile;
    case 'Activity': return Activity;
    case 'HeartPulse': return HeartPulse;
    case 'Clock': return Clock;
    default: return Sparkles;
  }
};
</script>

<template>
  <section id="services" class="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles class="w-4 h-4" />
          <span>Advanced Dental Care Specialties</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Comprehensive Dental Solutions Tailored to Your Smile
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          From laser teeth whitening to computer-guided surgical implants, our board-certified dental team delivers gentle precision for the whole family.
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Services Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="item in services" 
          :key="item.id"
          class="group bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-teal-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
        >
          <div>
            <!-- Card Image -->
            <div class="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img 
                v-if="item.image" 
                :src="item.image" 
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              
              <!-- Floating Icon -->
              <div class="absolute top-4 left-4 w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg">
                <component :is="getIconComponent(item.icon)" class="w-5 h-5" />
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 space-y-3">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-xs font-semibold text-teal-600 dark:text-teal-400 tracking-wide uppercase">
                {{ item.subtitle }}
              </p>
              <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                {{ item.description }}
              </p>

              <!-- Highlights / Extra key-values -->
              <div v-if="item.extra && item.extra.length" class="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div v-for="(ex, exIdx) in item.extra.slice(0, 2)" :key="exIdx" class="bg-slate-50 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span class="block text-slate-400 text-[10px] uppercase font-bold">{{ ex.key }}</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200">{{ ex.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Action Footer -->
          <div class="px-6 pb-6 pt-2">
            <button 
              @click="selectedService = item"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 hover:text-white text-teal-700 dark:text-teal-300 font-bold text-sm border border-teal-200 dark:border-teal-800 transition-all duration-200"
            >
              <span>Explore Details & Pricing</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Service Modal -->
    <div v-if="selectedService" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 relative">
        <button 
          @click="selectedService = null"
          class="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <component :is="getIconComponent(selectedService.icon)" class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Dental Specialty</span>
            <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ selectedService.title }}</h3>
          </div>
        </div>

        <img v-if="selectedService.image" :src="selectedService.image" :alt="selectedService.title" class="w-full h-56 object-cover rounded-2xl border border-slate-200 dark:border-slate-800" />

        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-base">Procedure Overview</h4>
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{{ selectedService.description }}</p>
        </div>

        <div v-if="selectedService.extra && selectedService.extra.length" class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-base">Clinical Specifications</h4>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="(ex, exIdx) in selectedService.extra" :key="exIdx" class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span class="block text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase">{{ ex.key }}</span>
              <span class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ ex.value }}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between">
          <a 
            href="#contact" 
            @click="selectedService = null"
            class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition"
          >
            <Calendar class="w-4 h-4" />
            <span>Book This Service Now</span>
          </a>
          <button 
            @click="selectedService = null"
            class="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
