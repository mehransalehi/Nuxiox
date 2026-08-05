<script setup>
import { ref, onMounted } from 'vue'

let modalStore = null
try {
  const { useModalStore } = await import('../../stores/modal')
  modalStore = useModalStore()
} catch (e) {
  modalStore = { openBooking: () => {} }
}

function handleOpenBooking() {
  if (modalStore && modalStore.openBooking) {
    modalStore.openBooking()
  }
}
</script>

<template>
  <section id="hero" class="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/10">
    <!-- Playful Background Blobs -->
    <div class="absolute top-10 left-10 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl -z-10"></div>
    <div class="absolute bottom-10 right-10 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Text Column -->
        <div class="space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center space-x-2 gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-bold shadow-sm">
            <span>✨</span>
            <span>{{ $t('hero.badge') }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-slate-800 leading-tight">
            {{ $t('hero.title') }}
          </h1>

          <p class="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {{ $t('hero.subtitle') }}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 gap-4 pt-2">
            <button 
              @click="handleOpenBooking"
              class="btn-kindergarten-primary text-base font-bold w-full sm:w-auto text-center"
            >
              {{ $t('hero.bookBtn') }}
            </button>
            <a 
              href="#services"
              class="btn-kindergarten-secondary text-base font-bold w-full sm:w-auto text-center inline-block"
            >
              {{ $t('hero.explorePrograms') }}
            </a>
          </div>

          <!-- Trust Badges -->
          <div class="pt-6 grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 border-t border-amber-200/60">
            <div class="flex items-center space-x-3 gap-3">
              <div class="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                🧸
              </div>
              <div>
                <p class="font-bold text-slate-800 text-sm">{{ $t('hero.happyKids') }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 gap-3">
              <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                🎓
              </div>
              <div>
                <p class="font-bold text-slate-800 text-sm">{{ $t('hero.certifiedStaff') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Hero Illustration / Image Canvas -->
        <div class="relative flex justify-center">
          <div class="relative w-full max-w-md lg:max-w-none">
            <div class="aspect-4/3 rounded-3xl bg-amber-200/60 p-4 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80" 
                alt="Children playing together in kindergarten"
                class="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <!-- Floating Playful Sticker 1 -->
            <div class="absolute -top-6 -left-6 bg-white p-3 rounded-2xl shadow-lg border border-yellow-100 flex items-center space-x-2 gap-2 animate-bounce">
              <span class="text-2xl">🎨</span>
              <span class="text-xs font-bold text-slate-700">Creative Arts</span>
            </div>
            <!-- Floating Playful Sticker 2 -->
            <div class="absolute -bottom-6 -right-6 bg-white p-3 rounded-2xl shadow-lg border border-teal-100 flex items-center space-x-2 gap-2">
              <span class="text-2xl">🌿</span>
              <span class="text-xs font-bold text-slate-700">Outdoor Play</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
