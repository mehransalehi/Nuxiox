<script setup lang="ts">
const { data } = await useFetch('/api/colleagues/public', { default: () => [] as any[] })
const cardRefs = ref<(HTMLElement | null)[]>([])
</script>

<template>
  <section id="team" class="section section-dark">
    <div class="container-premium">
      <div class="section-header" data-reveal>
        <span class="section-badge" style="color: var(--d-accent);">{{ $t('sections.team.badge') }}</span>
        <h2 class="section-title text-white">{{ $t('sections.team.title') }}</h2>
        <p class="section-subtitle">{{ $t('sections.team.subtitle') }}</p>
      </div>

      <div class="grid-team stagger" data-reveal>
        <div v-for="(item, i) in data" :key="item.id"
          class="card-premium group text-center cursor-default"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="relative w-28 h-28 mx-auto mb-6 rounded-2xl overflow-hidden"
            style="background: rgba(255,255,255,0.05);">
            <NuxtImg v-if="item.image" :src="item.image" :alt="item.title"
              class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
            <div v-else class="flex h-full items-center justify-center text-4xl opacity-30">👤</div>
          </div>
          <h3 class="font-heading text-lg font-bold text-white">{{ item.title }}</h3>
          <p class="text-sm mt-1" style="color: var(--d-accent);">{{ item.subtitle }}</p>
          <p class="text-xs mt-3 leading-relaxed" style="color: var(--d-text-light);">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>