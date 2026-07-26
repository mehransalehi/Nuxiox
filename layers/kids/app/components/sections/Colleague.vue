<script setup lang="ts">
const { data } = await useFetch('/api/colleagues/public', { default: () => [] as any[] })

const team = computed(() =>
  (data.value.length ? data.value : [
    {
      id: 1,
      title: 'Dr. Sarah Mitchell',
      description: 'Lead Pediatrician · 15+ years making kids smile',
      extra: [{ key: '👩‍⚕️', value: 'Board Certified' }, { key: '⭐', value: '4.9 / 5.0' }],
    },
    {
      id: 2,
      title: 'Dr. James Chen',
      description: 'Pediatric Dentist · Gentle care specialist',
      extra: [{ key: '🦷', value: 'Kids Dentistry' }, { key: '⭐', value: '4.8 / 5.0' }],
    },
    {
      id: 3,
      title: 'Dr. Emily Park',
      description: 'Child Psychologist · Play therapy expert',
      extra: [{ key: '🧠', value: 'Behavioral Health' }, { key: '⭐', value: '4.9 / 5.0' }],
    },
    {
      id: 4,
      title: 'Dr. Michael Rivera',
      description: 'Pediatric Surgeon · Minimally invasive specialist',
      extra: [{ key: '🏥', value: 'Surgery' }, { key: '⭐', value: '4.7 / 5.0' }],
    },
    {
      id: 5,
      title: 'Nurse Lily Thompson',
      description: 'Pediatric Nurse · 10+ years of loving care',
      extra: [{ key: '💉', value: 'Vaccinations' }, { key: '⭐', value: '5.0 / 5.0' }],
    },
  ])
)

const doctorImages = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
]
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0" style="background: linear-gradient(180deg, white 0%, var(--kids-bg) 50%, white 100%);" />
    <div class="absolute inset-0 dots-pattern opacity-15" />

    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <!-- Header -->
      <div class="text-center mb-16" data-reveal>
        <span
          class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);"
        >
          🩺 Our Team
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          Meet Our Caring<br>Pediatric Specialists
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--kids-text-muted);">
          Every member of our team is hand-picked for their expertise, warmth, and love for children.
        </p>
      </div>

      <!-- Team Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(item, i) in team"
          :key="item.id"
          class="clay-card !rounded-[28px] overflow-hidden group hover:-translate-y-3 transition-all duration-500"
          :style="{ transitionDelay: `${i * 80}ms` }"
          data-reveal
        >
          <!-- Image -->
          <div class="relative h-52 overflow-hidden">
            <NuxtImg
              :src="doctorImages[i % doctorImages.length]"
              :alt="item.title"
              class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <!-- Rating badge -->
            <div
              v-if="item.extra?.length"
              class="absolute top-3 right-3 clay-card !rounded-full !px-3 !py-1 text-xs font-bold float-anim"
              style="background: white; color: var(--kids-accent); animation-delay: -2s;"
            >
              {{ item.extra[item.extra.length - 1]?.value || '⭐ 4.9' }}
            </div>
          </div>

          <!-- Body -->
          <div class="p-5">
            <h3 class="font-fredoka text-lg font-bold mb-1" style="color: var(--kids-text);">
              {{ item.title }}
            </h3>
            <p class="text-sm leading-relaxed mb-4" style="color: var(--kids-text-muted);">
              {{ item.description }}
            </p>

            <!-- Specialties -->
            <div v-if="item.extra?.length" class="flex flex-wrap gap-2">
              <span
                v-for="(entry, j) in item.extra.slice(0, -1)"
                :key="`${item.id}-spec-${j}`"
                class="inline-flex items-center gap-1 clay-card !rounded-full !px-3 !py-1 text-xs font-semibold transition-all duration-300 hover:scale-105"
                :style="{
                  background: `var(--pastel-${['pink', 'blue', 'yellow', 'mint', 'lavender'][j % 5]})60`,
                  color: 'var(--kids-text)',
                }"
              >
                {{ entry.key }} {{ entry.value }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-14" data-reveal>
        <p class="text-sm mb-4" style="color: var(--kids-text-muted);">
          Want to know more about our team?
        </p>
        <NuxtLink to="/about" class="clay-btn clay-btn-accent">
          <span>View Full Team</span>
          <span class="text-lg bounce-in" style="animation-delay: 1.5s;">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>