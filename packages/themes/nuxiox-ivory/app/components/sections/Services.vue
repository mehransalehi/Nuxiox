<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Play, ArrowUpRight, ShieldCheck, Activity, Sparkles, Smile, Sun, X } from 'lucide-vue-next';

interface ServiceItem {
  id: number;
  icon: string | null;
  image: string | null;
  link: string | null;
  sortOrder: number;
  isActive: boolean;
  title: string;
  subtitle: string | null;
  description: string | null;
  extra: { key: string; value: string }[];
}

const services = ref<ServiceItem[]>([]);
const activeServiceId = ref<number>(1);
const videoModalOpen = ref(false);

const iconMap: Record<string, any> = {
  ShieldCheck,
  Activity,
  Sparkles,
  Smile,
  Sun
};

onMounted(async () => {
  try {
    const res = await fetch('/api/services/public');
    if (res.ok) {
      services.value = await res.json();
      if (services.value.length > 0) {
        activeServiceId.value = services.value[0].id;
      }
    }
  } catch (e) {
    console.error('Failed to load services', e);
  }
});

const getServicePrice = (item: ServiceItem) => {
  const p = item.extra?.find(e => e.key === 'price');
  return p ? p.value : 'Custom quote';
};
</script>

<template>
  <section id="services" class="py-20 bg-white dark:bg-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">Services</span>
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 dark:text-white leading-tight mt-1">
            Expert <span class="font-bold">care</span>
            <span class="block text-slate-400 font-light">for every smile</span>
          </h2>
        </div>

        <p class="text-sm text-slate-500 max-w-md">
          Swiss precision dentistry tailored to your unique anatomical structure with digital 3D planning.
        </p>
      </div>

      <!-- Services Grid + Video Showcase (Image 1 replica) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Video Clinic Preview Card (Image 1 style) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl group">
            <img 
              src="/src/assets/images/clinic_interior_1785665473392.jpg" 
              alt="Ivory Dental Clinic Interior Video Tour"
              class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-6 flex flex-col justify-between">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium self-start">
                Live Clinic Tour
              </span>

              <div class="flex items-center justify-between gap-4">
                <div>
                  <h4 class="text-lg font-bold text-white">Watch video tour</h4>
                  <p class="text-xs text-slate-300">Discover our sterile operating suites & technology</p>
                </div>

                <button 
                  @click="videoModalOpen = true"
                  class="w-14 h-14 rounded-full bg-[#00C4DF] text-white flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-transform shrink-0"
                >
                  <Play class="w-6 h-6 fill-white ml-0.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Highlight Box -->
          <div class="p-6 rounded-2xl bg-cyan-50/60 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700 space-y-2">
            <span class="text-xs font-bold text-[#00C4DF] uppercase">Transparent Pricing</span>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              All treatment plans at Ivory Dental Clinic include fixed turnkey estimates with zero hidden fees.
            </p>
          </div>
        </div>

        <!-- Right Column: Interactive Services Accordion / List -->
        <div class="lg:col-span-7 space-y-4">
          <div 
            v-for="item in services" 
            :key="item.id"
            @click="activeServiceId = item.id"
            :class="[
              'p-6 rounded-3xl border transition-all duration-300 cursor-pointer',
              activeServiceId === item.id 
                ? 'bg-slate-50 dark:bg-slate-800 border-[#00C4DF] shadow-lg shadow-cyan-500/5' 
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
            ]"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div 
                  :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    activeServiceId === item.id ? 'bg-[#00C4DF] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  ]"
                >
                  <component :is="iconMap[item.icon || 'Sparkles'] || Sparkles" class="w-5 h-5" />
                </div>

                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ item.subtitle }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span v-if="getServicePrice(item)" class="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {{ getServicePrice(item) }}
                </span>
                <ArrowUpRight 
                  :class="[
                    'w-5 h-5 transition-transform duration-200',
                    activeServiceId === item.id ? 'text-[#00C4DF] rotate-45' : 'text-slate-400'
                  ]"
                />
              </div>
            </div>

            <!-- Expanded details -->
            <div v-if="activeServiceId === item.id" class="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700 space-y-4">
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ item.description }}
              </p>

              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="ex in item.extra" 
                  :key="ex.key"
                  class="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-[#00C4DF] border border-cyan-200/50 dark:border-cyan-800/50"
                >
                  {{ ex.key }}: {{ ex.value }}
                </span>
              </div>

              <div class="pt-2">
                <a 
                  href="#contact"
                  class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00C4DF] text-white text-xs font-semibold hover:bg-[#0284C7] transition-colors"
                >
                  <span>{{ $t('services.bookNow') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Video Modal -->
    <div v-if="videoModalOpen" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-slate-900 max-w-3xl w-full rounded-3xl p-6 border border-slate-800 shadow-2xl relative space-y-4">
        <button 
          @click="videoModalOpen = false"
          class="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          <X class="w-5 h-5" />
        </button>

        <h3 class="text-lg font-bold text-white">Ivory Dental Clinic — Video Presentation</h3>

        <div class="relative aspect-video rounded-2xl bg-black overflow-hidden flex items-center justify-center">
          <img 
            src="/src/assets/images/clinic_interior_1785665473392.jpg" 
            alt="Clinic Interior Tour"
            class="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div class="w-16 h-16 rounded-full bg-[#00C4DF] flex items-center justify-center shadow-xl">
              <Play class="w-8 h-8 fill-white ml-1" />
            </div>
            <p class="text-sm font-semibold max-w-md">
              Virtual tour through Ivory Dental Clinic operating rooms & 3D digital diagnosis laboratory.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
