<script setup lang="ts">
const { t } = useI18n()
const { data } = await useFetch('/api/testimonials/public', { default: () => [] as any[] })
</script>

<template>
  <section class="rounded-3xl bg-sky-100/70 p-6 md:p-8">
    <h2 class="mb-5 text-4xl font-bold">{{ t('sections.testimonials.title') }}</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in data" :key="item.id" class="rounded-2xl bg-base-100 p-5 shadow">
        <p class="mb-3 text-lg">“{{ item.content }}”</p>
        <p class="font-semibold text-sky-600">{{ item.name }}</p>
        <p class="text-sm opacity-70">{{ item.role }}</p>
      </article>
    </div>
  </section>
</template>
