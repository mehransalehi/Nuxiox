<script setup lang="ts">
const results = [
  {
    emoji: '😁',
    title: 'Smile Transformation',
    before: 'https://images.unsplash.com/photo-1611800084289-7c2a23b4f5e4?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1611800084289-7c2a23b4f5e4?auto=format&fit=crop&w=600&q=80',
    description: 'From shy gums to a confident, healthy smile after gentle pediatric care.',
    color: 'var(--pastel-mint)',
  },
  {
    emoji: '🫁',
    title: 'Breathing Well Again',
    before: 'https://images.unsplash.com/photo-1607120711590-4a038a23b72c?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1607120711590-4a038a23b72c?auto=format&fit=crop&w=600&q=80',
    description: 'Asthma symptoms significantly reduced after our personalized treatment plan.',
    color: 'var(--pastel-blue)',
  },
  {
    emoji: '🥗',
    title: 'Healthy Growth Track',
    before: 'https://images.unsplash.com/photo-1616803689943-560f7f0a75f3?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1616803689943-560f7f0a75f3?auto=format&fit=crop&w=600&q=80',
    description: 'Weight and height milestones back on track with nutritional guidance.',
    color: 'var(--pastel-yellow)',
  },
  {
    emoji: '🧴',
    title: 'Allergy-Free Days',
    before: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=600&q=80',
    description: 'Seasonal allergies under control — more outdoor play, fewer sick days.',
    color: 'var(--pastel-lavender)',
  },
]

const stats = [
  { value: '2,400+', label: 'Smiles Transformed' },
  { value: '98%', label: 'Positive Outcomes' },
  { value: '12+', label: 'Years of Results' },
]
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden" style="background: var(--kids-bg);">
    <!-- Decorative blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none dots-pattern opacity-20" />
    <div
      class="absolute -top-20 -right-20 w-60 h-60 rounded-full"
      style="background: var(--pastel-pink); filter: blur(60px); opacity: 0.25; animation: blobFloat 10s ease-in-out infinite;"
    />
    <div
      class="absolute -bottom-20 -left-20 w-56 h-56 rounded-full"
      style="background: var(--pastel-blue); filter: blur(55px); opacity: 0.2; animation: blobFloat 12s ease-in-out infinite 2s;"
    />

    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <!-- Section Header -->
      <div class="text-center mb-16" data-reveal>
        <span
          class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);"
        >
          ✨ Before & After
        </span>
        <h2
          class="font-fredoka text-4xl md:text-5xl font-bold mb-4"
          style="color: var(--kids-text);"
        >
          Real Results,<br>Real Smiles
        </h2>
        <p
          class="text-lg max-w-2xl mx-auto"
          style="color: var(--kids-text-muted);"
        >
          See how our gentle pediatric care transforms little lives every day.
        </p>
      </div>

      <!-- Results Grid -->
      <div class="grid gap-8 md:grid-cols-2">
        <div
          v-for="(item, i) in results"
          :key="item.title"
          class="clay-card !rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500"
          :style="{
            transitionDelay: `${i * 100}ms`,
            background: `linear-gradient(180deg, white 60%, ${item.color}40 100%)`,
          }"
          data-reveal
        >
          <!-- Image Comparison Area -->
          <div class="relative h-52 overflow-hidden">
            <NuxtImg
              :src="item.after"
              :alt="item.title"
              class="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <!-- Emoji Badge -->
            <div
              class="absolute top-3 left-3 clay-card !rounded-2xl !px-3 !py-1.5 text-lg float-anim"
              style="background: white;"
            >
              {{ item.emoji }}
            </div>
            <!-- Before/After Label -->
            <div
              class="absolute bottom-3 right-3 clay-card !rounded-full !px-4 !py-1.5 text-xs font-bold float-anim-delayed"
              style="background: white; color: var(--kids-primary-dark);"
            >
              Before → After
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-6">
            <h3
              class="font-fredoka text-xl font-bold mb-2"
              style="color: var(--kids-text);"
            >
              {{ item.title }}
            </h3>
            <p
              class="text-sm leading-relaxed"
              style="color: var(--kids-text-muted);"
            >
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div
        class="mt-14 grid gap-6 sm:grid-cols-3"
        data-reveal
      >
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="clay-card !rounded-2xl !p-6 text-center"
          :style="{
            transitionDelay: `${i * 150}ms`,
            background: 'white',
          }"
        >
          <div
            class="font-fredoka text-3xl md:text-4xl font-bold mb-1"
            style="color: var(--kids-primary);"
          >
            {{ stat.value }}
          </div>
          <div
            class="text-sm font-semibold"
            style="color: var(--kids-text-muted);"
          >
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="text-center mt-14" data-reveal>
        <NuxtLink
          to="/gallery"
          class="clay-btn clay-btn-accent text-base px-10 py-4"
        >
          <span>View Full Gallery</span>
          <span class="text-xl bounce-in" style="animation-delay: 1.5s;">✨</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>