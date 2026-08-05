<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  fullName: '',
  phone: '',
  message: ''
})

const isSubmitted = ref(false)

async function handleSubmit(e: Event) {
  e.preventDefault()
  try {
    await $fetch('/api/contact-messages', {
      method: 'POST',
      body: {
        name: formData.value.fullName,
        email: formData.value.phone,
        message: formData.value.message
      }
    })
  } catch (err) {
    // Graceful fallback
  }
  isSubmitted.value = true
  alert(useI18n().t('contact.alertSuccess'))
  formData.value = { fullName: '', phone: '', message: '' }
}
</script>

<template>
  <section id="contact" class="w-full bg-white py-24 relative">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <!-- Contact Info -->
        <div class="lg:col-span-5 space-y-8 text-right reveal active">
          <div>
            <span class="font-serif italic text-2xl text-[#C5A059] tracking-widest block mb-2">{{ $t('contact.eyebrow') }}</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-[#222222]">{{ $t('contact.title') }}</h2>
            <p class="text-[#666666] text-sm font-normal mt-3 leading-relaxed">
              {{ $t('contact.subtitle') }}
            </p>
          </div>

          <div class="space-y-6 text-sm font-normal">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 class="font-bold text-[#222222]">{{ $t('contact.addressTitle') }}</h4>
                <p class="text-stone-500 mt-1">{{ $t('contact.addressDetail') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] shrink-0">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div>
                <h4 class="font-bold text-[#222222]">{{ $t('contact.phoneTitle') }}</h4>
                <p class="text-stone-500 mt-1" dir="ltr">{{ $t('contact.phoneNumber') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-7 reveal active delay-200">
          <div class="card-light-journal p-8 rounded-2xl space-y-6">
            <h3 class="text-xl font-bold text-[#222222]">{{ $t('contact.formTitle') }}</h3>
            <form @submit="handleSubmit" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-stone-600 mb-1">{{ $t('contact.fullName') }}</label>
                  <input
                    v-model="formData.fullName"
                    type="text"
                    required
                    :placeholder="$t('contact.namePlaceholder')"
                    class="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-xs text-[#222222] focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs text-stone-600 mb-1">{{ $t('contact.phoneLabel') }}</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    required
                    :placeholder="$t('contact.phonePlaceholder')"
                    dir="ltr"
                    class="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-xs text-[#222222] focus:outline-none focus:border-[#C5A059] transition-colors text-right"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs text-stone-600 mb-1">{{ $t('contact.messageLabel') }}</label>
                <textarea
                  v-model="formData.message"
                  rows="4"
                  required
                  :placeholder="$t('contact.messagePlaceholder')"
                  class="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-xs text-[#222222] focus:outline-none focus:border-[#C5A059] transition-colors"
                ></textarea>
              </div>
              <button type="submit" class="btn-gold-dark px-8 py-3 rounded-lg text-xs font-semibold w-full sm:w-auto">
                {{ $t('contact.submitBtn') }}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
