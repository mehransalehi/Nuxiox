<script setup lang="ts">
const { data } = await useFetch('/api/testimonials/public', { default: () => [] as any[] })
const activeIdx = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => { activeIdx.value = (activeIdx.value + 1) % (data.value?.length || 1) }, 4000)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <section id="testimonials" class="section">
    <div class="container-premium">
      <div class="section-header" data-reveal>
        <span class="section-badge">{{ $t('sections.testimonials.badge') }}</span>
        <h2 class="section-title">{{ $t('sections.testimonials.title') }}</h2>
        <p class="section-subtitle">{{ $t('sections.testimonials.subtitle') }}</p>
      </div>

      <div class="max-w-3xl mx-auto" data-reveal>
        <div v-for="(item, idx) in data" :key="item.id" class="transition-all duration-700"
          :class="idx === activeIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'"
          :style="{ position: idx === activeIdx ? 'relative' : 'absolute' }">

          <div class="card-premium text-center relative">
            <div class="text-7xl font-black absolute -top-4 left-8 opacity-[0.06]" style="color: var(--d-accent);">"</div>
            <div class="flex justify-center gap-1 mb-6">
              <span v-for="n in (item.rating || 5)" :key="n" class="text-lg">✦</span>
            </div>
            <p class="text-lg leading-relaxed italic mb-8 max-w-xl mx-auto" style="color: var(--d-text-muted);">
              "{{ item.content }}"
            </p>
            <div class="flex items-center justify-center gap-4">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-[var(--d-bg-alt)]">
                <NuxtImg v-if="item.avatar" :src="item.avatar" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <div class="text-left">
                <p class="font-heading font-bold text-sm">{{ item.name }}</p>
                <p class="text-xs" style="color: var(--d-text-muted);">{{ item.role }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Dots -->
        <div class="flex justify-center gap-2 mt-8">
          <button v-for="(_, idx) in data" :key="idx"
            class="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
            :class="idx === activeIdx ? 'w-8 bg-[var(--d-accent)]' : 'w-1.5 bg-[var(--d-border)]'"
            @click="activeIdx = idx" />
        </div>
      </div>
    </div>
  </section>
</template>