<script setup lang="ts">
const { settings } = useSiteSettings()
const aboutInfo = computed(() => settings.value.about?.info ?? [])

const visionSlides = computed(() =>
  (aboutInfo.value.length ? aboutInfo.value : [
    { key: '🎯 Our Mission', value: 'Making every child\'s visit to the doctor a happy, stress-free experience.' },
    { key: '🏥 Safe & Modern', value: 'Child-friendly equipment and a warm, playful environment designed for little ones.' },
    { key: '💚 Loving Team', value: 'Pediatric specialists who truly care about your child\'s health and happiness.' },
  ])
)

const features = [
  { icon: '🫶', title: 'Gentle Care', text: 'Soft, patient approach that puts kids at ease' },
  { icon: '🏅', title: 'Certified Experts', text: 'Board-certified pediatric specialists' },
  { icon: '🎨', title: 'Fun Environment', text: 'Colorful, toy-filled clinic rooms' },
  { icon: '📋', title: 'Clear Plans', text: 'Simple treatment plans explained to parents' },
]
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden">
    <div class="absolute inset-0 dots-pattern opacity-20" />
    
    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);">
          💚 About Us
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          Caring for Your Child<br>Like Family
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--kids-text-muted);">
          Since 2002, we've been providing gentle, expert pediatric care in a warm and welcoming environment.
        </p>
      </div>

      <div class="grid gap-10 md:grid-cols-2 items-center">
        <!-- Left: Image with 3D card -->
        <div data-reveal>
          <div class="relative">
            <NuxtImg
              src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80"
              class="w-full rounded-[24px] clay-card aspect-[4/3] object-cover"
              alt="Happy child"
            />
            <div class="absolute -bottom-4 -right-4 clay-card !rounded-2xl !p-5 float-anim"
              style="background: white;">
              <div class="flex items-center gap-3">
                <span class="text-3xl">👶</span>
                <div>
                  <div class="font-fredoka text-lg font-bold" style="color: var(--kids-text);">15,000+</div>
                  <div class="text-sm" style="color: var(--kids-text-muted);">Happy Children</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Features -->
        <div class="space-y-4" data-reveal>
          <div
            v-for="(feat, i) in features"
            :key="feat.title"
            class="clay-card !rounded-2xl !p-5 flex items-start gap-4 hover:translate-x-2 transition-all cursor-default"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
              style="background: var(--kids-bg-alt);">
              {{ feat.icon }}
            </div>
            <div>
              <h3 class="font-fredoka font-bold" style="color: var(--kids-text);">{{ feat.title }}</h3>
              <p class="text-sm mt-1" style="color: var(--kids-text-muted);">{{ feat.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>