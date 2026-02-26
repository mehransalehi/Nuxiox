<script setup lang="ts">

const { data } = await useFetch('/api/testimonials/public', { default: () => [] as any[] })
</script>
<template>
  <section class="space-y-6">
    <h2 class="text-3xl font-bold text-center">{{ $t('sections.testimonials.title') }}</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in data" :key="item.id" class="card bg-base-100 shadow"><div class="card-body">
        <p class="text-lg">“{{ item.content }}”</p>
        <p class="font-semibold">{{ item.name }}</p>
        <p class="text-sm opacity-70">{{ item.role }}</p>
      </div></article>
    </div>
  </section>
</template>
