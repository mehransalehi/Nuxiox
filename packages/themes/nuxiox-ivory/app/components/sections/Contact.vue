<script setup lang="ts">
import { ref } from 'vue';
import { Send, Phone, Mail, MapPin, CheckCircle2, Clock } from 'lucide-vue-next';

const fullName = ref('');
const phone = ref('');
const problem = ref('');
const preferredDate = ref('');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  if (!fullName.value.trim() || !phone.value.trim() || !problem.value.trim()) {
    errorMessage.value = 'Please fill out your name, phone number, and problem description.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const res = await fetch('/api/contact-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName.value,
        email: `${fullName.value.toLowerCase().replace(/\s+/g, '')}@patient.care`,
        phone: phone.value,
        message: problem.value,
        preferredDate: preferredDate.value || 'As soon as possible'
      })
    });

    if (res.ok) {
      const data = await res.json();
      successMessage.value = data.message || 'Your consultation request has been sent successfully!';
      fullName.value = '';
      phone.value = '';
      problem.value = '';
      preferredDate.value = '';
    } else {
      const err = await res.json();
      errorMessage.value = err.message || 'Failed to submit message. Please try again.';
    }
  } catch (e) {
    errorMessage.value = 'Network error. Please try again or call us directly.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section id="contact" class="py-20 bg-slate-900 text-white transition-colors relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-16 relative z-10">
      
      <!-- Section Header Inspired by Image 1 -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-12">
        <div>
          <h2 class="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-none">
            We're <span class="font-bold text-[#00C4DF]">here</span>
            <span class="block font-serif italic text-slate-400">to Help</span>
          </h2>
        </div>

        <p class="text-sm text-slate-400 max-w-sm">
          {{ $t('contact.subtext') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Locations List -->
        <div class="lg:col-span-5 space-y-8">
          <div class="space-y-6">
            <h3 class="text-xs font-bold tracking-widest text-[#00C4DF] uppercase">
              {{ $t('contact.locationsTitle') }}
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span class="font-bold text-white block">Germany, Berlin</span>
                <span class="text-slate-400 block">Friedrichstraße 123, 10117</span>
              </div>

              <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span class="font-bold text-white block">Spain, Barcelona</span>
                <span class="text-slate-400 block">Carrer De Balmes 200, 08006</span>
              </div>

              <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span class="font-bold text-white block">France, Paris</span>
                <span class="text-slate-400 block">45 Rue De Rivoli, 75001</span>
              </div>

              <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span class="font-bold text-white block">Poland, Katowice</span>
                <span class="text-slate-400 block">Ul. 3 Maja 15, 40-097</span>
              </div>
            </div>
          </div>

          <!-- Direct Email -->
          <div class="pt-4 border-t border-slate-800">
            <a href="mailto:ivoryclinic.eu@gmail.com" class="text-xl font-mono text-[#00C4DF] hover:underline">
              ivoryclinic.eu@gmail.com
            </a>
          </div>
        </div>

        <!-- Right Quick Reservation Form (Image 1 replica) -->
        <div class="lg:col-span-7 bg-slate-800/90 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
          <h3 class="text-xl font-bold text-white">Book Your Consultation</h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-slate-400">{{ $t('contact.fullName') }} *</label>
                <input 
                  v-model="fullName"
                  type="text" 
                  placeholder="e.g. John Doe"
                  class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00C4DF]"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="text-xs text-slate-400">{{ $t('contact.phone') }} *</label>
                <input 
                  v-model="phone"
                  type="tel" 
                  placeholder="+49 170 1234567"
                  class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00C4DF]"
                  required
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs text-slate-400">{{ $t('contact.problem') }} *</label>
              <textarea 
                v-model="problem"
                rows="3"
                placeholder="e.g. Missing upper molar, seeking Straumann implant consultation..."
                class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00C4DF]"
                required
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs text-slate-400">{{ $t('contact.preferredDate') }}</label>
              <input 
                v-model="preferredDate"
                type="text" 
                placeholder="e.g. Next Monday Morning"
                class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00C4DF]"
              />
            </div>

            <div v-if="successMessage" class="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{{ successMessage }}</span>
            </div>

            <div v-if="errorMessage" class="p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs">
              {{ errorMessage }}
            </div>

            <button 
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00C4DF] hover:bg-[#0284C7] text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send class="w-4 h-4" />
              <span>{{ isSubmitting ? 'Sending...' : $t('contact.send') }}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  </section>
</template>
