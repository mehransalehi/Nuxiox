<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Phone, Clock, Send, Sparkles, Check, HeartHandshake } from 'lucide-vue-next'

const form = ref({
  parentName: '',
  childName: '',
  email: '',
  phone: '',
  service: 'First Smile Checkup (0-3)',
  message: ''
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  // Simulate network request
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
    form.value = {
      parentName: '',
      childName: '',
      email: '',
      phone: '',
      service: 'First Smile Checkup (0-3)',
      message: ''
    }
  }, 900)
}
</script>

<template>
  <section id="contact" class="py-16 lg:py-24 bg-white relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
          <HeartHandshake class="w-3.5 h-3.5 text-rose-600" />
          <span>{{ $t('contact.badge') }}</span>
        </div>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-950 tracking-tight">
          {{ $t('contact.title') }}
        </h2>
        
        <p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left Column: Clinic Contact Info & Hours Cards -->
        <div class="lg:col-span-5 space-y-6">
          
          <!-- Clinic Address Card -->
          <div class="p-6 rounded-[2rem] bg-indigo-50/80 border border-indigo-100 flex items-start gap-4 text-start">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <MapPin class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h4 class="text-base font-extrabold text-indigo-950">{{ $t('contact.addressTitle') }}</h4>
              <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{{ $t('contact.addressVal') }}</p>
            </div>
          </div>

          <!-- Phone Card -->
          <div class="p-6 rounded-[2rem] bg-amber-50/80 border border-amber-100 flex items-start gap-4 text-start">
            <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Phone class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h4 class="text-base font-extrabold text-indigo-950">{{ $t('contact.phoneTitle') }}</h4>
              <p class="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed">{{ $t('contact.phoneVal') }}</p>
              <div class="text-[11px] font-bold text-amber-700">Dedicated 24/7 Kids Tooth Emergency line</div>
            </div>
          </div>

          <!-- Clinic Hours Card -->
          <div class="p-6 rounded-[2rem] bg-emerald-50/80 border border-emerald-100 flex items-start gap-4 text-start">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Clock class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h4 class="text-base font-extrabold text-indigo-950">{{ $t('contact.hoursTitle') }}</h4>
              <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{{ $t('contact.hoursVal') }}</p>
            </div>
          </div>

        </div>

        <!-- Right Column: Interactive Consultation & Appointment Request Form -->
        <div class="lg:col-span-7 bg-slate-50 p-6 sm:p-8 lg:p-10 rounded-[2.5rem] border-2 border-slate-200/80 shadow-lg text-start">
          <h3 class="text-2xl font-black text-indigo-950 mb-6 tracking-tight">
            {{ $t('contact.formTitle') }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ $t('contact.fullName') }}</label>
                <input
                  v-model="form.parentName"
                  type="text"
                  required
                  placeholder="e.g. Jessica Taylor"
                  class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ $t('contact.childName') }}</label>
                <input
                  v-model="form.childName"
                  type="text"
                  required
                  placeholder="e.g. Leo (Age 4)"
                  class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ $t('contact.emailLabel') }}</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="jessica@example.com"
                  class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ $t('contact.phoneLabel') }}</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">{{ $t('contact.messageLabel') }}</label>
              <textarea
                v-model="form.message"
                rows="3"
                placeholder="Let us know if this is a first visit, tooth pain, or if your child needs extra comfort..."
                class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Send class="w-4 h-4" />
              <span>{{ isSubmitting ? $t('contact.sending') : $t('contact.submitBtn') }}</span>
            </button>

            <div v-if="isSubmitted" class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
              <Check class="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{{ $t('contact.successMessage') }}</span>
            </div>
          </form>
        </div>

      </div>

    </div>
  </section>
</template>
