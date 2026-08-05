<script setup>
import { ref } from 'vue'

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  message: ''
})

const isSubmitted = ref(false)
const isLoading = ref(false)

async function handleSubmit() {
  if (!form.value.fullName || !form.value.message) return
  isLoading.value = true
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    isSubmitted.value = true
  } catch (e) {
    isSubmitted.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section id="contact" class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div class="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            {{ $t('contact.title') }}
          </div>

          <h2 class="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
            {{ $t('contact.subtitle') }}
          </h2>

          <div class="space-y-4 pt-4">
            <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start space-x-4 gap-4">
              <div class="text-2xl">📍</div>
              <div>
                <h4 class="font-bold text-slate-800 text-sm">{{ $t('contact.addressTitle') }}</h4>
                <p class="text-slate-600 text-sm mt-1">{{ $t('contact.addressValue') }}</p>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start space-x-4 gap-4">
              <div class="text-2xl">📞</div>
              <div>
                <h4 class="font-bold text-slate-800 text-sm">{{ $t('contact.phoneTitle') }}</h4>
                <p class="text-slate-600 text-sm mt-1">{{ $t('contact.phoneValue') }}</p>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start space-x-4 gap-4">
              <div class="text-2xl">⏰</div>
              <div>
                <h4 class="font-bold text-slate-800 text-sm">{{ $t('contact.hoursTitle') }}</h4>
                <p class="text-slate-600 text-sm mt-1">{{ $t('contact.hoursValue') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="p-8 rounded-3xl bg-amber-50/30 border border-amber-100/80 shadow-sm">
          <h3 class="text-xl font-bold font-heading text-slate-800 mb-6">
            {{ $t('contact.formTitle') }}
          </h3>

          <div v-if="isSubmitted" class="p-4 rounded-2xl bg-emerald-100 text-emerald-800 text-sm font-semibold">
            {{ $t('contact.successMsg') }}
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                {{ $t('contact.fullName') }}
              </label>
              <input 
                v-model="form.fullName"
                type="text" 
                required
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  {{ $t('contact.email') }}
                </label>
                <input 
                  v-model="form.email"
                  type="email" 
                  class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  {{ $t('contact.phone') }}
                </label>
                <input 
                  v-model="form.phone"
                  type="tel" 
                  class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                {{ $t('contact.messageLabel') }}
              </label>
              <textarea 
                v-model="form.message"
                rows="4" 
                required
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full btn-kindergarten-primary text-center font-bold py-3"
            >
              {{ isLoading ? 'Sending...' : $t('contact.submitBtn') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
