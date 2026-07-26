<script setup lang="ts">
const items = [
  { emoji: '👩‍⚕️', title: 'Expert Pediatricians', text: 'Highly trained specialists who understand children\'s unique needs.', color: 'var(--pastel-pink)' },
  { emoji: '🎪', title: 'Fun Atmosphere', text: 'Colorful rooms, toys, and activities that make visits exciting.', color: 'var(--pastel-yellow)' },
  { emoji: '🛡️', title: 'Safe & Clean', text: 'Hospital-grade hygiene standards in a kid-friendly setting.', color: 'var(--pastel-blue)' },
  { emoji: '💬', title: 'Parent Communication', text: 'Clear updates and guidance every step of the way.', color: 'var(--pastel-lavender)' },
]
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden">
    <div class="absolute inset-0" style="background: linear-gradient(180deg, var(--kids-bg) 0%, white 100%);" />
    
    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);">
          ⭐ Why Families Trust Us
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          What Makes Us<br>Different
        </h2>
      </div>

      <div class="grid gap-8 md:grid-cols-4">
        <div
          v-for="(item, i) in items"
          :key="item.title"
          class="clay-card !rounded-3xl !p-8 text-center group hover:-translate-y-3 transition-all duration-500"
          :style="{
            transitionDelay: `${i * 100}ms`,
            background: `linear-gradient(180deg, white 60%, ${item.color}40 100%)`,
          }"
          data-reveal
        >
          <div
            class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6"
            :style="{ background: `${item.color}60` }"
          >
            {{ item.emoji }}
          </div>
          <h3 class="font-fredoka text-lg font-bold mb-3" style="color: var(--kids-text);">
            {{ item.title }}
          </h3>
          <p class="text-sm leading-relaxed" style="color: var(--kids-text-muted);">
            {{ item.text }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>