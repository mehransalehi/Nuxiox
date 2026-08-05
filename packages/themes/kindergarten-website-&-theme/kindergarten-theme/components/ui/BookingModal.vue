<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const form = ref({
  parentName: '',
  childName: '',
  childAge: '3',
  preferredDate: '',
  notes: ''
})

const isSubmitted = ref(false)
const isLoading = ref(false)

async function handleBookingSubmit() {
  if (!form.value.parentName) return
  isLoading.value = true
  try {
    await fetch('/api/booking', {
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

function handleClose() {
  isSubmitted.value = false
  emit('close')
}
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-amber-100 space-y-6">
      <!-- Close Button -->
      <button 
        @click="handleClose"
        class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
      >
        ✕
      </button>

      <!-- Modal Header -->
      <div class="space-y-1 text-center">
        <span class="text-3xl">🎒</span>
        <h3 class="text-2xl font-bold font-heading text-slate-800">
          {{ $t('booking.modalTitle') }}
        </h3>
        <p class="text-xs text-slate-500">
          {{ $t('booking.modalSubtitle') }}
        </p>
      </div>

      <!-- Success View -->
      <div v-if="isSubmitted" class="text-center space-y-4 py-4">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
          ✓
        </div>
        <p class="text-slate-700 font-medium text-sm">
          {{ $t('booking.successMessage') }}
        </p>
        <button 
          @click="handleClose"
          class="btn-kindergarten-primary text-sm font-bold w-full"
        >
          {{ $t('booking.closeBtn') }}
        </button>
      </div>

      <!-- Booking Form -->
      <form v-else @submit.prevent="handleBookingSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            {{ $t('booking.parentName') }}
          </label>
          <input 
            v-model="form.parentName"
            type="text" 
            required
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              {{ $t('booking.childName') }}
            </label>
            <input 
              v-model="form.childName"
              type="text" 
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              {{ $t('booking.childAge') }}
            </label>
            <select 
              v-model="form.childAge"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <option value="1.5">1.5 - 2 Years</option>
              <option value="3">3 - 4 Years</option>
              <option value="5">5 - 6 Years</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            {{ $t('booking.preferredDate') }}
          </label>
          <input 
            v-model="form.preferredDate"
            type="date" 
            required
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            {{ $t('booking.notes') }}
          </label>
          <textarea 
            v-model="form.notes"
            rows="2"
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full btn-kindergarten-primary text-center font-bold py-3 text-sm"
        >
          {{ isLoading ? 'Submitting...' : $t('booking.submitBooking') }}
        </button>
      </form>
    </div>
  </div>
</template>
