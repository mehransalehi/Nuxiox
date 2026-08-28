<script setup lang="ts">
import { ref } from 'vue'
import { X, Sparkles, Calendar, Clock, Smile, Check, Tv, Heart } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = ref({
  parentName: '',
  childName: '',
  childAge: '4',
  service: 'First Smile Checkup',
  preferredDate: '',
  preferredTime: '10:00 AM',
  favoriteCartoon: 'Paw Patrol & Bluey',
  firstVisit: 'yes'
})

const isSubmitted = ref(false)

function submitBooking() {
  isSubmitted.value = true
  setTimeout(() => {
    isSubmitted.value = false
    emit('close')
  }, 2500)
}
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-indigo-950/70 backdrop-blur-xs animate-fade-in"
    @click.self="emit('close')"
  >
    <div class="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border-4 border-amber-300 p-6 sm:p-8 text-start overflow-hidden">
      <!-- Decorative background accent -->
      <div class="absolute -top-12 -right-12 w-36 h-36 bg-amber-100 rounded-full blur-xl -z-10"></div>
      
      <!-- Close Button -->
      <button
        type="button"
        @click="emit('close')"
        class="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Modal Header -->
      <div class="space-y-1 pr-8 mb-6">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
          <Sparkles class="w-3.5 h-3.5 text-amber-600" />
          <span>VIP Little Hero Booking</span>
        </div>
        <h3 class="text-2xl font-black text-indigo-950 tracking-tight">
          {{ $t('modal.bookingTitle') }}
        </h3>
        <p class="text-xs text-slate-600 font-medium">
          {{ $t('modal.bookingSubtitle') }}
        </p>
      </div>

      <!-- Booking Form -->
      <form @submit.prevent="submitBooking" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ $t('modal.parentName') }}</label>
            <input
              v-model="form.parentName"
              type="text"
              required
              placeholder="e.g. Sarah Connor"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ $t('modal.childName') }}</label>
            <input
              v-model="form.childName"
              type="text"
              required
              placeholder="e.g. Leo"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ $t('modal.childAge') }}</label>
            <select
              v-model="form.childAge"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
            >
              <option value="1">1 Year (Infant Check)</option>
              <option value="2">2 Years (Toddler)</option>
              <option value="3">3 Years (Preschool)</option>
              <option value="4">4 - 6 Years (Kindergarten)</option>
              <option value="7">7 - 12 Years (Elementary)</option>
              <option value="13">13+ Years (Teen Ortho)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ $t('modal.service') }}</label>
            <select
              v-model="form.service"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
            >
              <option>First Smile Routine Exam</option>
              <option>Bubblegum Cleaning & Fluoride</option>
              <option>Painless Cavity Shield / Sealant</option>
              <option>Orthodontic Smile Alignment</option>
              <option>Urgent / Tooth Discomfort</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ $t('modal.preferredDate') }}</label>
            <input
              v-model="form.preferredDate"
              type="date"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ $t('modal.preferredTime') }}</label>
            <select
              v-model="form.preferredTime"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
            >
              <option>9:00 AM (Morning Playtime)</option>
              <option>11:00 AM (Mid-Day)</option>
              <option>2:00 PM (After-Nap)</option>
              <option>4:30 PM (After School)</option>
            </select>
          </div>
        </div>

        <!-- Cartoon Selection for TV Ceiling -->
        <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200">
          <label class="flex items-center gap-1.5 text-xs font-black text-indigo-950 mb-1">
            <Tv class="w-3.5 h-3.5 text-amber-600" />
            <span>{{ $t('modal.favoriteCartoon') }}</span>
          </label>
          <input
            v-model="form.favoriteCartoon"
            type="text"
            placeholder="e.g. Peppa Pig, Bluey, Spiderman, Frozen, Toy Story"
            class="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Smile class="w-4 h-4" />
          <span>{{ $t('modal.confirmBooking') }}</span>
        </button>

        <div v-if="isSubmitted" class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check class="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{{ $t('modal.bookingSuccess') }}</span>
        </div>
      </form>
    </div>
  </div>
</template>
