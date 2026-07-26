<script setup lang="ts">

const { data } = await useFetch('/api/services/public', { default: () => [] as any[] })
</script>
<template>
  <section class="space-y-6">
    <h2 class="text-3xl font-bold text-center">{{ $t('sections.services.title') }}</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in data" :key="item.id" class="card bg-base-100 shadow">
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="opacity-70">{{ item.description }}</p>
          <ul v-if="item.extra?.length" class="text-sm space-y-1">
            <li v-for="(entry, index) in item.extra" :key="`${item.id}-${index}`"><span class="font-medium">{{ entry.key }}:</span> {{ entry.value }}</li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
