<script setup lang="ts">
const { settings } = useSiteSettings()


const highlights = computed(() =>
  settings.value.navbar.info?.slice(0, 3).map((item, idx) => ({
    key: item.key,
    value: item.value,
    stat: `${(idx + 2) * 5}+`,
  })) ?? []
)

const chips = ['Braces', 'Whitening', 'Implants', 'Invisalign', 'Checkups', 'Kids Dentistry']
</script>

<template>
  <section class="space-y-5 scroll-reveal">
    <div class="grid gap-5 rounded-[2rem] bg-[#eaf6ff] p-5 md:p-8 lg:grid-cols-[1.2fr_1fr]">
      <div class="space-y-4">
        <p class="text-xs font-bold uppercase tracking-[0.35em] text-sky-700">{{ $t('site.brand') }}</p>
        <h1 class="text-5xl font-extrabold uppercase leading-[0.92] text-sky-400 md:text-7xl">Healthy Smile,<br><span class="text-sky-600">Happy Life</span></h1>
        <p class="max-w-xl text-sm text-base-content/75">Compassionate dental care with modern technology, gentle treatment plans, and a warm clinic team for every family member.</p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/contact" class="btn rounded-full border-none bg-orange-500 text-white hover:bg-orange-600">Book Appointment</NuxtLink>
          <NuxtLink to="/blog" class="btn rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50">Dental Tips</NuxtLink>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
        <div class="overflow-hidden rounded-[2rem] bg-white">
          <img class="h-full min-h-64 w-full object-cover" src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80" alt="Dental clinic">
        </div>
        <div class="space-y-2">
          <div v-for="item in highlights" :key="item.key" class="rounded-2xl bg-white p-3 shadow-sm">
            <p class="text-xl font-extrabold text-orange-500">{{ item.stat }}</p>
            <p class="text-sm font-semibold">{{ item.key }}</p>
            <p class="text-xs opacity-70">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-full border border-sky-100 bg-white px-4 py-3">
      <div class="denti-one-marquee-track flex min-w-max gap-7 text-lg font-semibold text-sky-700">
        <template v-for="i in 2" :key="i">
          <span v-for="chip in chips" :key="`${i}-${chip}`" class="flex items-center gap-3">{{ chip }} <span class="text-orange-500">✦</span></span>
        </template>
      </div>
    </div>
  </section>
</template>
