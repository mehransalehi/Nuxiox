<template>
  <section id="whyus" class="w-full bg-[#FAF8F5] py-20 border-b border-[#E6DFC9] relative">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span data-i18n="whyus.eyebrow" class="font-serif italic text-2xl text-[#C5A059] tracking-widest block">{{ $t('whyus.eyebrow') }}</span>
        <h2 data-i18n="whyus.title" class="text-3xl sm:text-5xl font-extrabold text-[#222222] font-sans">{{ $t('whyus.title') }}</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 ltr:text-left rtl:text-right">
        <div
          v-for="(card, i) in $t('whyus.cards')"
          :key="i"
          class="card-light-journal p-8 rounded-3xl space-y-4"
        >
          <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-[#E6DFC9] flex items-center justify-center text-[#C5A059] text-xl">
            <i :class="`fa-solid fa-${card.icon}`"></i>
          </div>
          <h3 :data-i18n="`whyus.cards[${i}].title`" class="text-xl font-bold text-[#222222]">{{ card.title }}</h3>
          <p :data-i18n="`whyus.cards[${i}].desc`" class="text-xs text-stone-600 leading-relaxed">{{ card.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>