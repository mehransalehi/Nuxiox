<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const isSuccess = ref(false)
const formData = ref({
  fullName: '',
  phone: '',
  service: 'opt1'
})

function handleSubmit(e: Event) {
  e.preventDefault()
  isSuccess.value = true
}

function handleClose() {
  isSuccess.value = false
  formData.value = { fullName: '', phone: '', service: 'opt1' }
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 p-4"
      @click.self="handleClose"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
        <button data-i18n="bookingModal.close"
          @click="handleClose"
          class="absolute top-5 left-5 text-stone-400 hover:text-stone-700 transition-colors"
          :aria-label="$t('bookingModal.close')"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>

        <div class="text-right mb-6">
          <h3 data-i18n="bookingModal.title" class="text-xl font-bold text-[#222222]">{{ $t('bookingModal.title') }}</h3>
          <p data-i18n="bookingModal.subtitle" class="text-xs text-stone-500 font-normal mt-1">{{ $t('bookingModal.subtitle') }}</p>
        </div>

        <form v-if="!isSuccess" @submit="handleSubmit" class="space-y-4 text-right font-medium">
          <div>
            <label data-i18n="bookingModal.nameLabel" class="block text-xs font-semibold text-stone-700 mb-1">{{ $t('bookingModal.nameLabel') }}</label>
            <input
              v-model="formData.fullName"
              type="text"
              required
              :placeholder="$t('bookingModal.namePlaceholder')"
              class="w-full px-4 py-2.5 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#C5A059] text-xs text-[#222222] transition-colors"
            />
          </div>

          <div>
            <label data-i18n="bookingModal.phoneLabel" class="block text-xs font-semibold text-stone-700 mb-1">{{ $t('bookingModal.phoneLabel') }}</label>
            <input
              v-model="formData.phone"
              type="tel"
              required
              :placeholder="$t('bookingModal.phonePlaceholder')"
              dir="ltr"
              class="w-full px-4 py-2.5 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#C5A059] text-xs text-[#222222] transition-colors text-right"
            />
          </div>

          <div>
            <label data-i18n="bookingModal.serviceLabel" class="block text-xs font-semibold text-stone-700 mb-1">{{ $t('bookingModal.serviceLabel') }}</label>
            <select
              v-model="formData.service"
              class="w-full px-4 py-2.5 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#C5A059] text-xs text-[#222222] transition-colors"
            >
              <option data-i18n="bookingModal.opt1" value="opt1">{{ $t('bookingModal.opt1') }}</option>
              <option data-i18n="bookingModal.opt2" value="opt2">{{ $t('bookingModal.opt2') }}</option>
              <option data-i18n="bookingModal.opt3" value="opt3">{{ $t('bookingModal.opt3') }}</option>
              <option data-i18n="bookingModal.opt4" value="opt4">{{ $t('bookingModal.opt4') }}</option>
            </select>
          </div>

          <button data-i18n="bookingModal.submit" type="submit" class="w-full py-3 btn-gold-dark rounded-lg font-bold text-xs transition-all mt-2 shadow-sm">
            {{ $t('bookingModal.submit') }}
          </button>
        </form>

        <div v-else class="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl mx-auto mb-1 border border-emerald-200">
            <i class="fa-solid fa-check"></i>
          </div>
          <h4 data-i18n="bookingModal.successTitle" class="text-lg font-bold text-[#222222]">{{ $t('bookingModal.successTitle') }}</h4>
          <p data-i18n="bookingModal.successMessage" class="text-xs text-stone-500 font-normal leading-relaxed">{{ $t('bookingModal.successMessage') }}</p>
          <button data-i18n="bookingModal.close" @click="handleClose" class="btn-gold-dark px-6 py-2 text-xs font-bold mt-3 rounded-lg">
            {{ $t('bookingModal.close') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
