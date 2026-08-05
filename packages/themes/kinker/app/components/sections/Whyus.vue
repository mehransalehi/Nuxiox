<script setup>
</script>

<template>
  <section id="whyus" class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div class="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
          {{ $t('whyus.title') }}
        </div>
        <p class="text-slate-600 text-base sm:text-lg">
          {{ $t('whyus.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Feature 1 -->
        <div class="p-6 rounded-3xl bg-amber-50/70 border border-amber-100 space-y-3 text-center">
          <div class="w-12 h-12 rounded-full bg-amber-200 text-2xl flex items-center justify-center mx-auto">
            👩‍🏫
          </div>
          <h3 class="font-bold text-lg font-heading text-slate-800">
            {{ $t('whyus.card1Title') }}
          </h3>
          <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {{ $t('whyus.card1Desc') }}
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 rounded-3xl bg-teal-50/70 border border-teal-100 space-y-3 text-center">
          <div class="w-12 h-12 rounded-full bg-teal-200 text-2xl flex items-center justify-center mx-auto">
            🛡️
          </div>
          <h3 class="font-bold text-lg font-heading text-slate-800">
            {{ $t('whyus.card2Title') }}
          </h3>
          <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {{ $t('whyus.card2Desc') }}
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 rounded-3xl bg-rose-50/70 border border-rose-100 space-y-3 text-center">
          <div class="w-12 h-12 rounded-full bg-rose-200 text-2xl flex items-center justify-center mx-auto">
            🍎
          </div>
          <h3 class="font-bold text-lg font-heading text-slate-800">
            {{ $t('whyus.card3Title') }}
          </h3>
          <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {{ $t('whyus.card3Desc') }}
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="p-6 rounded-3xl bg-purple-50/70 border border-purple-100 space-y-3 text-center">
          <div class="w-12 h-12 rounded-full bg-purple-200 text-2xl flex items-center justify-center mx-auto">
            🚀
          </div>
          <h3 class="font-bold text-lg font-heading text-slate-800">
            {{ $t('whyus.card4Title') }}
          </h3>
          <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {{ $t('whyus.card4Desc') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
