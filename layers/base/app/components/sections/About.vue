<script setup lang="ts">
const { settings } = useSiteSettings()


const aboutInfo = computed(() => settings.value.about?.info ?? [])
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-3xl font-bold text-center">{{ $t('sections.about.title') }}</h2>
    <div class="mx-auto max-w-3xl card bg-base-100 shadow">
      <div class="card-body">
        <p class="opacity-80">{{ $t('sections.about.description') }}</p>
        <div class="grid gap-3 md:grid-cols-2">
          <div v-for="(item, index) in aboutInfo" :key="`about-${index}`" class="rounded-lg border border-base-300 p-3">
            <p class="text-sm opacity-70">{{ item.key }}</p>
            <p class="font-semibold">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
