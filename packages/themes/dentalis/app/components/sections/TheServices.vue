<script setup lang="ts">
const { data } = await useFetch('/api/services/public', { default: () => [] as any[] })
</script>

<template>
  <section id="services" class="section">
    <div class="container-premium">
      <div class="section-header" data-reveal>
        <span class="section-badge">{{ $t('sections.services.badge') }}</span>
        <h2 class="section-title">{{ $t('sections.services.title') }}</h2>
        <p class="section-subtitle">{{ $t('sections.services.subtitle') }}</p>
      </div>

      <div class="grid-services stagger" data-reveal>
        <div v-for="(item, i) in data" :key="item.id"
          class="card-premium group cursor-default"
          :style="{ transitionDelay: `${i * 60}ms` }"
        >
          <div class="flex items-start justify-between mb-6">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6"
              style="background: var(--d-gold-gradient); color: white;">
              {{ item.icon || '✧' }}
            </div>
            <span class="font-heading text-5xl font-black opacity-[0.04]">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <h3 class="font-heading text-xl font-bold mb-3">{{ item.title }}</h3>
          <p class="text-sm leading-relaxed" style="color: var(--d-text-muted);">{{ item.description }}</p>
          <div v-if="item.extra?.length" class="mt-4 flex flex-wrap gap-2">
            <span v-for="e in item.extra" :key="e.key"
              class="text-xs px-3 py-1 rounded-full font-medium"
              style="background: var(--d-bg-alt); color: var(--d-text-muted);">
              {{ e.key }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>