<script setup lang="ts">
const { data } = await useFetch('/api/testimonials/public', { default: () => [] as any[] })

const feedback = computed(() => data.value?.length
  ? data.value
  : [
      { id: 't1', content: 'The team explained every step and made me feel relaxed.', name: 'Martha M.', role: 'Patient' },
      { id: 't2', content: 'My Invisalign progress has been excellent and super smooth.', name: 'Omid T.', role: 'Patient' },
    ])
</script>

<template>
  <section class="space-y-6 scroll-reveal">
    <div class="rounded-[2rem] bg-sky-600 p-6 text-white md:p-8">
      <div class="grid items-center gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-white/70">Need quick help?</p>
          <h2 class="text-4xl font-extrabold">Book your free consultation</h2>
        </div>
        <NuxtLink to="/contact" class="btn rounded-full border-none bg-orange-500 text-white hover:bg-orange-600">Book now ↗</NuxtLink>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in feedback" :key="item.id" class="rounded-3xl border border-sky-100 bg-white p-5">
        <p class="text-lg">“{{ item.content }}”</p>
        <p class="mt-3 font-semibold text-sky-700">{{ item.name }}</p>
        <p class="text-sm opacity-70">{{ item.role }}</p>
      </article>
    </div>
  </section>
</template>
