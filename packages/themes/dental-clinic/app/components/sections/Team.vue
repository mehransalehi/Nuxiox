<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserCheck, Award, GraduationCap, Languages, Calendar, X, ArrowRight } from 'lucide-vue-next';

interface Colleague {
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

const colleagues = ref<Colleague[]>([]);
const loading = ref(true);
const selectedDoctor = ref<Colleague | null>(null);

const fetchColleagues = async () => {
  try {
    loading.value = true;
    const res = await fetch('/api/colleagues/public');
    if (res.ok) {
      colleagues.value = await res.json();
    }
  } catch (err) {
    console.error('Error fetching team colleagues:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchColleagues();
});
</script>

<template>
  <section id="team" class="py-20 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
          <UserCheck class="w-4 h-4" />
          <span>Our Board-Certified Specialists</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Meet Our Renowned Dental Doctors & Surgeons
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          Combining decades of combined experience from top Ivy League dental institutions, our doctors are dedicated to your comfort and health.
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Doctors Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="doc in colleagues" 
          :key="doc.id"
          class="group bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="relative h-72 overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img 
                v-if="doc.image" 
                :src="doc.image" 
                :alt="doc.title"
                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div class="absolute bottom-3 left-4 right-4">
                <span class="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-800">
                  {{ doc.subtitle }}
                </span>
              </div>
            </div>

            <div class="p-5 space-y-3">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {{ doc.title }}
              </h3>
              <p class="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-3">
                {{ doc.description }}
              </p>
            </div>
          </div>

          <div class="px-5 pb-5 pt-2">
            <button 
              @click="selectedDoctor = doc"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition"
            >
              <span>View Bio & Credentials</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Doctor Bio Modal -->
    <div v-if="selectedDoctor" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 relative">
        <button 
          @click="selectedDoctor = null"
          class="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-4">
          <img v-if="selectedDoctor.image" :src="selectedDoctor.image" :alt="selectedDoctor.title" class="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shrink-0" />
          <div>
            <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ selectedDoctor.title }}</h3>
            <p class="text-sm font-semibold text-teal-600 dark:text-teal-400">{{ selectedDoctor.subtitle }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm">Biography & Background</h4>
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{{ selectedDoctor.description }}</p>
        </div>

        <div v-if="selectedDoctor.extra && selectedDoctor.extra.length" class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm">Professional Qualifications</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(ex, exIdx) in selectedDoctor.extra" :key="exIdx" class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span class="block text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase">{{ ex.key }}</span>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ ex.value }}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a 
            href="#contact" 
            @click="selectedDoctor = null"
            class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition text-sm"
          >
            <Calendar class="w-4 h-4" />
            <span>Request Appointment With Doctor</span>
          </a>
          <button 
            @click="selectedDoctor = null"
            class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
