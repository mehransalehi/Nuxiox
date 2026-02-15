<script setup lang="ts">
const { settings } = useSiteSettings()
const { t } = useI18n()
const aboutInfo = computed(() => settings.value.about?.info ?? [])
</script>

<template>
  <section class="space-y-5">
    <div class="grid gap-3 md:grid-cols-2 md:items-end">
      <h2 class="text-4xl font-bold">{{ t('sections.about.title') }}</h2>
      <p class="text-sm opacity-70">{{ t('sections.about.description') }}</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <article v-for="(item, index) in aboutInfo" :key="`about-${index}`" class="rounded-3xl border border-sky-100 bg-base-100 p-6 shadow-sm">
        <p class="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">{{ item.key }}</p>
        <p class="text-2xl font-bold text-sky-600">{{ item.value }}</p>
      </article>
    </div>
  </section>
</template>
