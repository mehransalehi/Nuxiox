<script setup lang="ts">
const { t } = useI18n()
const { data } = await useFetch('/api/services/public', { default: () => [] as any[] })
</script>

<template>
  <section class="space-y-5">
    <div class="grid gap-3 md:grid-cols-2 md:items-end">
      <h2 class="text-4xl font-bold">{{ t('sections.services.title') }}</h2>
      <p class="text-sm opacity-70">At Denta Care we offer a wide range of personalized dental treatments designed for your needs.</p>
    </div>

    <div class="carousel carousel-center w-full gap-4 rounded-box">
      <article v-for="item in data" :key="item.id" class="carousel-item w-72 rounded-3xl border border-base-200 bg-sky-50 p-5 shadow-sm">
        <div class="space-y-3">
          <h3 class="text-2xl font-semibold">{{ item.title }}</h3>
          <p class="text-sm opacity-70 line-clamp-3">{{ item.description }}</p>
          <ul v-if="item.extra?.length" class="flex flex-wrap gap-2">
            <li v-for="(entry, index) in item.extra" :key="`${item.id}-${index}`" class="badge badge-outline">{{ entry.key }}</li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
