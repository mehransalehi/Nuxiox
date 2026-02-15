<script setup lang="ts">
const { data } = await useFetch('/api/services/public', { default: () => [] as any[] })
const fallback = [
  { id: 'f1', title: 'Teeth Whitening', description: 'Professional in-clinic brightening in one session.', extra: [{ key: '45 min' }] },
  { id: 'f2', title: 'Dental Implants', description: 'Natural-looking restoration with advanced imaging.', extra: [{ key: '3D Scan' }] },
]

const items = computed(() => (data.value?.length ? data.value : fallback))
</script>

<template>
  <section class="space-y-6 scroll-reveal">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">Services</p>
        <h2 class="text-4xl font-extrabold md:text-5xl">Treatments made for your needs</h2>
      </div>
      <NuxtLink to="/contact" class="btn rounded-full border-none bg-sky-600 text-white hover:bg-sky-700">Consultation</NuxtLink>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in items" :key="item.id" class="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <h3 class="text-2xl font-bold text-sky-700">{{ item.title }}</h3>
        <ul v-if="item.extra?.length" class="my-2 flex flex-wrap gap-2">
          <li v-for="(entry, index) in item.extra" :key="`${item.id}-${index}`" class="badge badge-outline border-sky-200 text-sky-700">{{ entry.key }}</li>
        </ul>
        <p class="line-clamp-3 text-sm opacity-80">{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>
