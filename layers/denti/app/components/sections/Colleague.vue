<script setup lang="ts">
const { t } = useI18n()
const { data } = await useFetch('/api/colleagues/public', { default: () => [] as any[] })
</script>

<template>
  <section class="space-y-5">
    <div class="grid gap-3 md:grid-cols-2 md:items-end">
      <h2 class="text-4xl font-bold">{{ t('sections.colleagues.title') }}</h2>
      <p class="text-sm opacity-70">The expert team at Denta Care is dedicated to providing personalized dental care.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article v-for="item in data" :key="item.id" class="rounded-3xl border border-base-200 bg-base-100 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div class="mb-4 flex aspect-[3/4] items-center justify-center rounded-2xl bg-sky-100 text-6xl">👩‍⚕️</div>
        <h3 class="font-bold">{{ item.title }}</h3>
        <p class="text-sm opacity-70">{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>
