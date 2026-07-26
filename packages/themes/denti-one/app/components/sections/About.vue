<script setup lang="ts">
const { settings } = useSiteSettings()
const aboutInfo = computed(() => settings.value.about?.info ?? [])

const infoCards = computed(() => aboutInfo.value.length
  ? aboutInfo.value
  : [
      { key: 'Patient-Centered', value: 'Every treatment starts with your comfort and goals.' },
      { key: 'Modern Equipment', value: 'Digital diagnostics and minimally invasive procedures.' },
      { key: 'Flexible Hours', value: 'Evening appointments for busy families.' },
    ])
</script>

<template>
  <section class="grid gap-6 scroll-reveal lg:grid-cols-[1fr_1.1fr]">
    <div class="space-y-4">
      <p class="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">About Clinic</p>
      <h2 class="text-4xl font-extrabold md:text-5xl">A calm and modern place for every smile.</h2>
      <p class="text-base-content/75">From preventive care to advanced cosmetic dentistry, we create personalized treatment journeys and clear communication at every step.</p>
      <img class="h-72 w-full rounded-[1.75rem] object-cover" src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1100&q=80" alt="Dentist and patient">
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <article v-for="(card, index) in infoCards" :key="`${card.key}-${index}`" class="rounded-3xl bg-[#eff8ff] p-5">
        <p class="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">{{ card.key }}</p>
        <p class="text-sm opacity-80">{{ card.value }}</p>
      </article>
      <article class="rounded-3xl bg-sky-600 p-5 text-white sm:col-span-2">
        <p class="text-sm uppercase tracking-[0.2em] text-white/70">Emergency line</p>
        <p class="mt-1 text-2xl font-extrabold">+1 (555) 120-3400</p>
        <p class="mt-2 text-sm text-white/80">Immediate support for urgent dental pain and trauma.</p>
      </article>
    </div>
  </section>
</template>
