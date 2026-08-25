<template>
  <section id="technology" class="w-full bg-white py-16 border-b border-[#E6DFC9] relative">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 text-center space-y-8">
      <span data-i18n="technology.eyebrow" class="text-xs font-semibold text-stone-500 tracking-widest uppercase block">{{ $t('technology.eyebrow') }}</span>
      <div class="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-70">
        <span
          v-for="(brand, i) in $t('technology.brands')"
          :key="i"
          :data-i18n="`technology.brands[${i}]`"
          class="font-serif italic text-2xl font-bold text-[#3A2016]"
        >{{ brand }}</span>
      </div>
    </div>
  </section>
</template>